
from django.urls import include, path
from rest_framework_nested import routers
from . import views


router = routers.DefaultRouter()
router.register('notifications', views.NotificationViewSet, basename='notifications')

urlpatterns = [
        path('', include(router.urls)),
        path('lobby/', views.lobby),
        path('user_id/', views.UserIDView.as_view(), name='user_id'),
        # path('send/', views.send_friend_request_view),
]
