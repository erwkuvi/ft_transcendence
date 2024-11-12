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
python3 manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python3 manage.py createsuperuser \
        --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL"
else
    echo "Superuser not created. Missing environment variables."
fi

python3 manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()

users_data = [
    {
        'username': 'Lukas',
        'email': 'user1@example.com',
        'password': '123',
        'first_name': 'Lukas1',
        'last_name': 'Lukas2',
    },
	{
        'username': 'Adam',
        'email': 'user2@example.com',
        'password': '123',
        'first_name': 'Adam1',
        'last_name': 'Adam2',
    },
	{
        'username': 'Erwin',
        'email': 'user3@example.com',
        'password': '123',
        'first_name': 'Erwin1',
        'last_name': 'Erwin2',
    },
    {
        'username': 'Yison',
        'email': 'user4@example.com',
        'password': '123',
        'first_name': 'Yison1',
        'last_name': 'Yison2',
    },
]

for user_data in users_data:
    user, created = User.objects.get_or_create(
        username=user_data['username'],
        defaults={
            'email': user_data['email'],
            'first_name': user_data['first_name'],
            'last_name': user_data['last_name'],
        }
    )
    if created:
        user.set_password(user_data['password'])
        user.save()
        print(f'User {user.username} created successfully.')
    else:
        print(f'User {user.username} already exists.')
EOF

python3 manage.py runserver 0.0.0.0:8000
#daphne backend.asgi:application -b 0.0.0.0 -p 8000
