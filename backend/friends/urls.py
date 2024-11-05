#friends/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ManageOtherUsers

router = DefaultRouter()
router.register(r'users', ManageOtherUsers, basename='users')

urlpatterns = [
    # path('send-friend-request/<int:user_id>/', views.send_friend_request, name='send_friend_request'),
    # path('accept-friend-request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('', include(router.urls)),
]

# generated urls:
# POST /users/accept_invite/ 
# GET /users/ 
# POST /users/send_invite/ 