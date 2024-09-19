# settings.py

from pathlib import Path
import os
import environ

env = environ.Env()
environ.Env.read_env()

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Secret key (keep it secret in production)
SECRET_KEY = os.getenv('SECRET_KEY3')

# Debug mode (set to True for development)
DEBUG = True

# Allow all hosts (use specific hosts for production)
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Installed applications
INSTALLED_APPS = [
	'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Middleware configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True

# SERVICE_ROUTES = {
#     '/user': 'http://user_service:8000',
# }

# URL configuration
ROOT_URLCONF = 'user_conf_files.urls'

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = 'user_conf_files.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_UP_DB'),
        'USER': os.environ.get('DB_UP_USER'),
        'PASSWORD': os.environ.get('DB_UP_PASSWORD'),
        'HOST': os.environ.get('DB_UP_HOST'),
        'PORT': os.environ.get('DB_UP_PORT'),
    }
}


DATABASES["default"]["ATOMIC_REQUESTS"] = True

# Password validators
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

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Directory where static files will be collected
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default auto field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
