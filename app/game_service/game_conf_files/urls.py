# game_conf_files/urls.py
from django.contrib import admin
from django.urls import path, include
from .views import fetch_data, get_sample_data  # Import your new view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sample-data/', fetch_data, name='fetch_data'),
    path('external-data/', get_sample_data, name='get_sample_data'),  # New endpoint
    path('', lambda request: redirect('/admin')),
    path('accounts/', include('django.contrib.auth.urls')),
]
