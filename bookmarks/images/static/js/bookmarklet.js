var siteUrl = 'https://localhost:8000';
var minWidth = 250;
var minHeight = 250;

function bookmarkletLaunch() {
    var bookmarklet = document.getElementById('bookmarklet');

    if (!bookmarklet) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = siteUrl + '/static/css/bookmarklet.css?r=' + Math.floor(Math.random() * 9999999999999999);
        head.appendChild(link);

        bookmarklet = document.createElement('div');
        bookmarklet.id = 'bookmarklet';
        bookmarklet.className = 'bookmarklet';
        bookmarklet.innerHTML = '<a href="#" id="close">&times;</a>' +
            '<h2>Добавить изображение</h2>' +
            '<div class="images"></div>';
        document.body.appendChild(bookmarklet);
        bookmarklet.querySelector('#close').addEventListener('click', function(event) {
            event.preventDefault();
            bookmarklet.style.display = 'none';
        });
    }

    var imagesContainer = bookmarklet.querySelector('.images');
    imagesContainer.innerHTML = '';
    bookmarklet.style.display = 'block';

    document.querySelectorAll('img').forEach(function(image) {
        var path = image.src.split('?')[0].split('#')[0].toLowerCase();
        var allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(function(extension) {
            return path.endsWith(extension);
        });
        if (!allowed || bookmarklet.contains(image)) {
            return;
        }
        if (image.naturalWidth >= minWidth && image.naturalHeight >= minHeight) {
            var thumb = document.createElement('img');
            thumb.src = image.src;
            thumb.alt = 'Сохранить изображение';
            thumb.addEventListener('click', function() {
                var title = document.title || '';
                if (title.length > 200) {
                    title = title.slice(0, 200);
                }
                var shareUrl = siteUrl + '/images/create/?url=' +
                    encodeURIComponent(image.src) +
                    '&title=' + encodeURIComponent(title);
                window.open(shareUrl, '_blank');
            });
            imagesContainer.appendChild(thumb);
        }
    });
}

bookmarkletLaunch();
