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

python3 manage.py migrate
python3 manage.py makemigrations users
python3 manage.py makemigrations game
python3 manage.py migrate auth
python3 manage.py migrate --noinput --run-syncdb
python3 manage.py createsuperuser

python3 manage.py create_users

python3 manage.py collectstatic --noinput

python3 manage.py runserver 0.0.0.0:8000
#daphne backend.asgi:application -b 0.0.0.0 -p 8000
