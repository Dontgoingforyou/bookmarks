import requests

from django.core.files.base import ContentFile
from django.utils.text import slugify
from django import forms
from .models import Image


class ImageCreateForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = ['title', 'url', 'description']
        widgets = {
            'url': forms.URLInput(attrs={'placeholder': 'URL изображения'}),
        }

    def clean_url(self):
        url = self.cleaned_data['url']
        valid_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
        extension = url.split('.')[-1].lower()
        if extension not in valid_extensions:
            raise forms.ValidationError(
                'Неверное расширение файла. Разрешены только JPG, JPEG, PNG, GIF, BMP, WEBP.',
            )
        self.downloaded_image = self.download_image(url)
        return url

    def download_image(self, url):
        try:
            response = requests.get(
                url,
                timeout=15,
                headers={'User-Agent': 'mysocialsite/1.0 (local bookmarks)'},
            )
            response.raise_for_status()
        except requests.RequestException:
            raise forms.ValidationError('Не удалось скачать изображение.')
        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image/'):
            raise forms.ValidationError('По ссылке нет изображения.')
        return response.content

    def save(self, force_insert=False, force_update=False, commit=True):
        image = super().save(commit=False)
        image_url = self.cleaned_data['url']
        name = slugify(image.title) or 'image'
        extension = image_url.split('.')[-1].lower()
        image_name = f'{name}.{extension}'
        content = getattr(self, 'downloaded_image', None) or self.download_image(image_url)
        image.image.save(image_name, ContentFile(content), save=False)
        if commit:
            image.save()
        return image
