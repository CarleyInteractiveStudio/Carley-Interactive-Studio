document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Add class after scrolling 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
