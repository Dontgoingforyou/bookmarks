from django.conf import settings
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    date_of_birth = models.DateTimeField(blank=True, null=True, verbose_name='Дата рождения')
    photo = models.ImageField(upload_to='users/%d/%m/%Y/', blank=True, verbose_name='Изображение')

    def __str__(self):
        return f'Профиль пользователя {self.user.username}'
