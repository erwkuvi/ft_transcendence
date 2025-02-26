#!/bin/sh

echo "
    Script for backend
"

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

python3 manage.py makemigrations users
python3 manage.py makemigrations
python3 manage.py migrate --noinput --run-syncdb

python3 manage.py create_users

python3 manage.py collectstatic --noinput


#gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
python3 manage.py runserver 0.0.0.0:8000
#python manage.py runsslserver --use_ssl
#python3 manage.py runserver_plus --cert-file /certs/fullchain.crt --key-file /certs/privkey.key 8000

#daphne backend.asgi:application -b 0.0.0.0 -p 8000

#start the server with gunicorn backend.wsgi
