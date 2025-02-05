import json
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
import math
import asyncio
from users.models import User, PlayerMatch, PlayerProfile, Match

class GameConsumer(AsyncWebsocketConsumer):
    FIELD_WIDTH = 26
    FIELD_LEN = 32
    BALL_SPEED = 0.12
    MAX_SCORE_COUNT = 5
    MAX_SET_COUNT = 3
    UPDATE_INTERVAL = 1/60  # 60 FPS

    async def connect(self):
        await self.accept()
        
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        self.game_name = None
        self.player_profile = await self.get_player_number()
        self.game_loop_task = None

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

        await self.channel_layer.group_send(
            self.game_name,
            {
                'type': 'player_disconnected',
                'player': await self.get_player_number()
            }
        )

    async def game_loop(self):
        while True:
            await self.update_ball_position()
            await asyncio.sleep(self.UPDATE_INTERVAL)

    async def update_ball_position(self):
        [vx, vy, vz] = self.ball_velocity
        [px, py, pz] = self.ball_position
        new_position = [px + vx, py + vy, pz + vz]

        ball_radius = 0.7
        half_width = (self.FIELD_WIDTH - 2) / 2 - ball_radius
        half_length = (self.FIELD_LEN - 2) / 2 - ball_radius

        if abs(new_position[0]) > half_width:
            new_position[0] = half_width if new_position[0] > 0 else -half_width
            self.ball_velocity[0] = -self.ball_velocity[0]

        if abs(new_position[2]) > half_length:
            scoring_player = 2 if new_position[2] > 0 else 1
            await self.update_score(scoring_player)
            return

        self.ball_position = new_position

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
        try:
            data = json.loads(text_data)
            
            if 'join' in data:
                await self.handle_join()
                return

            action = data.get("action")

            if action == "update_player_position":
                player = data.get("player")
                position = data.get("position")
                await self.update_player_position(player, position)

            elif action == "player_info":
                user_id = data.get("user_id")
                display_name = data.get("display_name")
                await self.store_player_info(user_id, display_name)

        except Exception as e:
            print(f"Error in receive: {str(e)}")

    async def handle_join(self):
        if not self.game_name:
            self.game_name = await self.get_or_create_game_room()
            await self.channel_layer.group_add(self.game_name, self.channel_name)

            if not hasattr(self, "game_initialized"):
                self.initialize_game_state()

            player_number = await self.get_player_number()
            await self.send(json.dumps({
                "type": "player_assignment",
                "player_number": player_number,
                "display_name": self.player_profile.display_name
            }))

            if await self.are_both_players_connected():
                self.game_loop_task = asyncio.create_task(self.game_loop())
                await self.send_game_start()

    @sync_to_async
    def store_player_info(self, user_id, display_name):
        """ Store or update player info in the database """
        user = User.objects.filter(id=user_id).first()
        if user:
            player_profile, created = PlayerProfile.objects.get_or_create(user=user)
            player_profile.display_name = display_name
            player_profile.save()
            print(f"Stored player info: {display_name} (ID: {user_id})")

    @database_sync_to_async
    def get_or_create_game_room(self):
        channel_layer = get_channel_layer()
        
        for room in getattr(channel_layer, '_rooms', {}).keys():
            if room.startswith('pong_game_') and len(channel_layer._rooms[room]) < 2:
                print(f"Joining existing room: {room}")
                return room
        
        new_room = f'pong_game_{uuid.uuid4()}'
        print(f"Creating new room: {new_room}")
        return new_room

    @database_sync_to_async
    def get_player_number(self):
        channel_layer = self.channel_layer
        room = channel_layer._rooms[self.game_name]
        player_number = 1 if self.channel_name == list(room)[0] else 2
        print(f"Assigned player number {player_number} in room {self.game_name}")
        return player_number

    # @database_sync_to_async
    # def get_player_number(self):
    #     channel_layer = self.channel_layer
    #     room = channel_layer._rooms[self.game_name]
    #     player_number = 1 if self.channel_name == list(room)[0] else 2
    #     print(f"Assigned player number {player_number} in room {self.game_name}")
    #     return player_number

    @database_sync_to_async
    def are_both_players_connected(self):
        room_size = len(self.channel_layer._rooms[self.game_name])
        print(f"Room {self.game_name} has {room_size} players")
        return room_size == 2

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
            
    @database_sync_to_async
    def save_match_result(self, winner):
        channel_layer = self.channel_layer
        room = channel_layer._rooms[self.game_name]
        players = list(room)
        
        player1_profile = PlayerProfile.objects.get(user=players[0].scope["user"])
        player2_profile = PlayerProfile.objects.get(user=players[1].scope["user"])
        
        match = Match.objects.create(
            player1=player1_profile,
            player2=player2_profile,
            winner=player1_profile if winner == 1 else player2_profile,
            score_player1=self.scores['p1_f_score'],
            score_player2=self.scores['p2_f_score']
        )
        
        if winner == 1:
            player1_profile.wins += 1
            player2_profile.losses += 1
        else:
            player2_profile.wins += 1
            player1_profile.losses += 1
            
        player1_profile.save()
        player2_profile.save()
        
        PlayerMatch.objects.create(player=player1_profile, match=match)
        PlayerMatch.objects.create(player=player2_profile, match=match)

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
