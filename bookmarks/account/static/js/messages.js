const dismissMessage = (item) => {
    if (!item.isConnected || item.classList.contains('closing')) {
        return;
    }

    const list = item.parentElement;
    const removeItem = () => {
        item.remove();
        if (!list.children.length) {
            list.remove();
        }
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        removeItem();
        return;
    }

    item.classList.add('closing');
    item.addEventListener('animationend', removeItem, {once: true});
};

document.querySelectorAll('.messages li').forEach((item) => {
    item.querySelector('.close').addEventListener('click', () => {
        dismissMessage(item);
    });
    window.setTimeout(() => {
        dismissMessage(item);
    }, 4000);
});
