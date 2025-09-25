document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.accordion-category');

    categories.forEach(category => {
        const categoryHeader = category.querySelector('.category-header');
        const categoryContent = category.querySelector('.category-content');

        categoryHeader.addEventListener('click', () => {
            // Close other open categories
            categories.forEach(otherCategory => {
                if (otherCategory !== category) {
                    otherCategory.querySelector('.category-header').classList.remove('active');
                    const content = otherCategory.querySelector('.category-content');
                    content.style.maxHeight = null;
                    content.style.padding = "0 1rem";
                }
            });

            // Toggle current category
            categoryHeader.classList.toggle('active');
            if (categoryContent.style.maxHeight) {
                categoryContent.style.maxHeight = null;
                categoryContent.style.padding = "0 1rem";
            } else {
                categoryContent.style.maxHeight = categoryContent.scrollHeight + "px";
                categoryContent.style.padding = "1rem";
            }
        });

        const items = category.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const itemHeader = item.querySelector('.item-header');
            const itemContent = item.querySelector('.item-content');

            itemHeader.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent category from closing

                // Close other open items within the same category
                items.forEach(otherItem => {
                    if (otherItem !== item) {
                        const content = otherItem.querySelector('.item-content');
                        content.style.maxHeight = null;
                        content.style.padding = "0 1rem";
                    }
                });

                // Toggle current item
                if (itemContent.style.maxHeight) {
                    itemContent.style.maxHeight = null;
                    itemContent.style.padding = "0 1rem";
                } else {
                    itemContent.style.maxHeight = itemContent.scrollHeight + "px";
                    itemContent.style.padding = "1rem";
                    // Adjust parent category height
                    categoryContent.style.maxHeight = categoryContent.scrollHeight + itemContent.scrollHeight + "px";
                }
            });
        });
    });
});