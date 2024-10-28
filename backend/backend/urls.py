"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.shortcuts import redirect

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


admin.site.site_header = 'Ekuchel\'s Administration'
admin.site.index_title = 'Awesome Administration stuff'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/',
         TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),
    # Redirect root URL to the login page
    path('', lambda request: redirect('api/admin')),
    # This includes the login URL
    path('accounts/', include('django.contrib.auth.urls')),
    # This path takes us to the profile/players endpoint
    path('users/', include('users.urls')),
    # This paths are for entering the authentication endpoints
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]


# AVAILABLE ENDPOINTS FOR DJOSER(JWT)
# /jwt/create/ (JWT create a new user)
# /jwt/refresh/ (JWT )
# /jwt/verify/ (JSON Web Token Authentication)
# /users/
# /users/me/
# /users/confirm/
# /users/resend_activation/
# /users/set_password/
# /users/reset_password/
# /users/reset_password_confirm/
# /users/set_username/
# /users/reset_username/
# /users/reset_username_confirm/

