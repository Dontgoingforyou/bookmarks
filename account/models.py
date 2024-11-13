from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    date_of_birth = models.DateTimeField(blank=True, null=True, verbose_name='Дата рождения')
    photo = models.ImageField(upload_to='users/%d/%m/%Y/', blank=True, verbose_name='Изображение')

    def __str__(self):
        return f'Профиль пользователя {self.user.username}'


class Contact(models.Model):
    user_from = models.ForeignKey('auth.User', related_name='rel_from_set', on_delete=models.CASCADE)
    user_to = models.ForeignKey('auth.User', related_name='rel_to_set', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['-created'])
        ]
        ordering = ['-created']

    def __str__(self):
        return f'{self.user_from} подписался  на {self.user_to}'


# добавление следующее поле в User динамически
user_model = get_user_model()
user_model.add_to_class(
    'following',
    models.ManyToManyField('self', through=Contact, related_name='followers', symmetrical=False)
)