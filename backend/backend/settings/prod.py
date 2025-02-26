# PROD
from .common import *
import os
import environ

env = environ.Env()
environ.Env.read_env()

HOST_IP = env('HOST_IP')
FRONTEND_URL = env('FRONTEND_URL')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [HOST_IP, 'localhost', '127.0.0.1']

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')


SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': 'hZBVwFTiEsVWavJqGiP2VCIdVUtfLjfLTCvbmYimmH3WxpIiaSZyaBJyIbIBVHUz4nM'
    }




# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]


CORS_ORIGIN_ALLOW_ALL = False


CORS_ALLOWED_ORIGINS = [
	"http://{HOST_IP}:80",
    env('FRONTEND_URL'),
]
