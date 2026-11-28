const imageList = document.getElementById('image-list');

if (imageList) {
    let page = 1;
    let emptyPage = false;
    let blockRequest = false;

    const loadNextPage = () => {
        if (blockRequest || emptyPage) {
            return;
        }
        const margin = document.body.clientHeight - window.innerHeight - 200;
        if (window.pageYOffset <= margin) {
            return;
        }
        blockRequest = true;
        page += 1;
        fetch(`?images_only=1&page=${page}`)
            .then((response) => response.text())
            .then((html) => {
                if (html === '') {
                    emptyPage = true;
                    return;
                }
                imageList.insertAdjacentHTML('beforeend', html);
                blockRequest = false;
            })
            .catch(() => {
                blockRequest = false;
            });
    };

    window.addEventListener('scroll', loadNextPage);
    loadNextPage();
}
