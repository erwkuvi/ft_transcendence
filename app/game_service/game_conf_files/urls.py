# game_conf_files/urls.py

from django.contrib import admin
from django.urls import path, include
from .views import fetch_data

from django.shortcuts import redirect  # Import redirect here

urlpatterns = [
    path('admin/', admin.site.urls),
	path('sample-data/', fetch_data, name='fetch_data'),
	path('', lambda request: redirect('/admin')),  # Redirect root URL to the login page
    path('accounts/', include('django.contrib.auth.urls')),  # This includes the login URL
    # Include URLs from other apps
    # path('app/', include('app.urls')),
]
