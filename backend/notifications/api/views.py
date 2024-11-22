from rest_framework import viewsets
from ..models import Notification
from .serializers import NotificationModelSerializer
from rest_framework.decorators import action


class NotificationViewsets(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationModelSerializer

    @action(methods=['post'], detail=True)
    def activate_notification(self, request, pk):
        notification = self.get_object()
        ## add logic later
