from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
import json


# Consumers are the equivalent of Django views but for handling WebSocket connections.
# They are responsible for managing the lifecycle of a WebSocket connection,
# Handling messages sent and received over the connection.


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected!'
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        message = text_data_json.get('message')

        ## print('Message:', message) ## for dev

        if message_type == 'friend_request':
            await self.handle_friend_request(message)
        elif message_type == 'match_invite':
            await self.handle_match_invite(message)
        else:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Unknown message type'
            }))

    async def handle_friend_request(self, message):
        # Logic to handle friend request
        print('Friend Request:', message)
        await self.send(text_data=json.dumps({
            'type': 'friend_request',
            'message': message
        }))

    async def handle_match_invite(self, message):
        # Logic to handle match invite
        print('Match Invite:', message)
        await self.send(text_data=json.dumps({
            'type': 'match_invite',
            'message': message
        }))


#### Explanation:
#1. **`receive` Method**: This method now checks the `type` of the incoming message and calls the appropriate handler method (`handle_friend_request` or `handle_match_invite`).
#2. **`handle_friend_request` Method**: This method handles friend request notifications.
#3. **`handle_match_invite` Method**: This method handles match invite notifications.
#
#### Sending Notifications from the Backend
#To send notifications from the backend, you can use Django Channels' `channel_layer` to send messages to the WebSocket.
#
#Here is an example of how you can send a friend request notification from a Django view:
#
#```python
#from channels.layers import get_channel_layer
#from asgiref.sync import async_to_sync
#
#def send_friend_request_notification(user, message):
#    channel_layer = get_channel_layer()
#    async_to_sync(channel_layer.group_send)(
#        f'user_{user.id}',  # Group name
#        {
#            'type': 'friend_request',
#            'message': message
#        }
#    )
#```
#
#### Summary:
#1. Extend your consumer to handle different types of notifications.
#2. Implement methods to handle specific notifications.
#3. Use Django Channels' `channel_layer` to send notifications from the backend.
#
#This setup will allow you to create and handle notifications for friend requests and match invites effectively.
#
