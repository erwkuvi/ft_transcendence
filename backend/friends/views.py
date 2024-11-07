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

# status codes:
# 400 Bad Request
# 404 Not Found
# 409 Conflict
# 200 OK
# 403 Forbidden
# 201 Created

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = BasicUserSerializer

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
                return Response({"success": "Friendship already exists"}, status=400)

            if friendship.status == 'blocked':
                return Response({"error": "You cannot send a friend request to this user because you are blocked."}, status=403)

        if backward_friendship:
            if backward_friendship.status == 'pending':
                return Response({"success": "You can't invite user that already invited you."}, status=209)

        friendship = Friendship(sender=sender, receiver=receiver, status='pending')
        friendship.save()
        return Response({"success": "You invited the user."}, status=201) 
            
 # Accept a friend request
    @action(detail=False, methods=['POST'], url_path='accept_invite')
    def accept_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        is_invited = Friendship.objects.get(sender=receiver, receiver=sender)

        if not is_invited:
            return Response({"error": "No pending invite found"}, status=404)

        if is_invited.status == 'pending':
            is_invited.status = 'accepted'
            is_invited.save()
            return Response({"success": "Friend request accepted"}, status=200)
        else:
            return Response({"error": "Friend request is not pending"}, status=400)


    # Reject a friend request
    @action(detail=False, methods=['POST'], url_path='reject_invite')
    def reject_invite(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        is_invited = Friendship.objects.get(sender=receiver, receiver=sender)

        if not is_invited:
            return Response({"error": "No pending invite found"}, status=404)

        if is_invited.status == 'pending':
            is_invited.status = 'rejected'
            is_invited.delete()
            return Response({"success": "Friend request rejected"}, status=200)
        else:
            return Response({"error": "Friend request is not pending"}, status=400)

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
    @action(detail=False, methods=['delete'], url_path='remove_friend')
    def remove_friend(self, request):
        result = self.get_sender_and_receiver(request)
        if isinstance(result, Response):
            return result
        sender, receiver = result

        are_friends_backward = Friendship.objects.get(sender=receiver, receiver=sender)
        are_friends = Friendship.objects.get(sender=sender, receiver=receiver)

        if not are_friends or not are_friends_backward:
            return Response({"error": "Users are not frineds."}, status=404)
        
        if are_friends.status == 'accepted':
            are_friends.delete()
            return Response({"success": "You are not friends anymore."}, status=200)
        elif are_friends_backward == 'accepted':
            are_friends_backward.delete()
            return Response({"success": "You are not friends anymore."}, status=200)
        else:
            return Response({"error": "Could not unfriend."}, status=400)
