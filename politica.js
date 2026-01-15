// =================================================
// SCRIPT PARA LA PÁGINA DE POLÍTICAS
// =================================================

document.addEventListener('DOMContentLoaded', () => {

    const appListItems = document.querySelectorAll('#app-list li');
    const policyArticles = document.querySelectorAll('.policy-article');
    const defaultPolicy = document.getElementById('default-policy');

    // Función para gestionar la visibilidad de las políticas
    function showPolicy(appId) {
        // Ocultar todos los artículos de políticas
        policyArticles.forEach(article => {
            article.classList.add('oculto');
        });

        // Mostrar el artículo correspondiente si existe
        const policyToShow = document.getElementById(`${appId}-policy`);
        if (policyToShow) {
            policyToShow.classList.remove('oculto');
        } else {
            // Si no se encuentra una política específica, mostrar la de por defecto
            defaultPolicy.classList.remove('oculto');
        }
    }

    // Función para gestionar el estado activo en el menú
    function setActiveItem(selectedItem) {
        // Quitar la clase 'active' de todos los items
        appListItems.forEach(item => {
            item.classList.remove('active');
        });
        // Añadir la clase 'active' al item seleccionado
        selectedItem.classList.add('active');
    }

    // Añadir event listeners a cada item de la lista de apps
    appListItems.forEach(item => {
        item.addEventListener('click', () => {
            const appId = item.dataset.app;

            // Actualizar la vista
            showPolicy(appId);
            setActiveItem(item);
        });
    });

});
