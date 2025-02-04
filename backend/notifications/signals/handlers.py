# handlers.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.dispatch import receiver
from notifications.signals import friendship_request_created
from notifications.models import Notification
from users.models import User
from django.conf import settings

#User = settings.AUTH_USER_MODEL

#@receiver(match_request_created)
#def match_request_to_notifications(sender, sender_user, receiver_user, **kwargs):
#    #match = kwargs['match']
    #if match:
    #    player1 = match.player1
    #    player2 = match.player2
    #    #print('player1:', player1)
    #    #print('player2:', player2)

    #    if match.winner == player1:
    #        player1.wins += 1
    #        player2.losses += 1
    #    else:
    #        player1.losses += 1
    #        player2.wins += 1
    #    player1.save()
    #    player2.save()

    #     # Create PlayerMatch instances
    #    PlayerMatch.objects.create(player=player1, match=match, date=match.date)
    #    PlayerMatch.objects.create(player=player2, match=match, date=match.date)

    #    print('ok')


@receiver(friendship_request_created)
def friendship_request_to_notifications(sender, sender_user_id, receiver_user_id, **kwargs):

    sender_user = User.objects.get(id=sender_user_id)
    receiver_user = User.objects.get(id=receiver_user_id)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
            f'notifications_{receiver_user_id}',
            {
                'type': 'send_notification',
                'message': 'Friendship Request',
                'body': f'{sender_user.username} wants to be your friend',
                }
            )
    #print(f'Group\'s name is notifications_{receiver_user_id}')
    # Create a new Notification instance
    notification = Notification.objects.create(
        receiver=receiver_user,
        notification_type='friendship_invite',
        body=f'{sender_user.username} wants to be your friend'
    )
    
    print('Notification created:', notification)
    print('Notif sender:', sender_user)
    print('Notif receiver:', receiver_user)
