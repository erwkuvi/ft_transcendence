from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Notification(models.Model):
    NOTIFICATION_TYPES = (
            ('friendship_invite', 'Friendship Invite'),
            ('match_request', 'Match Request'),
    )
    #sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender_user')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_user')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    #is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.notification_type} - {self.user.username}'
