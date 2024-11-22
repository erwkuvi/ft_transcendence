from rest_framework import serializers
from ..models import Notification

class NotificationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'title', 'body', 'active')
