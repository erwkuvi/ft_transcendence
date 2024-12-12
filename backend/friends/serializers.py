#friends/serializers.py
from rest_framework import serializers
from .models import Friendship
from users.models import User


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['sender', 'receiver', 'status']
        

class BasicUserSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'status']

    def get_status(self, obj):
        user = self.context['request'].user
        
        try:
            friendship = Friendship.objects.get(sender=user, receiver=obj)

            return friendship.status
        except Friendship.DoesNotExist:
            return None