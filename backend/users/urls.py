from django.urls import include, path
#from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('players', views.PlayerProfileViewSet, basename='player-profile')
router.register('matches', views.MatchViewSet, basename='matches')
router.register('user_custom', views.UserViewSet, basename='user_custom')


urlpatterns = [
        path('', include(router.urls)),
        #path('login/', views.OAuth42LoginView.as_view(), name='42-login'),
        path('logout/', views.LogoutView.as_view(), name='logout'),
    ]
