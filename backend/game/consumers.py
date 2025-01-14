import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from .game_logic import move_ball, update_paddle, get_game_state

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f'Attempting to connect')
        await self.accept()
        # self.room_name = "game_room"
        # self.room_group_name = "game_room"

        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )

        # await self.accept()
        # await self.send(text_data=json.dumps({
        #     'message': 'Connection established!'
        # }))

    # async def disconnect(self, close_code):
    #     await self.channel_layer.group_discard(
    #         self.room_group_name,
    #         self.channel_name
    #     )

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
            if text_data == 'PING':
                 await self.send('PONG')

    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     action = text_data_json.get('action', None)

    #     if action == "MOVE_PADDLE":
    #         player = text_data_json['player']
    #         x_position = text_data_json['x']
    #         update_paddle(player, x_position)

    #     # Update the ball's position and check for collisions
    #     move_ball()

    #     # Broadcast the updated game state to all connected clients
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'game_update',
    #             'game_state': get_game_state(),
    #         }
    #     )

    # async def game_update(self, event):
    #     await self.send(text_data=json.dumps({
    #         'game_state': event['game_state']
    #     }))
