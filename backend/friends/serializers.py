#friends/serializers.py
from rest_framework import serializers
from .models import Friendship
from users.models import User


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['sender', 'receiver', 'status']
        
class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']