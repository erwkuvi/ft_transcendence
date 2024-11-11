# serializers.py
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import User, PlayerProfile, Match, PlayerMatch
from django.urls import reverse
#from users.signals.handlers import match_created
from .signals import match_created


# for creating a new user, which information is asked
class UserCreateSerializer(BaseUserCreateSerializer):
    auth_url = serializers.SerializerMethodField()

    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name', 'auth_url']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        callback_uri = f"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-000d79361be733aa7365ca50efc33b41b38c6e1b19d4f5b16456e9e63726df67&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fusers%2F&response_type=code"
        representation['callback_uri'] = callback_uri
        return representation


# for the current user, which information is shown
class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'first_name',
                  'last_name', 'email']


# Serializer for Player
class PlayerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    profile_id = serializers.IntegerField(read_only=True, source='id')
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    friends = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    matches_id = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='matches')
    email = serializers.SerializerMethodField()


    class Meta:
        model = PlayerProfile
        fields = ['user_id', 'username', 'display_name', 'avatar',
                  'wins', 'losses', 'profile_id', 'friends', 'matches_id', 'email'] # 'online_status'
        
    def get_email(self, obj):
        return obj.user.email

    def get_username(self, obj):
        return obj.user.username

    def get_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None


class SimplePlayerSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlayerProfile
        fields = ['display_name', 'avatar', 'id']

class PlayerMatchSerializer(serializers.ModelSerializer):
    player = PlayerProfileSerializer(read_only=True)

    class Meta:
        model = PlayerMatch
        fields = ['player', 'date', 'match']


class MatchSerializer(serializers.ModelSerializer):
    stats = PlayerMatchSerializer(source='playermatch_set', many=True, read_only=True)
#    player1 = PlayerProfileSerializer()
#    player2 = PlayerProfileSerializer()

    class Meta:
        model = Match
        fields = ['id', 'date', 'player1', 'player2',
                  'winner', 'score_player1', 'score_player2', 'stats']

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        match_created.send_robust(self.__class__, match=instance)
        print('after signal in serializer')
        return instance
