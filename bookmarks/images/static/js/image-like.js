const likesSuffix = (count) => {
    const number = Math.abs(count);
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return '';
    }
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return 'а';
    }
    return 'ов';
};

const csrfToken = () => {
    const match = document.cookie.match(/(?:^|; )csrftoken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : '';
};

const likeLabel = (action) => (action === 'like' ? 'Поставить лайк' : 'Убрать лайк');

const renderLikeRow = (userId, name, photoUrl) => {
    const row = document.createElement('div');
    row.className = 'image-like';
    row.dataset.userId = userId;

    if (photoUrl) {
        const image = document.createElement('img');
        image.src = photoUrl;
        image.alt = '';
        row.append(image);
    } else {
        const fallback = document.createElement('span');
        fallback.className = 'image-like-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        fallback.textContent = (name || '?').charAt(0).toUpperCase();
        row.append(fallback);
    }

    const nameNode = document.createElement('p');
    nameNode.textContent = name;
    row.append(nameNode);
    return row;
};

const updateLikesList = (button, liked) => {
    const list = document.querySelector('.image-likes-list');
    if (!list) {
        return;
    }

    const userId = button.dataset.userId;
    const existing = list.querySelector(`[data-user-id="${CSS.escape(userId)}"]`);

    if (liked) {
        if (existing) {
            return;
        }
        const empty = list.querySelector('.image-likes-empty');
        if (empty) {
            empty.remove();
        }
        list.append(renderLikeRow(userId, button.dataset.name, button.dataset.photo));
        return;
    }

    if (existing) {
        existing.remove();
    }
    if (!list.children.length) {
        const empty = document.createElement('p');
        empty.className = 'image-likes-empty';
        empty.textContent = 'Пока никто не отметил';
        list.append(empty);
    }
};

document.querySelectorAll('a.image-like-button').forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id', button.dataset.id);
        formData.append('action', button.dataset.action);

        fetch(button.dataset.url, {
            method: 'POST',
            headers: {'X-CSRFToken': csrfToken()},
            body: formData,
            mode: 'same-origin',
        })
            .then((response) => {
                if (response.redirected) {
                    window.location.assign(response.url);
                    return null;
                }
                if (!response.ok) {
                    return null;
                }
                return response.json();
            })
            .then((data) => {
                if (!data || data.status !== 'ok') {
                    return;
                }
                const previousAction = button.dataset.action;
                const action = previousAction === 'like' ? 'unlike' : 'like';
                button.dataset.action = action;
                button.textContent = likeLabel(action);

                const totalNode = document.querySelector('span.count .total');
                const likes = previousAction === 'like'
                    ? parseInt(totalNode.textContent, 10) + 1
                    : parseInt(totalNode.textContent, 10) - 1;
                totalNode.textContent = String(likes);

                const label = document.querySelector('span.count .likes-label');
                if (label) {
                    label.textContent = `лайк${likesSuffix(likes)}`;
                }
                updateLikesList(button, previousAction === 'like');
            });
    });
});
