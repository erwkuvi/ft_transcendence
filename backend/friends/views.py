#friends/views.py
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.core.exceptions import ObjectDoesNotExist
from .serializers import FriendshipSerializer, BasicUserSerializer
from .models import Friendship
from users.models import User
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
                return Response({"error": "You cannot befriend/block yourself."}, status=400)

            try:
                sender = User.objects.get(id=sender_id)
                receiver = User.objects.get(id=receiver_id)
            except User.DoesNotExist:
                return Response({"error": "Sender or receiver does not exist."}, status=404)

            return sender, receiver

    # Send a friend invite
    @action(detail=False, methods=['POST'], url_path='send_invite')
    def send_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            friendship = Friendship.objects.get(sender=sender, receiver=receiver)
        except ObjectDoesNotExist:
            friendship = None
        try:
            backward_friendship = Friendship.objects.get(sender=receiver, receiver=sender)
        except ObjectDoesNotExist:
            backward_friendship = None
    
        if friendship:
            if friendship.status == 'pending':
                return Response({"error": "Friend invite already sent"}, status=409)
    
            if friendship.status == 'accepted':
                return Response({"error": "Friendship already exists"}, status=400)

            if friendship.status == 'blocked':
                return Response({"error": "You cannot send a friend request to this user because you are blocked."}, status=403)

        if backward_friendship:
            if backward_friendship.status == 'pending':
                return Response({"error": "You can't invite user that already invited you."}, status=209)

        Friendship.objects.create(sender=sender, receiver=receiver, status='pending')
        Friendship.objects.create(sender=receiver, receiver=sender, status='invited')

        return Response({"success": "You invited the user."}, status=200) 
            
 # Accept a friend request
    @action(detail=False, methods=['POST'], url_path='accept_invite')
    def accept_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            is_invited = Friendship.objects.get(sender=sender, receiver=receiver, status='invited')
        except ObjectDoesNotExist:
            is_invited = None

        try:
            waiting_for_response = Friendship.objects.get(sender=receiver, receiver=sender, status='pending')
        except ObjectDoesNotExist:
            waiting_for_response = None

        if not is_invited or not waiting_for_response:
            return Response({"error": "No pending invite found"}, status=404)

        waiting_for_response.status = 'accepted'
        waiting_for_response.save()
        is_invited.status = 'accepted'
        is_invited.save()

        return Response({"success": "Friend request accepted"}, status=200)
        


    # Reject a friend request
    @action(detail=False, methods=['POST'], url_path='reject_invite')
    def reject_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            is_invited = Friendship.objects.get(sender=sender, receiver=receiver, status='invited')
        except ObjectDoesNotExist:
            is_invited = None

        try:
            waiting_for_response = Friendship.objects.get(sender=receiver, receiver=sender, status='pending')
        except ObjectDoesNotExist:
            waiting_for_response = None

        if not is_invited or not waiting_for_response:
            return Response({"error": "No pending invite found"}, status=404)

        waiting_for_response.delete()
        is_invited.delete()
        return Response({"success": "Friend request rejected"}, status=200)


    # Block a user, I might not need that 
    @action(detail=False, methods=['POST'], url_path='block_user')
    def block_user(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            are_friends = Friendship.objects.get(sender=sender, receiver=receiver)
        except ObjectDoesNotExist:
            are_friends = None

        try:
            are_friends_backward = Friendship.objects.get(sender=receiver, receiver=sender)
        except ObjectDoesNotExist:
            are_friends_backward = None

        if are_friends and are_friends.status != 'blocked':
            are_friends.status = 'blocked'
            are_friends.save()
            return Response({"success": "User blocked"}, status=200)

        elif are_friends and are_friends.status == 'blocked':
            are_friends.delete()
            return Response({"success": "User unblocked"}, status=200)

        elif are_friends_backward and are_friends_backward.status != 'blocked':
            are_friends_backward.status = 'blocked'
            are_friends_backward.save()

        elif are_friends_backward and are_friends_backward.status == 'blocked':
            are_friends_backward.delete()
            return Response({"success": "User unblocked"}, status=200)

        elif not are_friends and not are_friends_backward:
            relationship = Friendship(sender=sender, receiver=receiver, status='blocked')
            relationship.save()
            return Response({"success": "User blocked"}, status=200)
        
        return Response({"error": "Could not block."}, status=400)

    # Remove a friend
    @action(detail=False, methods=['post'], url_path='remove_friend')
    def remove_friend(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        try:
            friendship = Friendship.objects.get(sender=sender, receiver=receiver, status='accepted')
        except ObjectDoesNotExist:
            friendship = None

        try:
            are_friends_backward = Friendship.objects.get(sender=receiver, receiver=sender, status='accepted')
        except ObjectDoesNotExist:
            are_friends_backward = None

        if not friendship or not are_friends_backward:
            return Response({"error": "Users are not friends."}, status=404)

        are_friends_backward.delete()
        friendship.delete()
        return Response({"success": "You are not friends anymore."}, status=200)
