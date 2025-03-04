# serializers.py
import re
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
from django.core.validators import RegexValidator
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
    email = serializers.EmailField(
        validators=[
            RegexValidator(
                regex=r'^[\w\.-]+@[\w\.-]+\.\w+$',
                message="Enter a valid email address."
            )
        ]
    )
    username = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9._-]{3,30}$',
                message="Username must be 3-30 characters long and can only contain letters, numbers, underscores, hyphens, and periods."
            )
        ]
    )

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'qr_code', 'password']
        extra_kwargs = {
            "password": {"write_only": True},
            "qr_code": {"read_only": True},
            # Optionally, remove the default uniqueness validator if you want to handle it manually:
            "username": {"validators": []},
        }

    def validate(self, attrs: dict):
        # Normalize and validate the email field.
        email = attrs.get("email", "").lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Email already exists!"})
        
        # Validate uniqueness of the username.
        username = attrs.get("username")
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "Username already exists!"})
        
        # Call the parent class's validate method.
        return super().validate(attrs)

    def create(self, validated_data: dict):
        # Create a new user instance with the provided data.
        email = validated_data.get("email")
        username = validated_data.get("username")
        user = User(
            email=email,
            username=username,
        )
        user.set_password(validated_data.get("password"))
        user.save()
        return user


#class UserCreateSerializer(BaseUserCreateSerializer):
#
#    class Meta(BaseUserCreateSerializer.Meta):
#        model = User
#        fields = ['id', 'username',
#                  'email', 'qr_code', 'password']
#        extra_kwargs = {
#            "password": {"write_only": True},
#            "qr_code": {"read_only": True},
#        }
#
#    def validate_username(self, value):
#        if not re.match(r'^[a-zA-Z0-9._-]{3,30}$', value):
#            raise serializers.ValidationError("Username must be 3-30 characters long and can only contain letters, numbers, underscores, hyphens, and periods.")
#        return value
#
#    def validate(self, attrs: dict):
#        self.validate_username(attrs.get("username"))
#        email = attrs.get("email").lower().strip()
#        if User.objects.filter(email__iexact=email).exists():
#            raise serializers.ValidationError({"email": "Email already exists!"})
#        self.validate_username(attrs.get("username"))
#        return super().validate(attrs)
#
#    def create(self, validated_data: dict):
#        email = validated_data.get("email")
#        username = validated_data.get("username")
#        user = User(
#            email=email,
#            username=username,  # Inherited from AbstractUser
#        )
#        # Use set_password for proper password hashing
#        user.set_password(validated_data.get("password"))
#        user.save()
#        return user

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
    language= serializers.CharField(required=False, default='en')
    mode = serializers.BooleanField(required=False, default=True)

    #user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = PlayerProfile
        fields = ['user_id', 'username', 'display_name', 'avatar',
                  'wins', 'losses', 'profile_id', 'friends', 'matches_id', 'email', 'otp_active', 'auth_provider', 'in_tournament', 'curr_match', 'is_host', 'language', 'mode', 'tournament', 'online'] # 'online_status'
        read_only_fields = ['user_id', 'username', 'profile_id', 'email', 'auth_provider']

    def update(self, instance, validated_data):
        matches = validated_data.pop('matches', None)
        new_avatar = validated_data.get('avatar', None)

        if new_avatar and instance.avatar and instance.avatar.name != 'avatar.png':
            instance.avatar.delete(save=False)

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
        #print(f"Auth Provider for {obj.user.username}: {auth_provider}")  # Debugging line
        return auth_provider

    def get_username(self, obj):
        return obj.user.username

    def get_avatar(self, obj):
        request = self.context.get('request')
        if request and obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None


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
        #print('after signal in serializer')
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

    def validate(self, attrs):
        player_ids = attrs.get('player_ids')
        host = attrs.get('host')

        if host not in player_ids:
            raise serializers.ValidationError("Host must be one of the players in the tournament.")

        return attrs

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
        player_profile.tournament = tournament
        player_profile.save()
    
        temp_user, created = User.objects.get_or_create(
            username='temp_user',
            defaults={'email': 'temp_user@example.com'}
        )
        temp_profile, created = PlayerProfile.objects.get_or_create(
            user=temp_user,
            defaults={'display_name': 'Temporary Player'}
        )
        temp_profile.tournament = tournament
        temp_profile.in_tournament = True
        temp_profile.save()
        player_profiles = PlayerProfile.objects.filter(user_id__in=player_ids)
        
        PlayerProfile.objects.filter(user_id__in=player_ids).update(in_tournament=True)

    
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

class ExitMultiplayerSerializer(serializers.Serializer):
    leaving_player = serializers.PrimaryKeyRelatedField(queryset=PlayerProfile.objects.all())
    player2 = serializers.PrimaryKeyRelatedField(queryset=PlayerProfile.objects.all())
    score_player2 = serializers.IntegerField()

    def validate(self, attrs):
        player1 = attrs.get('leaving_player')
        player2 = attrs.get('player2')

        if not player1 or not player2:
            raise serializers.ValidationError("Both player1 and player2 must be provided.")

        if player1 == player2:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same.")

        return attrs

    def create(self, validated_data):
        leaving_player = validated_data.get('leaving_player')
        player2 = validated_data.get('player2')
        score_player2 = validated_data.get('score_player2')

        match_data = {
            "mode": 'regular',
            "player1": leaving_player.id,
            "player2": player2.id,
            "winner": player2.id,
            "score_player1": 0,
            "score_player2": 1
        }

        match_serializer = MatchSerializer(data=match_data)
        if match_serializer.is_valid():
            match = match_serializer.save()
            return {"message": "Player has exited the match and scores have been updated.", "match_id": match.id}
        else:
            raise serializers.ValidationError(match_serializer.errors)

class ExitTournamentSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate(self, attrs):
        user_id = attrs.get('user_id')

        try:
            player = PlayerProfile.objects.get(user_id=user_id)
        except PlayerProfile.DoesNotExist:
            raise serializers.ValidationError("Player profile not found.")

        if not player.in_tournament and not player.is_host:
            raise serializers.ValidationError("Player is not currently in a tournament.")

        return attrs

    @staticmethod
    def delete_tournament_and_update_players(tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            raise serializers.ValidationError("Tournament not found.")
        temp_profile = PlayerProfile.objects.filter(tournament=tournament, user__username='temp_user').first()

        if temp_profile:
            temp_user = temp_profile.user
            temp_profile.delete()
            temp_user.delete()

        matches = Match.objects.filter(tournament=tournament)
    
        player_ids = set()
        for match in matches:
            player_ids.add(match.player1_id)
            player_ids.add(match.player2_id)
    
        PlayerProfile.objects.filter(user_id__in=player_ids).update(in_tournament=False, is_host=False)
        
    
        tournament.delete()

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        player = PlayerProfile.objects.get(user_id=user_id)
        match = player.curr_match
        if match:
            tournament = match.tournament
            #print(f'---------------------------------------- match is {match} --------------------------- ')
        else:
            tournament = player.tournament
        player.in_tournament = False
        player.curr_match = None
        player.save()

        if player.is_host and match is None:
            ExitTournamentSerializer.delete_tournament_and_update_players(tournament.id)
            return {"message": "Tournament has been destroyed due to the host destroying it"}

        final_match = Match.objects.filter(tournament=tournament, level=0).first()

        if player.is_host and match.level and final_match == None:
            ExitTournamentSerializer.delete_tournament_and_update_players(tournament.id)
            return {"message": "Tournament has been destroyed due to the host destroying it"}

        if match:
            if not match.player2_id:
                temp_profile = PlayerProfile.objects.filter(tournament=tournament, user__username='temp_user').first()
                if temp_profile:
                    match.player1 = temp_profile
                    match.save()
                    return {"message": f"{player.display_name} has left the tournament"}
            other_player_id = match.player1_id if match.player2_id == user_id else match.player2_id

            score_data = {
                'id': match.id,
                'score_player1': 1 if match.player1_id == other_player_id else 0,
                'score_player2': 1 if match.player2_id == other_player_id else 0,
                'winner': other_player_id
            }
            score_serializer = ScoreRetrieveSerializer(data=score_data)
            if score_serializer.is_valid():
                score_serializer.save()
            else:
                raise serializers.ValidationError(score_serializer.errors)

            #if player.is_host:
            #    player.is_host = False
            #    player.save()

        return {"message": f"{player.display_name} has left the tournament"}


class MatchTournamentSerializer(serializers.ModelSerializer):
    stats = PlayerMatchSerializer(source='playermatch_set', many=True, read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'date', 'mode', 'idx', 'level', 'player1', 'player2',
                  'winner', 'score_player1', 'score_player2', 'stats', 'tournament']

    def create(self, validated_data):
        validated_data['mode'] = 'tournament'
        instance = super().create(validated_data)
        #match_created.send_robust(self.__class__, match=instance)
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
        match_created.send_robust(self.__class__, match=match)

        curr_tournament = match.tournament
        curr_level = match.level
        curr_idx = match.idx
        PlayerProfile.objects.filter(user_id=match.player1_id if match.player2_id == winner_id else match.player2_id).update(in_tournament=False, curr_match=None)
        #print(f'curr_level: {curr_level}')

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
                temp_profile = PlayerProfile.objects.filter(tournament=curr_tournament, user__username='temp_user').first()
                if existing_match.player1_id == temp_profile.user_id:
                    curr_tournament.champion = str(PlayerProfile.objects.get(user_id=winner_id).display_name)
                    curr_tournament.save()
                    player_winner = PlayerProfile.objects.get(user_id=winner_id)
                    player_winner.curr_match = None
                    player_winner.in_tournament = False
                    player_winner.save()
                    player_host = PlayerProfile.objects.get(user_id=curr_tournament.host)
                    player_host.is_host = False
                    player_host.tournament = None
                    player_host.save()

                    existing_match.delete()

                    if temp_profile:
                        temp_user = temp_profile.user
                        temp_profile.delete()
                        temp_user.delete()
                    return {"message": f"{curr_tournament.champion} is this tournament's champion by forfeit"}

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
            player_winner.in_tournament = False
            player_winner.save()
            player_host = PlayerProfile.objects.get(user_id=curr_tournament.host)
            player_host.is_host = False
            player_host.tournament = None
            player_host.save()

            temp_profile = PlayerProfile.objects.filter(tournament=curr_tournament, user__username='temp_user').first()
            if temp_profile:
                temp_user = temp_profile.user
                temp_profile.delete()
                temp_user.delete()
            return {"message": f"{curr_tournament.champion} is this tournament's champion"}

class TournamentIdSerializer(serializers.Serializer):
    tournament_id = serializers.IntegerField()

    def validate(self, attrs):
        tournament_id = attrs.get('tournament_id')

        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            raise serializers.ValidationError("Tournament not found.")

        return attrs

    def create(self, validated_data):
        tournament_id = validated_data.get('tournament_id')
        matches = Match.objects.filter(tournament_id=tournament_id)

        return MatchSerializer(matches, many=True).data
