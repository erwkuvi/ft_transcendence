from rest_framework.decorators import api_view, action
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, SAFE_METHODS
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.exceptions import AuthenticationFailed
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from .serializers import UserSerializer, PlayerProfileSerializer, MatchSerializer
from .models import User, PlayerProfile, Match
from .permissions import IsAdminOrReadOnly
# Create your views here.


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view()
def say_hello(request):

    return Response('Hello from Erwin')


class PlayerProfileViewSet(RetrieveModelMixin, UpdateModelMixin, viewsets.GenericViewSet):
    queryset = PlayerProfile.objects.all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self): #This permission setting allows any user to only see a PlayerProfiles: /users/players/1/
        if self.action == 'list' and self.request.user.is_authenticated:
            return [IsAuthenticated()]
        elif self.action == 'retrieve':
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('player-profile-me')
        return Response(
            {"detail": "Please sign in into your profile."},
            status=status.HTTP_400_BAD_REQUEST
        )

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):  # This method is called an custom action
        player_profile = PlayerProfile.objects.get(
            user_id=request.user.id)
        if request.method == 'GET':
            serializer = PlayerProfileSerializer(player_profile, context=self.get_serializer_context())
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = PlayerProfileSerializer(
                player_profile, data=request.data, context=self.get_serializer_context())
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    #permission_classes = [AllowAny]
    permission_classes = [IsAuthenticated]

#    def get_queryset(self):
#        if self.request.user.is_staff:
#            return Match.objects.all()
#
#        (id, created) = Match.objects.only('id').get_or_create(id=self.request.user.id)
#        return Match.objects.filter(id=id)
#return Match.objects.filter(id=self.request.user.id)

