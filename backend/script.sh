#!/bin/sh

 echo "
 	Script for backend
 "

python3 manage.py makemigrations
python3 manage.py migrate auth
python3 manage.py migrate --noinput


if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python3 manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL" \
    || true
fi

#python3 manage.py runserver 0.0.0.0:8000
daphne backend.asgi:application -b 0.0.0.0 -p 8000
