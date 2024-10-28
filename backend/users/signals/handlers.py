# handlers.py

from django.db.models.signals import post_save
from users.models import User, PlayerProfile, Match, PlayerMatch
from django.dispatch import receiver
from users.signals import match_created


@receiver(post_save, sender=User)
def create_profile_for_new_user(sender, **kwargs):
    if kwargs['created']:
        user = kwargs['instance']
        display_name = str(user.username) + str('_') + str(user.id)
        PlayerProfile.objects.create(user=user, display_name=display_name)


@receiver(match_created)
def match_results_to_profile(sender, **kwargs):
    match = kwargs['match']
    if match:
        player1 = match.player1
        player2 = match.player2
        #print('player1:', player1)
        #print('player2:', player2)

        if match.winner == player1:
            player1.wins += 1
            player2.losses += 1
        else:
            player1.losses += 1
            player2.wins += 1
        player1.save()
        player2.save()

         # Create PlayerMatch instances
        PlayerMatch.objects.create(player=player1, match=match, date=match.date)
        PlayerMatch.objects.create(player=player2, match=match, date=match.date)

        print('ok')
