from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path('ws/socket-server/', consumers.ChatConsumer.as_asgi()),
	re_path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
]
