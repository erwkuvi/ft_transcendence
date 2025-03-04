# DEV
from .common import *
from datetime import timedelta

import os
import environ

env = environ.Env()
environ.Env.read_env()

HOST_IP = env('HOST_IP')
FRONTEND_URL = env('FRONTEND_URL')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ('django-insecure-x1a#yw-&_gh&jvp06gn)m2x-d@_z06ghuygo$^!f5s8g+)_mql')

ALLOWED_HOSTS = [HOST_IP, 'localhost', '127.0.0.1']

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), # This is for development
    'REFRESH_TOKEN_LIFETIME': timedelta(days=10),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': 'hZBVwFTiEsVWavJqGiP2VCIdVUtfLjfLTCvbmYimmH3WxpIiaSZyaBJyIbIBVHUz4nM'
    }


REST_FRAMEWORK = {
    'COERCE_DECIMAL_TO_STRING': False,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # This is for development
    ),
    'DEFAULT_RENDERER_CLASSES': (
            'rest_framework.renderers.JSONRenderer',
            'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}
#When set to False something else has to be updated as I can get any images in prod
CORS_ORIGIN_ALLOW_ALL = True 

CORS_ALLOWED_ORIGINS = [
	"http://localhost:80",
	"http://127.0.0.1:80",
	"http://localhost:8081",
	"http://127.0.0.1:8081",
	"http://{HOST_IP}:80",
    env('FRONTEND_URL'),
]

