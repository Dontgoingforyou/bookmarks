from django.urls import path

from images.apps import ImagesConfig
from images.views import image_create

app_name = ImagesConfig.name

urlpatterns = [
    path('create/', image_create, name='create'),
]