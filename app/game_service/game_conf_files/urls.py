# game_conf_files/urls.py
from django.contrib import admin
from django.urls import path, include
from .views import fetch_data  # Import your new view
from django.shortcuts import redirect
from .views import index 

urlpatterns = [
    path('game/admin/', admin.site.urls),
    path('game/sample-data/', fetch_data, name='fetch_data'),
    path('game/external-data/', index, name='index'),  # New endpoint
    path('', lambda request: redirect('/admin')),
    path('accounts/', include('django.contrib.auth.urls')),
]
