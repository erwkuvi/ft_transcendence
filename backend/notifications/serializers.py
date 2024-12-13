from .models import Notification
from rest_framework.serializers import ModelSerializer
from django.conf import settings

User = settings.AUTH_USER_MODEL


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['notification_type', 'receiver', 'body', 'timestamp']
        read_only_fields = ('timestamp', 'body')
