const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (lastScrollY < window.scrollY) {
        header.style.top = `-${header.offsetHeight}px`;
    } else {
        header.style.top = '0';
    }
    lastScrollY = window.scrollY;
});
