#friends/models.py
from django.db import models
from django.conf import settings

class Friendship(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('invited', 'Invited'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('blocked', 'Blocked'),
        ('removed', 'Removed'),
    ]

    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="receiver")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return f"Status: ~{self.status}~ between sender: ~{self.sender}~ and receiver: ~{self.receiver}~"