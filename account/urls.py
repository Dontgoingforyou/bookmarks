from django.urls import path

from account.apps import AccountConfig
from .views import user_login

app_name = AccountConfig.name

urlpatterns = [
    path('login/', user_login, name='login')
]