from .models import Profile


def create_profile(user, *args, **kwargs):
    if user is not None:
        Profile.objects.get_or_create(user=user)
