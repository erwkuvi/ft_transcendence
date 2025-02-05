from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            token_key = (dict((x.split('=') for x in scope['query_string'].decode().split("&")))).get('token', None)
        except ValueError:
            token_key = None
        scope['user'] = AnonymousUser() if token_key is None else await get_user(token_key)
        return await super().__call__(scope, receive, send)


class CustomHeaderMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b'authorization' in headers:
            scope['authorization'] = headers[b'authorization'].decode()
        return await super().__call__(scope, receive, send)

class JWTAuthMiddleware(BaseMiddleware):
    
    async def __call__(self, scope, receive, send):
    
        token = self.get_token_from_scope(scope)
        
        if token != None:
            user_id = await self.get_user_from_token(token) 
            if user_id:
                scope['user_id'] = user_id

            else:
                scope['error'] = 'Invalid token'

        if token == None:
            scope['error'] = 'provide an auth token'    
    
                
        return await super().__call__(scope, receive, send)

    def get_token_from_scope(self, scope):
        headers = dict(scope.get("headers", []))
        
        auth_header = headers.get(b'authorization', b'').decode('utf-8')
        
        if auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        
        else:
            return None
        
    @database_sync_to_async
    def get_user_from_token(self, token):
            try:
                access_token = AccessToken(token)
                return access_token['user_id']
            except:
                return None
