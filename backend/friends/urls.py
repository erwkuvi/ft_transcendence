#friends/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ManageOtherUsers

router = DefaultRouter()
router.register(r'users', ManageOtherUsers, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]
