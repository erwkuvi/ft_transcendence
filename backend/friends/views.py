#friends/views.py
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .utils import respond_success, respond_error, respond_bad_request
from django.core.exceptions import ObjectDoesNotExist
from .serializers import FriendshipSerializer, BasicUserSerializer
from .models import Friendship, FriendshipHistory
from users.models import User
from users.signals import friendship_created, friendship_destroyed
from django.conf import settings
from django.db.models import Q


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = BasicUserSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class ManageOtherUsers(viewsets.GenericViewSet):
    serializer_class = FriendshipSerializer

    def get_sender_and_receiver(self, request):
        data = request.data
        serializer = FriendshipSerializer(data=data)
        if serializer.is_valid():
            sender_id = data.get('sender')
            receiver_id = data.get('receiver')
            if sender_id == receiver_id:
                return respond_bad_request("You cannot befriend/block yourself.")

            try:
                sender = User.objects.get(id=sender_id)
                receiver= User.objects.get(id=receiver_id)
            except User.DoesNotExist:
                return respond_error("Sender or receiver does not exist.")

            return sender, receiver
        return respond_bad_request(serializer.errors)
        
    @action(detail=False, methods=['POST'], url_path='send_invite')
    def send_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            existing_friendships = Friendship.objects.filter(
                Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
        except ObjectDoesNotExist:
            existing_friendships = None
        
        if existing_friendships:
            return respond_bad_request("Friendship or request already exists between these users.")

        Friendship.objects.create(sender=sender, receiver=receiver, status='pending')
        Friendship.objects.create(sender=receiver, receiver=sender, status='invited')
        return respond_success("You invited the user.")
            
    @action(detail=False, methods=['POST'], url_path='accept_invite')
    def accept_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result
        
        friendships = Friendship.objects.filter(
            (Q(sender=sender, receiver=receiver, status='invited') |
             Q(sender=receiver, receiver=sender, status='pending')))

        friendships.update(status='accepted')
        friendship_created.send_robust(sender=self.__class__, sender_user=sender, receiver_user=receiver)  # signal to add users to friendlist in profile
        print("After calling signal")
        return respond_success("Friend request accepted")
        

    @action(detail=False, methods=['POST'], url_path='reject_invite')
    def reject_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        friendships = Friendship.objects.filter(
            (Q(sender=sender, receiver=receiver, status='invited') |
             Q(sender=receiver, receiver=sender, status='pending')))

        if friendships.count() < 2:
            return respond_error("No pending invite found")

        friendships.delete()
        return respond_success("Friend request rejected")

    @action(detail=False, methods=['POST'], url_path='block_user')
    def block_user(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            friends_back = Friendship.objects.get(sender=sender, receiver=receiver)
        except ObjectDoesNotExist:
            friends_back = None

        try:
            are_friends = Friendship.objects.get(sender=receiver, receiver=sender)
        except ObjectDoesNotExist:
            are_friends = None

        if are_friends and friends_back:
            FriendshipHistory.objects.create(sender=sender, receiver=receiver, previous_status=friends_back.status)
            FriendshipHistory.objects.create(sender=receiver, receiver=sender, previous_status=are_friends.status)
            friends_back.delete()
            are_friends.delete()

        Friendship.objects.create(sender=receiver, receiver=sender, status='blocked')
        Friendship.objects.create(sender=sender, receiver=receiver, status='unblock')
        return respond_success("User blocked")
        

    @action(detail=False, methods=['POST'], url_path='unblock_user')
    def unblock_user(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result
        try:
            is_blocked = Friendship.objects.get(sender=receiver, receiver=sender, status='blocked')
        except ObjectDoesNotExist:
            return respond_error("User is not blocked")
            
        try:
            canunblock = Friendship.objects.get(sender=sender, receiver=receiver, status='unblock')
        except ObjectDoesNotExist:
            return respond_error("User did not block the receiver.")

        is_blocked_status = None
        canunblock_status = None

        try:
            prev_blocked = FriendshipHistory.objects.get(sender=receiver, receiver=sender)
            is_blocked_status = prev_blocked.previous_status
            prev_blocked.delete()
        except ObjectDoesNotExist:
            prev_blocked = None

        try:
            prev_canunblock = FriendshipHistory.objects.get(sender=sender, receiver=receiver)
            canunblock_status = prev_canunblock.previous_status
            prev_canunblock.delete()
        except ObjectDoesNotExist:
            prev_canunblock = None


        if is_blocked_status and canunblock_status:
            is_blocked.status=is_blocked_status
            canunblock.status=canunblock_status
            is_blocked.save()
            canunblock.save()
        else:
            is_blocked.delete()
            canunblock.delete()
        return respond_success("User unblocked")

    @action(detail=False, methods=['post'], url_path='remove_friend')
    def remove_friend(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            friendship = Friendship.objects.get(sender=sender, receiver=receiver, status='accepted')
        except ObjectDoesNotExist:
            return respond_error("Users are not friends.")

        try:
            are_friends_backward = Friendship.objects.get(sender=receiver, receiver=sender, status='accepted')
        except ObjectDoesNotExist:
            return respond_error("Users are not friends.")


        are_friends_backward.delete()
        friendship.delete()
        friendship_destroyed.send_robust(sender=self.__class__, sender_user=sender, receiver_user=receiver)
        return respond_success("You are not friends anymore.")
