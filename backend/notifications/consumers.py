import json
import httpx
from django.conf import settings
from django.core.handlers.asgi import ASGIRequest, ASGIHandler
from channels.db import database_sync_to_async
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import F
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.apps import apps

PlayerProfile = apps.get_model('users', 'PlayerProfile')

User = get_user_model()


class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Scope at the beginning of connect:", self.scope)  # Print the scope for debugging
        self.user = self.scope['user']
        if self.user.is_authenticated:
            await self.update_user_incr(self.user)
            await self.notify_status_change(online=True)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.update_user_decr(self.user)
            await self.notify_status_change(online=False)

    @database_sync_to_async
    def update_user_incr(self, user):
        User.objects.filter(pk=user.pk).update(online=F('online') + 1)

    @database_sync_to_async
    def update_user_decr(self, user):
        User.objects.filter(pk=user.pk).update(online=F('online') - 1)

    async def notify_status_change(self, online):
        friends = self.get_friends(self.user.id)

        for friend_id in friends:
            friend_group_name = f'notifications_{friend_id}'
            await self.channel_layer.group_send(
                friend_group_name,
                {
                    'type': 'friend_status',
                    'user_id': self.user.id,
                    'online': online
                }
            )

    def get_friends(self, user_id):
        try:
            profile = PlayerProfile.objects.get(user_id=user_id)
            return profile.friends
        except PlayerProfile.DoesNotExist:
            return []

#class OnlineStatusConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        self.user = self.scope['user']
#        if self.user.is_authenticated:
#            await self.update_user_incr(self.user)
#            await self.accept()
#        else:
#            await self.close()
#
#    async def disconnect(self, close_code):
#        if self.user.is_authenticated:
#            await self.update_user_decr(self.user)
#
#    @database_sync_to_async
#    def update_user_incr(self, user):
#        User.objects.filter(pk=user.pk).update(online=F('online') + 1)
#
#    @database_sync_to_async
#    def update_user_decr(self, user):
#        User.objects.filter(pk=user.pk).update(online=F('online') - 1)


class NotificationConsumer(AsyncWebsocketConsumer):
    def get_user_id(self):
        query_string = self.scope.get('query_string', b'').decode()
        query_params = dict(param.split('=') for param in query_string.split('&') if '=' in param)
        user_id = query_params.get('user_id')
        if user_id:
            print(f'USER_ID= {user_id}')
            return user_id
        return ''

    async def connect(self):
        user_id = self.get_user_id()
        if not user_id:
            print(f'----------------------------- no user_id ------------------------')
        else:
            print(f'user id: {user_id}')
        if user_id is not None:
            self.group_name = f'notifications_{user_id}'
            print(f'Attempting to connect to group: {self.group_name}')
            print(f'Extracted user_id: {user_id}')  # Print to terminal
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
            #print("Scope's Beginning --------------------------")
            #print(self.scope)
            #print("Scope's End -----------------")
            await self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'You are now connected!!!',
                'user_id': user_id,  # Send user_id to web console
                'group_name': self.group_name  # Send user_id to web console
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

