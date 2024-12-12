#friends/admin.py
from django.contrib import admin
from .models import Friendship, FriendshipHistory

admin.site.register(Friendship)
admin.site.register(FriendshipHistory)