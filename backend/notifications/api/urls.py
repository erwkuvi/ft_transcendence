from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import NotificationViewsets

router = DefaultRouter()
router.register(r'notifications', NotificationViewsets, basename='notification')

urlpatterns = [
        path('', include(router.urls))
]
