# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import notify_conf_files.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notify_conf_files.settings')

application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            notify_conf_files.routing.websocket_urlpatterns
        )
    ),
})
