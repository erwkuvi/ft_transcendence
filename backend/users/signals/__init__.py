# __init__.py
from django.dispatch import Signal


match_created = Signal()
friendship_created = Signal()
friendship_destroyed = Signal()
