# serializers.py
import math
import random
import datetime
import pyotp
import qrcode
import logging
from io import BytesIO
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import User, PlayerProfile, Match, PlayerMatch, Tournament
from .signals import match_created


class SimpleLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found.")

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Incorrect password.")

        # Add user_id to validated data
        attrs['user_id'] = user.id

        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        user = User.objects.get(id=user_id)

        otp_serializer = OTPCreateSerializer(data={
            "email": user.email,
            "username": user.username
        })
        otp_serializer.is_valid(raise_exception=True)
        otp_data = otp_serializer.save()

        return {
            "user_id": user_id,
            **otp_data
        }
        

class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username',
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
        email = validated_data.get("email")
        username = validated_data.get("username")
        user = User(
            email=email,
            username=username,  # Inherited from AbstractUser
        )
        # Use set_password for proper password hashing
        user.set_password(validated_data.get("password"))
        user.save()
        return user

# for the current user, which information is shown
class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username',
                  'email', 'qr_code', 'password', 'otp_active', 'auth_provider']
        extra_kwargs = {
            "password": {"write_only": True},
            "qr_code": {"read_only": False},
        }

# Serializer for Player
class PlayerProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(read_only=True)
    profile_id = serializers.IntegerField(read_only=True, source='id')
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    friends = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    matches_id = serializers.PrimaryKeyRelatedField(many=True, queryset=Match.objects.all(), required=False, source='matches')
    email = serializers.SerializerMethodField()
    avatar = serializers.ImageField(required=False)  # Make avatar writable and optional
    display_name = serializers.CharField(required=False)
    otp_active = serializers.SerializerMethodField()
    auth_provider= serializers.SerializerMethodField()

    #user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = PlayerProfile
        fields = ['user_id', 'username', 'display_name', 'avatar',
                  'wins', 'losses', 'profile_id', 'friends', 'matches_id', 'email', 'otp_active', 'auth_provider', 'in_tournament', 'game_alias'] # 'online_status'
        read_only_fields = ['user_id', 'username', 'profile_id', 'email', 'auth_provider']

    def update(self, instance, validated_data):
        matches = validated_data.pop('matches', None)
        if matches:
            for match in matches:
                instance.matches.add(match)
        return super().update(instance, validated_data)
        
    def get_otp_active(self, obj):
        return obj.user.otp_active

    def get_email(self, obj):
        return obj.user.email

    def get_auth_provider(self, obj):
        auth_provider = obj.user.auth_provider
        print(f"Auth Provider for {obj.user.username}: {auth_provider}")  # Debugging line
        return auth_provider

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
        fields = ['id', 'date', 'mode', 'player1', 'player2',
                  'winner', 'score_player1', 'score_player2', 'stats']

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        match_created.send_robust(self.__class__, match=instance)
        print('after signal in serializer')
        return instance


logger = logging.getLogger(__name__)


# OTP Serialization section --------------------------------------------

class OTPActiveToTrueSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    otp_code = serializers.CharField(max_length=6, write_only=True)

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        otp = attrs.get('otp_code')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if user.otp_active:
            raise serializers.ValidationError("OTP is already activated for this user.")

        # Verify OTP using pyotp
        totp = pyotp.TOTP(user.otp_base32)
        current_time = totp.timecode(datetime.datetime.now())
        logger.info(f"Server time: {datetime.datetime.now()}, OTP Timecode: {current_time}")
        if not totp.verify(otp):
            logger.warning(f"Invalid OTP for user: {user.email}, Expected: {totp.now()}")
            raise serializers.ValidationError("Invalid OTP code.")


        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        user = User.objects.get(id=user_id)

        user.otp_active = True
        user.save()
        # Delete the qr_code image
        if user.qr_code:
            user.qr_code.delete(save=False)
            user.qr_code = None

        return {"otp_active": user.otp_active}

class OTPActivateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        password = attrs.get('password')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        if user.otp_base32:
            raise serializers.ValidationError("OTP is already activated for this user.")
        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")
        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        user = User.objects.get(id=user_id)

        otp_data = OTPCreateSerializer().create(validated_data={
            "email": user.email,
            "username": user.username
        }, user=user)
        #otp_serializer.is_valid(raise_exception=True)
        #otp_data = otp_serializer.save(user=user)

        return otp_data

class OTPDeactivateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        if not user.otp_active:
            raise serializers.ValidationError("OTP is already deactivated for this user.")
        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        user = User.objects.get(id=user_id)

        user.otp_active = False
        user.otp_base32 = ""
        user.otpauth_url = ""
        # Delete the qr_code image
        if user.qr_code:
            user.qr_code.delete(save=False)
            user.qr_code = None
        user.save()

        return {"otp_active": user.otp_active}


class OTPCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)

    def create(self, validated_data: dict, user=None):
        otp_base32 = pyotp.random_base32()
        email = validated_data.get("email")
        username = validated_data.get("username")
        otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
            name=email.lower(), issuer_name="Ft_Transcendence_DT"
        )
        stream = BytesIO()
        image = qrcode.make(f"{otp_auth_url}")
        image.save(stream)
        qr_code = ContentFile(stream.getvalue(), name=f"{username}_qr_{get_random_string(5)}.png")

        user.otp_base32 = otp_base32
        user.otpauth_url = otp_auth_url
        user.qr_code = qr_code
        user.save()

        return {
            #"otp_base32": user.otp_base32, #secret, not needed to be shared
            #"otpauth_url": user.otpauth_url,
            "qr_code_url": user.qr_code.url if user.qr_code else None #URL that encodes the information needed to set up a OTP
        }

class OTPLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    otp = serializers.CharField(max_length=6, write_only=True, required=False)  # OTP length is usually 6
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        otp = attrs.get('otp', None)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found.")

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Incorrect password.")

        if user.otp_active:
            if not otp:
                raise exceptions.AuthenticationFailed("OTP code is required.")
        # Verify OTP using pyotp
            if not user.otp_base32:
                raise exceptions.AuthenticationFailed("OTP is not set up for this user.")
        
            totp = pyotp.TOTP(user.otp_base32)
            current_time = totp.timecode(datetime.datetime.now())
            logger.info(f"Server time: {datetime.datetime.now()}, OTP Timecode: {current_time}")
            if not totp.verify(otp):
                logger.warning(f"Invalid OTP for user: {user.username}, Expected: {totp.now()}")
                raise exceptions.AuthenticationFailed("Invalid OTP code.")

        # If authentication is successful, generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


## Tournament creation

#class TournamentSerializer(serializers.Serializer):
#    player_ids = serializers.ListField(
#        child=serializers.IntegerField(),
#        min_length=4,
#        max_length=4
#    )
#
#    def validate_player_ids(self, value):
#        if len(set(value)) != 4:
#            raise serializers.ValidationError("Four unique player IDs are required.")
#    
#        players = PlayerProfile.objects.filter(user_id__in=value)
#        if players.count() != 4:
#            raise serializers.ValidationError("Some player IDs do not exist.")
#    
#        for player in players:
#            if player.in_tournament:
#                raise serializers.ValidationError(f"Player {player.user.username} is already in a tournament.")
#
#        return value
#
#    def create(self, validated_data):
#        player_ids = validated_data['player_ids']
#        random.shuffle(player_ids)
#
#        match1 = Match.objects.create(
#            player1_id=player_ids[0],
#            player2_id=player_ids[1],
#            mode='tournament'
#        )
#        match2 = Match.objects.create(
#            player1_id=player_ids[2],
#            player2_id=player_ids[3],
#            mode='tournament'
#        )
#
#        PlayerProfile.objects.filter(user_id__in=player_ids).update(in_tournament=True)
#
#        return [match1, match2]

class GameAliasSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    new_game_alias = serializers.CharField(max_length=50)

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        new_game_alias = attrs.get('new_game_alias')

        try:
            player = PlayerProfile.objects.get(user_id=user_id)
        except PlayerProfile.DoesNotExist:
            raise serializers.ValidationError("Player profile not found.")

        if PlayerProfile.objects.filter(game_alias=new_game_alias).exclude(user_id=user_id).exists():
            raise serializers.ValidationError("This game alias is already taken.")

        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        new_game_alias = validated_data.get('new_game_alias')

        player = PlayerProfile.objects.get(user_id=user_id)
        player.game_alias = new_game_alias
        player.save()

        return {"user_id": user_id, "new_game_alias": player.game_alias}

class TournamentSerializer(serializers.Serializer):
    player_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=2,
        max_length=4,
    )
    name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    description = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_player_ids(self, value):
        if len(value) < 2 or len(value) > 32 or (len(value) & (len(value) - 1)) != 0:
            raise serializers.ValidationError("Number of players are not enough for holding a tournament.")
    
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate player IDs are not allowed.")
    
        players = PlayerProfile.objects.filter(user_id__in=value)
        if players.count() != len(value):
            raise serializers.ValidationError("Some player IDs do not exist.")
    
        for player in players:
            if player.in_tournament:
                raise serializers.ValidationError(f"Player {player.user.username} is already in a tournament.")
    
        return value

    def get_exponential_growth_step(self, num_players):
        if num_players <= 0 or (num_players & (num_players - 1)) != 0:
            raise ValueError("Number of players must be a power of 2.")
    
        return int(math.log2(num_players))

    def create(self, validated_data):
        player_ids = validated_data['player_ids']
        random.shuffle(player_ids)
        num_players = len(player_ids)
        idx_matches = num_players // 2
        exponential_growth = self.get_exponential_growth_step(num_players)
    
        tournament = Tournament.objects.create(
            name=validated_data.get('name', ''),
            description=validated_data.get('description', '')
        )
    
        player_profiles = PlayerProfile.objects.filter(user_id__in=player_ids)
        player_aliases = {profile.user_id: profile.game_alias for profile in player_profiles}
    
        matches = []
        for i in range(0, len(player_ids), 2):
            match = Match.objects.create(
                player1_id=player_ids[i],
                player2_id=player_ids[i+1],
                player1_alias=player_aliases[player_ids[i]],
                player2_alias=player_aliases[player_ids[i+1]],
                mode='tournament',
                idx=idx_matches,
                level=exponential_growth,
                tournament=tournament
            )
            matches.append(match)
            idx_matches -= 1
    
        #PlayerProfile.objects.filter(user_id__in=player_ids).update(in_tournament=True)
    
        return matches


class ExitTournamentSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate(self, attrs):
        user_id = attrs.get('user_id')

        try:
            player = PlayerProfile.objects.get(user_id=user_id)
        except PlayerProfile.DoesNotExist:
            raise serializers.ValidationError("Player profile not found.")

        if not player.in_tournament:
            raise serializers.ValidationError("Player is not currently in a tournament.")

        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        player = PlayerProfile.objects.get(user_id=user_id)

        player.in_tournament = False
        player.save()

        return {"user_id": user_id, "in_tournament": player.in_tournament}


class MatchTournamentSerializer(serializers.ModelSerializer):
    stats = PlayerMatchSerializer(source='playermatch_set', many=True, read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'date', 'mode', 'idx', 'level', 'player1', 'player2',
                  'winner', 'score_player1', 'score_player2', 'stats']

    def create(self, validated_data):
        validated_data['mode'] = 'tournament'
        instance = super().create(validated_data)
        match_created.send_robust(self.__class__, match=instance)
        print('after signal in serializer')
        return instance
