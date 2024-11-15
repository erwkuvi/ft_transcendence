# serializers.py
import pyotp
import qrcode
from io import BytesIO
from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import User, PlayerProfile, Match, PlayerMatch
from .signals import match_created
# from django.urls import reverse
# from users.signals.handlers import match_created

class OTPLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)  # OTP length is usually 6


class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username',
                  'first_name', 'last_name',
                  'email', 'qr_code', 'password']
        extra_kwargs = {
            "password": {"write_only": True},
            "qr_code": {"read_only": True},
        }

    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Email already exists!"})
        return super().validate(attrs)

    def create(self, validated_data: dict):
        otp_base32 = pyotp.random_base32()
        email = validated_data.get("email")
        otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
            name=email.lower(), issuer_name="Ft_Transcendence_DT"
        )
        stream = BytesIO()
        image = qrcode.make(f"{otp_auth_url}")
        image.save(stream)
        user = User(
            email=email,
            username=validated_data.get("username"),  # Inherited from AbstractUser
            first_name=validated_data.get("first_name"),
            last_name=validated_data.get("last_name"),
            otp_base32=otp_base32,
            otpauth_url=otp_auth_url,
            qr_code=ContentFile(stream.getvalue(), name=f"qr{get_random_string(10)}.png")
        )

        # Use set_password for proper password hashing
        user.set_password(validated_data.get("password"))

        user.save()

        return user


# for creating a new user, which information is asked
#class UserCreateSerializer(BaseUserCreateSerializer):
#    class Meta(BaseUserCreateSerializer.Meta):
#        fields = ['id', 'username', 'first_name',
#                  'last_name', 'email']

# for the current user, which information is shown
class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'first_name',
                  'last_name', 'email', 'qr_code', 'password']
        extra_kwargs = {
                "qr_code": {"read_only": True},
                }


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
