# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()  # Accepts the WebSocket connection

    async def disconnect(self, close_code):
		# The disconnect method is currently empty.
        # This is because, in this example, there's no specific cleanup or action
        # required when a WebSocket connection is closed.
        # However, you may want to add logic here to handle any necessary
        # cleanup or notifications to other clients when a user disconnects.
        #
        # For example:
        # - Remove the user from a group or chat room
        # - Notify other clients about the disconnection
        # - Log the disconnection event
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        
        # Broadcast the message back to the WebSocket clients
        await self.send(text_data=json.dumps({
            'message': message
        }))

