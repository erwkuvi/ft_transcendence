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


python3 manage.py makemigrations users
python3 manage.py makemigrations
python3 manage.py migrate --noinput --run-syncdb

python3 manage.py create_users

python3 manage.py collectstatic --noinput


python3 manage.py runserver 0.0.0.0:8000
#python manage.py runsslserver --use_ssl
#python3 manage.py runserver_plus --cert-file /certs/fullchain.crt --key-file /certs/privkey.key 8000
#python3 manage.py runserver_plus --key-file selftest-key --cert-file selftest-cert localhost:8000

#daphne backend.asgi:application -b 0.0.0.0 -p 8000
