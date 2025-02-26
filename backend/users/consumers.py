import json
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import F
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from .models import PlayerProfile

User = get_user_model()

class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract user_id and token from the query string
        query_string = self.scope['query_string'].decode()
        query_params = dict(param.split('=') for param in query_string.split('&'))
        user_id = query_params.get('user_id')
        token = query_params.get('token')

        # Authenticate the user
        self.user = await self.authenticate_user(user_id, token)

        if self.user.is_authenticated:
            await self.update_user_incr(self.user)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.update_user_decr(self.user)

    @database_sync_to_async
    def authenticate_user(self, user_id, token):
        try:
            # Validate the token
            validated_token = UntypedToken(token)
            # Check if the user_id matches the token's user_id
            if str(validated_token['user_id']) == user_id:
                return User.objects.get(id=user_id)
        except (InvalidToken, TokenError, User.DoesNotExist):
            return AnonymousUser()

    @database_sync_to_async
    def update_user_incr(self, user):
        PlayerProfile.objects.filter(user=user).update(online=True)
        #print("PlayerProfile online status set to True")

    @database_sync_to_async
    def update_user_decr(self, user):
        PlayerProfile.objects.filter(user=user).update(online=False)
        #print("PlayerProfile online status set to False")


#class OnlineStatusConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        print("Scope at the beginning of connect:", self.scope)  # Print the scope for debugging
#        self.user = self.scope['user']
#        if self.user.is_authenticated:
#            await self.update_user_incr(self.user)
#            await self.notify_status_change(online=True)
#            await self.accept()
#        else:
#            await self.close()
#
#    async def disconnect(self, close_code):
#        if self.user.is_authenticated:
#            await self.update_user_decr(self.user)
#            await self.notify_status_change(online=False)
#
#    @database_sync_to_async
#    def update_user_incr(self, user):
#        User.objects.filter(pk=user.pk).update(online=F('online') + 1)
#
#    @database_sync_to_async
#    def update_user_decr(self, user):
#        User.objects.filter(pk=user.pk).update(online=F('online') - 1)
#
#    async def notify_status_change(self, online):
#        friends = self.get_friends(self.user.id)
#
#        for friend_id in friends:
#            friend_group_name = f'notifications_{friend_id}'
#            await self.channel_layer.group_send(
#                friend_group_name,
#                {
#                    'type': 'friend_status',
#                    'user_id': self.user.id,
#                    'online': online
#                }
#            )
#
#    def get_friends(self, user_id):
#        try:
#            profile = PlayerProfile.objects.get(user_id=user_id)
#            return profile.friends
#        except PlayerProfile.DoesNotExist:
#            return []

#class OnlineStatusConsumer(AsyncWebsocketConsumer):
#    async def connect(self):
#        await self.accept()
#        print("Connection accepted: WebSocket connection established")
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
