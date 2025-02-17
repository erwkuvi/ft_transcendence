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

        attrs['user_id'] = user.id

        return attrs

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        user = User.objects.get(id=user_id)
    
        player_profile = PlayerProfile.objects.get(user_id=user_id)
        display_name = player_profile.display_name
    
        return {
            "user_id": user_id,
            "display_name": display_name
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
                  'wins', 'losses', 'profile_id', 'friends', 'matches_id', 'email', 'otp_active', 'auth_provider', 'in_tournament', 'curr_match', 'is_host'] # 'online_status'
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


class TournamentSerializer(serializers.Serializer):
    player_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=2,
        max_length=4,
    )
    champion = serializers.CharField(max_length=100, required=False, allow_blank=True)
    description = serializers.CharField(max_length=50, required=False, allow_blank=True)
    host = serializers.IntegerField()

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
        idx_matches = num_players // 2 - 1
        exponential_growth = self.get_exponential_growth_step(num_players) - 1
        host_id = validated_data.get('host')

        try:
            host = User.objects.get(id=host_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Host user not found.")

        player_profile = PlayerProfile.objects.get(user_id=host_id)
        player_profile.is_host = True
        player_profile.save()
    
        tournament = Tournament.objects.create(
            champion=validated_data.get('champion', ''),
            description=validated_data.get('description', ''),
            host=host
        )
    
        player_profiles = PlayerProfile.objects.filter(user_id__in=player_ids)
    
        matches = []
        for i in range(0, len(player_ids), 2):
            match = Match.objects.create(
                player1_id=player_ids[i],
                player2_id=player_ids[i+1],
                mode='tournament',
                idx=idx_matches,
                level=exponential_growth,
                tournament=tournament
            )
            matches.append(match)
            idx_matches -= 1
#Assign the newly created match the curr_match property in all the players
            player1_profile = PlayerProfile.objects.get(user_id=player_ids[i])
            player2_profile = PlayerProfile.objects.get(user_id=player_ids[i+1])
            player1_profile.in_tournament = True
            player2_profile.in_tournament = True
            player1_profile.curr_match = match
            player2_profile.curr_match = match
            player1_profile.save()
            player2_profile.save()
    
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

    def delete_tournament_and_update_players(tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            raise serializers.ValidationError("Tournament not found.")
    
        # Retrieve all matches associated with the tournament
        matches = Match.objects.filter(tournament=tournament)
    
        player_ids = set()
        for match in matches:
            player_ids.add(match.player1_id)
            player_ids.add(match.player2_id)
    
        PlayerProfile.objects.filter(user_id__in=player_ids).update(in_tournament=False)
    
        tournament.delete()

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        player = PlayerProfile.objects.get(user_id=user_id)
        match = player.curr_match
        tournament= match.tournament

        player.in_tournament = False
        player.curr_match = None
        player.save()

        if player.is_host:
            delete_tournament_and_update_players(tournament.id) 
            return {"message": "Tournament has been destroyed due to the host leaving"}

        if match:
            other_player_id = match.player1_id if match.player2_id == user_id else match.player2_id

            score_data = {
                'id': match.id,
                'score_player1': 2 if match.player1_id == other_player_id else 0,
                'score_player2': 2 if match.player2_id == other_player_id else 0,
                'winner': other_player_id
            }
            score_serializer = ScoreRetrieveSerializer(data=score_data)
            if score_serializer.is_valid():
                score_serializer.save()
            else:
                raise serializers.ValidationError(score_serializer.errors)

        return {"user_id": user_id, "in_tournament": player.in_tournament}


#class TournamentSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Tournament
#        fields = ['id', 'champion', 'description', 'host']  # Include fields you want to serialize

class MatchTournamentSerializer(serializers.ModelSerializer):
    stats = PlayerMatchSerializer(source='playermatch_set', many=True, read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'date', 'mode', 'idx', 'level', 'player1', 'player2',
                  'winner', 'score_player1', 'score_player2', 'stats', 'tournament']

    def create(self, validated_data):
        validated_data['mode'] = 'tournament'
        instance = super().create(validated_data)
        match_created.send_robust(self.__class__, match=instance)
        return instance

class ScoreRetrieveSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    score_player1 = serializers.IntegerField()
    score_player2 = serializers.IntegerField()
    winner = serializers.IntegerField()

    def validate(self, attrs):
        id = attrs.get('id')
        winner_id = attrs.get('winner')

        try:
            match = Match.objects.get(id=id)
        except Match.DoesNotExist:
            raise serializers.ValidationError("Match not found.")

        if winner_id not in [match.player1_id, match.player2_id]:
            raise serializers.ValidationError("Winner must be one of the match participants.")

        return attrs

    def create(self, validated_data):
        id = validated_data.get('id')
        score_player1 = validated_data.get('score_player1')
        score_player2 = validated_data.get('score_player2')
        winner_id = validated_data.get('winner')

        match = Match.objects.get(id=id)
        match.score_player1 = score_player1
        match.score_player2 = score_player2
        match.winner_id = winner_id
        match.save()

        curr_tournament = match.tournament
        curr_level = match.level
        curr_idx = match.idx
        PlayerProfile.objects.filter(user_id=match.player1_id if match.player2_id == winner_id else match.player2_id).update(in_tournament=False, curr_match=None)

        def half_number(number):
            if number in (0, 1):
                return 0
            elif number % 2 == 0:
                return number // 2
            else:
                return (number - 1) // 2

        if curr_level != 0:
            next_idx = half_number(curr_idx)
            next_level = curr_level - 1

            existing_match = Match.objects.filter(
                tournament=curr_tournament,
                level=next_level,
                idx=next_idx
            ).first()
            if existing_match:
                existing_match.player2_id = winner_id
                existing_match.save()
                player = PlayerProfile.objects.get(user_id=winner_id)
                player.curr_match = existing_match
                player.save()
                return MatchSerializer(existing_match).data
            else:
                new_match = Match.objects.create(
                    player1_id=winner_id,
                    level=next_level,
                    idx=next_idx,
                    tournament=curr_tournament,
                    mode=match.mode
                )
                player = PlayerProfile.objects.get(user_id=winner_id)
                player.curr_match = new_match
                player.save()
                return MatchSerializer(new_match).data
        else:
            curr_tournament.champion = str(PlayerProfile.objects.get(user_id=winner_id).display_name)
            curr_tournament.save()
            player_winner = PlayerProfile.objects.get(user_id=winner_id)
            player_winner.curr_match = None
            player_winner.save()
            player_host = PlayerProfile.objects.get(user_id=curr_tournament.host)
            player_host.is_host = False
            player_host.save()
            return {"message": f"{curr_tournament.champion} is this tournament's champion"}
