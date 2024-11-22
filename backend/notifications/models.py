from django.db import models
from django.conf import settings

# Create your models here.
User = settings.AUTH_USER_MODEL

class Notification(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    active = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return str(self.title)
