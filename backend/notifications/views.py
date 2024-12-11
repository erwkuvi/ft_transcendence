from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import JsonResponse
from django.contrib.auth import get_user_model
# Create your views here.

User = get_user_model()


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)

    def perform_create(self, serializer):
        print(f'Request data: {self.request.data}')
        receiver_id = self.request.data.get('receiver')
        print(f'Receiver ID: {receiver_id}')
        sender_id = self.request.data.get('sender')
        print(f'Sender ID: {sender_id}')
        try:
            receiver = User.objects.get(id=receiver_id)
            sender = User.objects.get(id=sender_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist.'}, status=400)
        notification = serializer.save(sender=self.request.user, receiver=receiver)

        print(f'Notification created: {notification.body}')
        print(f'Notification attributes: {notification.__dict__}')

        channel_layer = get_channel_layer()
        if notification.notification_type == 'friendship_invite':
            body_content = f'{sender.username} wants to be your friend'
        else:
            body_content = f'{sender.username} dares you to step into the arena and face him in an epic duel!'

        async_to_sync(channel_layer.group_send)(
                f'notifications_{receiver_id}',
                {
                    'type': 'send_notification',
                    'message': notification.notification_type,
                    'body': body_content,
                    #'sender': sender.username,
                    }
                )
        print(f'Group\'s name is notifications_{receiver_id}')
#    def get_queryset(self):
#        return self.queryset.filter(user=self.request.user)


class UserIDView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user_id': request.user.id})


def lobby(request):
    return render(request, 'notifications/lobby.html')


#def send_friend_request_view(request):
#   user = request.user  # Assuming the user is authenticated
#   message = request.GET.get('message', 'You have a new friend request')
#   send_friend_request_notification(user, message)
#   return JsonResponse({'status': 'Notification sent'})
#
#def send_friend_request_notification(user, message):
#    channel_layer = get_channel_layer()
#    async_to_sync(channel_layer.group_send)(
#        f'user_{user.id}',  # Group name
#        {
#            'type': 'friend_request',
#            'message': message
#        }
#    )
