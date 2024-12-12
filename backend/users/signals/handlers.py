# handlers.py

from django.db.models.signals import post_save
from users.models import User, PlayerProfile, Match, PlayerMatch
from django.dispatch import receiver
from users.signals import match_created, friendship_created, friendship_destroyed


@receiver(post_save, sender=User)
def create_profile_for_new_user(sender, **kwargs):
    if kwargs['created']:
        user = kwargs['instance']
        if user.auth_provider != '42api':
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


@receiver(friendship_created)
def add_users_to_friendlist(sender, sender_user, receiver_user, **kwargs):
    print('print in add users signal in serializer')

    sender_profile = PlayerProfile.objects.get(user=sender_user)
    receiver_profile = PlayerProfile.objects.get(user=receiver_user)
    sender_profile.friends.add(receiver_profile)
    receiver_profile.friends.add(sender_profile)
    print('player1:', sender_user)
    print('player2:', receiver_user)
    sender_profile.save()
    receiver_profile.save()


@receiver(friendship_destroyed)
def remove_users_from_friendlist(sender, sender_user, receiver_user, **kwargs):
    sender_profile = PlayerProfile.objects.get(user=sender_user)
    receiver_profile = PlayerProfile.objects.get(user=receiver_user)

    if receiver_profile in sender_profile.friends.all():
        sender_profile.friends.remove(receiver_profile)
    if sender_profile in receiver_profile.friends.all():
        receiver_profile.friends.remove(sender_profile)

    sender_profile.save()
    receiver_profile.save()
