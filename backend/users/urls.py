from django.urls import include, path
#from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('players', views.PlayerProfileViewSet, basename='player-profile')
router.register('matches', views.MatchViewSet, basename='matches')

#players_router = routers.NestedDefaultRouter(
#    router, 'players', lookup='player')
#players_router.register('match', views.StatsViewSet, basename='player-match')


urlpatterns = [
        path('', include(router.urls)),
        #path('', include(players_router.urls)
    ]
