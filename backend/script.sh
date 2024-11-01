#!/bin/sh

echo "
    Script for backend
"

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Debug: Print environment variables to ensure they are set
echo "DJANGO_SUPERUSER_USERNAME: $DJANGO_SUPERUSER_USERNAME"
echo "DJANGO_SUPERUSER_PASSWORD: $DJANGO_SUPERUSER_PASSWORD"
echo "DJANGO_SUPERUSER_EMAIL: $DJANGO_SUPERUSER_EMAIL"

python3 manage.py makemigrations
python3 manage.py migrate auth
python3 manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python3 manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL"
else
    echo "Superuser not created. Missing environment variables."
fi

python3 manage.py runserver 0.0.0.0:8000
#daphne backend.asgi:application -b 0.0.0.0 -p 8000
