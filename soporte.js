// =================================================
// SCRIPT PARA LA PÁGINA DE SOPORTE
// =================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuración de la API ---
    // --- Configuración de la API ---
    // La URL del backend desplegado en Hugging Face.
    const API_BASE_URL = 'https://carley1234-servidor.hf.space';

    // --- Referencias a elementos del DOM ---
    const supportForm = document.getElementById('support-form');
    const hasFilesCheckbox = document.getElementById('has-files');
    const fileUploadSection = document.getElementById('file-upload-section');
    const fileInput = document.getElementById('files');
    const filePreview = document.getElementById('file-preview');
    const successPanel = document.getElementById('success-panel');
    const closeSuccessPanelBtn = document.getElementById('close-success-panel');
    const submitBtn = supportForm.querySelector('.submit-btn');

    // --- Lógica para mostrar/ocultar la sección de archivos ---
    hasFilesCheckbox.addEventListener('change', () => {
        if (hasFilesCheckbox.checked) {
            fileUploadSection.classList.remove('oculto');
        } else {
            fileUploadSection.classList.add('oculto');
            fileInput.value = '';
            filePreview.innerHTML = '';
        }
    });

    // --- Lógica para la vista previa de archivos ---
    fileInput.addEventListener('change', () => {
        filePreview.innerHTML = '';
        const files = Array.from(fileInput.files);

        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        const videoFiles = files.filter(file => file.type.startsWith('video/'));

        if (imageFiles.length > 10) {
            alert('Puedes subir un máximo de 10 imágenes.');
            fileInput.value = '';
            return;
        }

        if (videoFiles.length > 1) {
            alert('Puedes subir un máximo de 1 video.');
            fileInput.value = '';
            return;
        }

        files.forEach(file => {
            const previewItem = document.createElement('div');
            previewItem.classList.add('preview-item');

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = () => URL.revokeObjectURL(img.src);
                previewItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.onloadeddata = () => URL.revokeObjectURL(video.src);
                previewItem.appendChild(video);
            }

            filePreview.appendChild(previewItem);
        });
    });

    // --- Lógica de envío del formulario al servidor ---
    supportForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // --- Feedback visual para el usuario ---
        const originalButtonText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // --- Recopilar datos del formulario ---
        const formData = new FormData();
        formData.append('reason', document.getElementById('reason').value);
        formData.append('app', document.getElementById('app').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('description', document.getElementById('description').value);

        // Adjuntar archivos si existen
        const files = fileInput.files;
        if (files.length > 0) {
            for (const file of files) {
                formData.append('files', file);
            }
        }

        try {
            // --- Enviar datos al servidor ---
            const response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                body: formData, // No se necesita 'Content-Type', el navegador lo establece por nosotros con FormData
            });

            if (!response.ok) {
                // Si el servidor responde con un error
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ocurrió un error en el servidor.');
            }

            // --- Envío exitoso ---
            console.log('Formulario enviado exitosamente.');
            successPanel.classList.remove('oculto');

            supportForm.reset();
            fileUploadSection.classList.add('oculto');
            filePreview.innerHTML = '';

        } catch (error) {
            // --- Manejo de errores ---
            console.error('Error al enviar el formulario:', error);
            alert(`No se pudo enviar la solicitud: ${error.message}`);
        } finally {
            // --- Restaurar el botón ---
            submitBtn.textContent = originalButtonText;
            submitBtn.disabled = false;
        }
    });

    // --- Lógica para cerrar el panel de éxito ---
    closeSuccessPanelBtn.addEventListener('click', () => {
        successPanel.classList.add('oculto');
    });

});
