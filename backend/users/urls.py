from django.urls import include, path
#from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('players', views.PlayerProfileViewSet, basename='player-profile')
router.register('matches', views.MatchViewSet, basename='matches')
router.register('user-custom', views.UserViewSet, basename='user-custom')
router.register('otp-activate', views.OTPActivateViewSet, basename='otp-activate')
router.register('otp-active-to-true', views.OTPActiveToTrueViewSet, basename='otp-activate-to-true')
router.register('otp-active-to-false', views.OTPDeactivateViewSet, basename='otp-activate-to-false')
router.register('simple-auth', views.SimpleLoginViewSet, basename='simple-auth')
router.register('tournament-create', views.TournamentViewSet, basename='tournament-create')
router.register('exit-tournament', views.ExitTournamentViewSet, basename='exit-tournament')
router.register('match-tournament', views.MatchTournamentViewSet, basename='match-tournament')
router.register('score-upload', views.ScoreRetrieveViewSet, basename='score-upload')


urlpatterns = [
        path('', include(router.urls)),
        #path('login/', views.OAuth42LoginView.as_view(), name='42-login'),
        path('logout/', views.LogoutView.as_view(), name='logout'),
    ]

