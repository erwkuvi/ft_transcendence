from .models import Notification
from rest_framework.serializers import ModelSerializer
from django.conf import settings

User = settings.AUTH_USER_MODEL


class NotificationModelSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
