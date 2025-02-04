import json
from channels.generic.websocket import AsyncWebsocketConsumer
import math
import asyncio

class GameConsumer(AsyncWebsocketConsumer):
    FIELD_WIDTH = 26
    FIELD_LEN = 32
    BALL_SPEED = 0.12
    MAX_SCORE_COUNT = 5
    MAX_SET_COUNT = 3
    UPDATE_INTERVAL = 1/60  # 60 FPS

    async def connect(self):
        self.game_name = "pong_game"
        await self.channel_layer.group_add(
            self.game_name,
            self.channel_name
        )
        self.ball_position = [0, 1, 0]
        self.ball_velocity = [0.1, 0, 0.1]
        self.player_positions = {
            'player1': [0, 1, self.FIELD_LEN / 2 - 1.5],
            'player2': [0, 1, -self.FIELD_LEN / 2 + 1.5]
        }
        self.scores = {
            'p1_f_score': 0,
            'p2_f_score': 0,
            'p1_in_set_score': 0,
            'p2_in_set_score': 0,
            'p1_won_set_count': 0,
            'p2_won_set_count': 0,
        }
        self.game_loop_task = None
        await self.accept()
        self.game_loop_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        if self.game_loop_task:
            self.game_loop_task.cancel()
            try:
                await self.game_loop_task
            except asyncio.CancelledError:
                pass
        await self.channel_layer.group_discard(
            self.game_name,
            self.channel_name
        )

    async def game_loop(self):
        while True:
            await self.update_ball_position()
            await asyncio.sleep(self.UPDATE_INTERVAL)

    async def update_ball_position(self):
        # Calculate the new position
        [vx, vy, vz] = self.ball_velocity
        [px, py, pz] = self.ball_position
        new_position = [px + vx, py + vy, pz + vz]

        # Field boundaries (accounting for ball radius)
        ball_radius = 0.7
        half_width = (self.FIELD_WIDTH - 2) / 2 - ball_radius
        half_length = (self.FIELD_LEN - 2) / 2 - ball_radius

        # Check wall collisions
        if abs(new_position[0]) > half_width:
            new_position[0] = half_width if new_position[0] > 0 else -half_width
            self.ball_velocity[0] = -self.ball_velocity[0]

        # Check for scoring
        if abs(new_position[2]) > half_length:
            scoring_player = 2 if new_position[2] > 0 else 1
            await self.update_score(scoring_player)
            return

        # Update ball position
        self.ball_position = new_position

        # Broadcast new state
        await self.channel_layer.group_send(
            self.game_name,
            {
                'type': 'update_game_state',
                'ball_position': self.ball_position,
                'ball_velocity': self.ball_velocity,
                'scores': self.scores,
                'player_positions': self.player_positions
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'update_player_position':
            player = data.get('player')
            position = data.get('position')
            await self.update_player_position(player, position)
        elif action == 'ball_collision':
            player = data.get('player')
            ball_pos = data.get('ballPosition')
            player_pos = data.get('playerPosition')
            ball_position = [ball_pos['x'], ball_pos['y'], ball_pos['z']]
            player_position = [player_pos['x'], player_pos['y'], player_pos['z']]
            await self.handle_ball_collision(player, ball_position, player_position)

    async def update_player_position(self, player, position):
        player_key = f'player{player}'
        if player_key in self.player_positions:
            self.player_positions[player_key] = position
            
            await self.channel_layer.group_send(
                self.game_name,
                {
                    'type': 'update_game_state',
                    'ball_position': self.ball_position,
                    'ball_velocity': self.ball_velocity,
                    'scores': self.scores,
                    'player_positions': self.player_positions
                }
            )

    def calculate_reflection(self, ball_pos, player_pos):
        collide_point = (ball_pos[0] - player_pos[0]) / 2
        angle_rad = (math.pi / 4) * collide_point
        direction = 1 if ball_pos[2] > 0 else -1
        
        return [
            self.BALL_SPEED * math.sin(angle_rad),
            0,
            -direction * self.BALL_SPEED * math.cos(angle_rad)
        ]

    async def update_game_state(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'ball_position': event['ball_position'],
            'ball_velocity': event['ball_velocity'],
            'scores': event['scores'],
            'player_positions': event.get('player_positions', self.player_positions)
        }))

    async def handle_ball_collision(self, player, ball_pos, player_pos):
        new_velocity = self.calculate_reflection(ball_pos, player_pos)
        self.ball_velocity = new_velocity
        self.ball_position = ball_pos
        
        self.BALL_SPEED = min(self.BALL_SPEED * 1.1, 0.3)
        
        await self.channel_layer.group_send(
            self.game_name,
            {
                'type': 'update_game_state',
                'ball_position': self.ball_position,
                'ball_velocity': self.ball_velocity,
                'scores': self.scores
            }
        )

    async def update_score(self, player):
        if player == 1:
            self.scores['p1_f_score'] += 1
            self.scores['p1_in_set_score'] += 1
            if self.scores['p1_in_set_score'] >= self.MAX_SCORE_COUNT:
                self.scores['p1_won_set_count'] += 1
                self.scores['p1_in_set_score'] = 0
                self.scores['p2_in_set_score'] = 0
        else:
            self.scores['p2_f_score'] += 1
            self.scores['p2_in_set_score'] += 1
            if self.scores['p2_in_set_score'] >= self.MAX_SCORE_COUNT:
                self.scores['p2_won_set_count'] += 1
                self.scores['p1_in_set_score'] = 0
                self.scores['p2_in_set_score'] = 0

        self.ball_position = [0, 1, 0]
        self.BALL_SPEED = 0.12
        self.ball_velocity = [0.1, 0, 0.1 if player == 2 else -0.1]

        await self.channel_layer.group_send(
            self.game_name,
            {
                'type': 'update_game_state',
                'ball_position': self.ball_position,
                'ball_velocity': self.ball_velocity,
                'scores': self.scores
            }
        )

        if (self.scores['p1_won_set_count'] >= self.MAX_SET_COUNT or 
            self.scores['p2_won_set_count'] >= self.MAX_SET_COUNT):
            winner = 1 if self.scores['p1_won_set_count'] >= self.MAX_SET_COUNT else 2
            await self.send(text_data=json.dumps({
                'type': 'game_over',
                'winner': winner
            }))
            
    # async def restart_game(self):
    #     # Reset game state
    #     self.scores = {
    #         'p1_f_score': 0,
    #         'p2_f_score': 0,
    #         'p1_in_set_score': 0,
    #         'p2_in_set_score': 0,
    #         'p1_won_set_count': 0,
    #         'p2_won_set_count': 0,
    #     }
        
    #     self.ball_position = [0, 1, 0]
    #     self.BALL_SPEED = 0.12
    #     self.ball_velocity = [0.1, 0, 0.1]

    #     self.player_positions = {
    #         'player1': [0, 1, self.FIELD_LEN / 2 - 1.5],
    #         'player2': [0, 1, -self.FIELD_LEN / 2 + 1.5]
    #     }

    #     # Notify players about the game restart
    #     await self.channel_layer.group_send(
    #         self.game_name,
    #         {
    #             'type': 'update_game_state',
    #             'ball_position': self.ball_position,
    #             'ball_velocity': self.ball_velocity,
    #             'scores': self.scores,
    #             'player_positions': self.player_positions
    #         }
    #     )

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     action = data.get('action')

    #     if action == 'update_player_position':
    #         player = data.get('player')
    #         position = data.get('position')
    #         await self.update_player_position(player, position)
    #     elif action == 'ball_collision':
    #         player = data.get('player')
    #         ball_pos = data.get('ballPosition')
    #         player_pos = data.get('playerPosition')
    #         ball_position = [ball_pos['x'], ball_pos['y'], ball_pos['z']]
    #         player_position = [player_pos['x'], player_pos['y'], player_pos['z']]
    #         await self.handle_ball_collision(player, ball_position, player_position)
    #     elif action == 'restart_game':
    #         await self.restart_game()
