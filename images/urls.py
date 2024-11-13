from django.urls import path

from images.apps import ImagesConfig
from images.views import image_create, image_detail, image_like

app_name = ImagesConfig.name

urlpatterns = [
    path('create/', image_create, name='create'),
    path('detail/<int:id>/<slug:slug>/', image_detail, name='detail'),

    path('like/', image_like, name='like'),
]