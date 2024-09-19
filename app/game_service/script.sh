#!/bin/sh

echo "

Script for game

"

python manage.py makemigrations
python manage.py migrate auth
python manage.py migrate --noinput


if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL" \
    || true
fi

python manage.py runserver 0.0.0.0:5000