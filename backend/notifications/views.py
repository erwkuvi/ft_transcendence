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
        sender = self.request.user
        notification_type = self.request.data.get('notification_type')
        print(f'Receiver ID: {receiver_id}')

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist.'}, status=400)

        message, body_content = self.get_predefined_message(notification_type, sender.username)
        notification = serializer.save(receiver=receiver, body=body_content)

        print(f'Notification created: {notification.body}')
        print(f'Notification attributes: {notification.__dict__}')

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
                f'notifications_{receiver_id}',
                {
                    'type': 'send_notification',
                    'message': message,
                    'body': body_content,
                    }
                )
        print(f'Group\'s name is notifications_{receiver_id}, message: {message}, body_content: {body_content}')

    def get_predefined_message(self, notification_type, sender):
        if notification_type == 'friendship_invite':
            return 'Friendship Request', f'{sender} wants to be your friend'
        else:
            return 'Ultimate Faceoff', f'{sender} dares you to step into the arena and face him in an epic duel!'

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
