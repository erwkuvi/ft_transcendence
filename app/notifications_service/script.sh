#!/bin/sh

echo "

Script for notify

"

# Apply database migrations
python3 manage.py makemigrations
python3 manage.py migrate auth
python3 manage.py migrate --noinput

if [ -n "$DJANGO_NOTIFY_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_NOTIFY_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_NOTIFY_SUPERUSER_EMAIL" ]; then
    python3 manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_NOTIFY_SUPERUSER_USERNAME" \
        --email "$DJANGO_NOTIFY_SUPERUSER_EMAIL" \
    || true
fi

# Run the application using Daphne (for ASGI)
daphne notify_conf_files.asgi:application -b 0.0.0.0 -p 3000
