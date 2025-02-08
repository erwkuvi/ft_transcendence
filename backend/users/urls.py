from django.urls import include, path
#from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('players', views.PlayerProfileViewSet, basename='player-profile')
router.register('matches', views.MatchViewSet, basename='matches')
router.register('user_custom', views.UserViewSet, basename='user_custom')
router.register('otp-activate', views.OTPActivateViewSet, basename='otp-activate')
router.register('otp-active-to-true', views.OTPActiveToTrueViewSet, basename='otp-activate-to-true')
router.register('otp-active-to-false', views.OTPDeactivateViewSet, basename='otp-activate-to-false')


urlpatterns = [
        path('', include(router.urls)),
        #path('login/', views.OAuth42LoginView.as_view(), name='42-login'),
        path('logout/', views.LogoutView.as_view(), name='logout'),
    ]
