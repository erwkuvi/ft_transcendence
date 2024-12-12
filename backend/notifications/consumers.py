import json
import httpx
from django.conf import settings
#from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import async_to_sync


# Consumers are the equivalent of Django views but for handling WebSocket connections.
# They are responsible for managing the lifecycle of a WebSocket connection,
# Handling messages sent and received over the connection.

#        user_id = await self.get_user_id_from_endpoint()
#        if user_id is not None:
#            self.group_name = f'notifications_{user_id}'
#            print(f'Attempting to connect to group: {self.group_name}')
#            print(f'Extracted user_id: {user_id}')  # Print to terminal
#            await self.channel_layer.group_add(
#                self.group_name,
#                self.channel_name
#            )
#            await self.accept()
#            await self.send(text_data=json.dumps({
#                'type': 'connection_established',
#                'message': 'You are now connected!!!',
#                'user_id': user_id  # Send user_id to web console
#            }))
#        else:
#            await self.close()

class NotificationConsumer(AsyncWebsocketConsumer):
    def get_authorization_header(self):
        headers = dict(self.scope['headers'])
        auth_header = headers.get(b'authorization')
        if auth_header:
            return auth_header.decode()
        return ''

    async def get_user_id_from_endpoint(self):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'http://{settings.HOST_IP}/api/test/user_id/',
                headers={
                    'Authorization': self.get_authorization_header()
                }
            )
        if response.status_code == 200:
            user_data = response.json()
            return user_data.get('user_id')
        return None

    async def connect(self):
        await self.accept()
        print(self.scope)
        user_id = await self.get_user_id_from_endpoint()
        if user_id is not None:
            self.group_name = f'notifications_{user_id}'
            print(f'Attempting to connect to group: {self.group_name}')
            print(f'Extracted user_id: {user_id}')  # Print to terminal
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'You are now connected!!!',
                'user_id': user_id  # Send user_id to web console
            }))
        else:
            await self.close()

    async def disconnect(self, close_code):
        pass
        #if self.user is not None:
        #    await self.channel_layer.group_discard(
        #        self.group_name,
        #        self.channel_name
        #)

    async def receive(self, text_data):
        data = json.loads(text_data)
        body = data['body']
        message = data['message']

        print('message:', message)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_notification',
                'message': message,
                'body': body
            }
        )

    async def send_notification(self, event):
        body = event['body']
        message = event['message']

        await self.send(text_data=json.dumps({
            'type': 'notification',
            'message': message,
            'body': body
        }))

    @database_sync_to_async
    def get_user_from_token(self):
        try:
            token = self.scope['query_string'].decode().split('=')[1]
            validated_token = UntypedToken(token)
            jwt_auth = JWTAuthentication()
            user = jwt_auth.get_user(validated_token)
            return user
        except (InvalidToken, TokenError, IndexError):
            return None

#class NotificationConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        #self.user = self.scope['user']
#        #self.group_name = f'notifications_{self.user.id}'
#        self.group_name = 'test_group'
#
##        if self.user.is_anonymous:
##            print('not authenticated')  # for dev
##            await self.close()
##        else:
##            await self.channel_layer.group_add(
##                    self.group_name,
##                    self.channel_name
##            )
##            await self.accept()
##            await self.send(text_data=json.dumps({
##                'type': 'connection_established',
##                'message': 'You are now connected!'
##            }))
#        await self.channel_layer.group_add(
#                self.group_name,
#                self.channel_name
#                )
#        await self.accept()
#        await self.send(text_data=json.dumps({
#            'type': 'connection_established',
#            'message': 'You are now connected!'
#            }))
#
#    async def disconnect(self, close_code):
#        await self.channel_layer.group_discard(
#                self.group_name,
#                self.channel_name
#        )
#
#    async def receive(self, text_data):
#        data = json.loads(text_data)
#        await self.channel_layer.group_send(
#                self.group_name,
#                {
#                    'type': 'send_notification',
#                    'message': data['message']
#                }
#        )
#
#    async def send_notification(self, event):
#        message = event['message']
#        print('Message:', message)  # for dev
#        await self.send(text_data=json.dumps({
#            'message': message
#        }))
#
##        message_type = text_data_json.get('type')
##        message = text_data_json.get('message')
##
##
##        if message_type == 'friend_request':
##            await self.handle_friend_request(message)
##        elif message_type == 'match_invite':
##            await self.handle_match_invite(message)
##        else:
##            await self.send(text_data=json.dumps({
##                'type': 'chat',
##                'message': message
##            }))
##        #else:
##        #    await self.send(text_data=json.dumps({
##        #        'type': 'error',
##        #        'message': 'Unknown message type'
##        #    }))
##
##    async def handle_friend_request(self, message):
##        # Logic to handle friend request
##        print('Friend Request:', message)
##        await self.send(text_data=json.dumps({
##            'type': 'friend_request',
##            'message': message
##        }))
##
##    async def handle_match_invite(self, message):
##        # Logic to handle match invite
##        print('Match Invite:', message)
##        await self.send(text_data=json.dumps({
##            'type': 'match_invite',
##            'message': message
##        }))
#
#class ChatConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        await self.accept()
#        await self.send(text_data=json.dumps({
#            'type': 'connection_established',
#            'message': 'You are now connected!'
#        }))
#
#    async def disconnect(self, close_code):
#        pass
#
#    async def receive(self, text_data):
#        text_data_json = json.loads(text_data)
#        message_type = text_data_json.get('type')
#        message = text_data_json.get('message')
#
#
#        if message_type == 'friend_request':
#            await self.handle_friend_request(message)
#        elif message_type == 'match_invite':
#            await self.handle_match_invite(message)
#        else:
#            print('Message:', message) ## for dev
#            await self.send(text_data=json.dumps({
#                'type': 'chat',
#                'message': message
#            }))
#        #else:
#        #    await self.send(text_data=json.dumps({
#        #        'type': 'error',
#        #        'message': 'Unknown message type'
#        #    }))
#
#    async def handle_friend_request(self, message):
#        # Logic to handle friend request
#        print('Friend Request:', message)
#        await self.send(text_data=json.dumps({
#            'type': 'friend_request',
#            'message': message
#        }))
#
#    async def handle_match_invite(self, message):
#        # Logic to handle match invite
#        print('Match Invite:', message)
#        await self.send(text_data=json.dumps({
#            'type': 'match_invite',
#            'message': message
#        }))
