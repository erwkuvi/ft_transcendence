# user_conf_files/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import get_data, different_name, UserViewSet  
from django.shortcuts import redirect 
from rest_framework import routers

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('', include(router.urls)),
	path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/data/', get_data, name='get_data'),
    path('api/code/data/', different_name, name='different_name'),
    path('', lambda request: redirect('/admin')),  # Redirect root URL to the login page
    path('accounts/', include('django.contrib.auth.urls')),  # This includes the login URL
    # Include URLs from other apps
    # path('app/', include('app.urls')),
]
