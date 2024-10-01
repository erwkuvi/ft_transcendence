# user_conf_files/views.py
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework import serializers

# Serializer to convert User model instances to JSON format
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# UserViewSet to handle requests related to the User model
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data(request):
    data = {
        "message": "Hello from user service!"
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def different_name(request):
    data = {
        "message": "PONG user service!"
    }
    return Response(data)
