from django.conf import settings
from django.conf.urls.static import static
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
    path('api/admin/', admin.site.urls),
    path('api/token/',
         TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),
    path('', lambda request: redirect('/api/admin/')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('users/', include('users.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

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

