import environ
import os
from django.core.management.base import BaseCommand
from users.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

#environ.Env.read_env()
environ.Env.read_env(os.path.join(os.path.dirname(__file__), '.env'))
User = get_user_model()

class Command(BaseCommand):
    help = 'Create initial users and superuser'

    def handle(self, *args, **options):
        users_data = [
                {
                    'username': 'Lukas',
                    'email': 'user1@example.com',
                    'password': 'ILoveDjango',
                    },
                {
                    'username': 'Adam',
                    'email': 'user2@example.com',
                    'password': 'ILoveDjango',
                    },
                {
                    'username': 'Erwin',
                    'email': 'user3@example.com',
                    'password': 'ILoveDjango',
                    },
                {
                    'username': 'Yison',
                    'email': 'user4@example.com',
                    'password': 'ILoveDjango',
                    },
        ]

        for users_data in users_data:
            serializer = UserCreateSerializer(data=users_data)
            if serializer.is_valid():
                serializer.save()
                self.stdout.write(
                        self.style.SUCCESS(
                            f"User {users_data['username']} created succesfully"
                        )
                )
            else:
                self.stdout.write(self.style.ERROR(f"Failed to create {users_data['username']}: {serializer.errors}"))


        superuser_username = os.environ['DJANGO_SUPERUSER_USERNAME']
        superuser_email = os.environ['DJANGO_SUPERUSER_EMAIL']
        superuser_password = os.environ['DJANGO_SUPERUSER_PASSWORD']

        if superuser_username and superuser_email and superuser_password:
            if not User.objects.filter(username=superuser_username).exists():
                User.objects.create_superuser(
                        username=superuser_username,
                        email=superuser_email,
                        password=superuser_password
                )
                self.stdout.write(self.style.SUCCESS(f"Superuser {superuser_username} created successfully"))
            else:
                self.stdout.write(self.style.WARNING(f"Superuser {superuser_username} exists already"))
        else:
            self.stdout.write(self.style.WARNING(f"Superuser not created. Missing environment variables!!!"))



