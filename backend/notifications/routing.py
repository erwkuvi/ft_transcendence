from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from notifications.consumers import NotificationConsumer, OnlineStatusConsumer

websocket_urlpatterns = [
        re_path(r'ws/notifications/', NotificationConsumer.as_asgi()),
        re_path(r'ws/online-status/', OnlineStatusConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
