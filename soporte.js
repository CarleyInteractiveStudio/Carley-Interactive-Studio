// =================================================
// SCRIPT PARA LA PÁGINA DE SOPORTE
// =================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias a elementos del DOM ---
    const supportForm = document.getElementById('support-form');
    const hasFilesCheckbox = document.getElementById('has-files');
    const fileUploadSection = document.getElementById('file-upload-section');
    const fileInput = document.getElementById('files');
    const filePreview = document.getElementById('file-preview');
    const successPanel = document.getElementById('success-panel');
    const closeSuccessPanelBtn = document.getElementById('close-success-panel');

    // --- Lógica para mostrar/ocultar la sección de archivos ---
    hasFilesCheckbox.addEventListener('change', () => {
        if (hasFilesCheckbox.checked) {
            fileUploadSection.classList.remove('oculto');
        } else {
            fileUploadSection.classList.add('oculto');
            // Limpia los archivos y la vista previa si se desmarca
            fileInput.value = '';
            filePreview.innerHTML = '';
        }
    });

    // --- Lógica para la vista previa de archivos ---
    fileInput.addEventListener('change', () => {
        filePreview.innerHTML = ''; // Limpiar vista previa anterior
        const files = Array.from(fileInput.files);

        // Validaciones
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        const videoFiles = files.filter(file => file.type.startsWith('video/'));

        if (imageFiles.length > 10) {
            alert('Puedes subir un máximo de 10 imágenes.');
            fileInput.value = ''; // Limpiar selección
            return;
        }

        if (videoFiles.length > 1) {
            alert('Puedes subir un máximo de 1 video.');
            fileInput.value = ''; // Limpiar selección
            return;
        }

        // Generar vista previa
        files.forEach(file => {
            const previewItem = document.createElement('div');
            previewItem.classList.add('preview-item');

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = () => URL.revokeObjectURL(img.src); // Liberar memoria
                previewItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.onloadeddata = () => URL.revokeObjectURL(video.src); // Liberar memoria
                previewItem.appendChild(video);
            }

            filePreview.appendChild(previewItem);
        });
    });

    // --- Lógica de envío del formulario ---
    supportForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita el envío real y la recarga de la página

        // Aquí es donde, en el futuro, se añadiría el código para enviar los datos
        // a tu servidor (Hugging Face, Node.js, etc.).

        console.log('Simulando envío de formulario...');

        // Mostrar el panel de éxito
        successPanel.classList.remove('oculto');

        // Resetear el formulario después de un "envío" exitoso
        supportForm.reset();
        fileUploadSection.classList.add('oculto');
        filePreview.innerHTML = '';
    });

    // --- Lógica para cerrar el panel de éxito ---
    closeSuccessPanelBtn.addEventListener('click', () => {
        successPanel.classList.add('oculto');
    });

});
