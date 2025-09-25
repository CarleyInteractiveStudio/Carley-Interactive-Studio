document.addEventListener('DOMContentLoaded', () => {

    const docTopics = [
        {
            title: "Resumen de Creative Engine",
            content: `
                <ul>
                    <li><strong>Plataforma Principal:</strong> Creative Engine es un motor 100% web, lo que te permite usarlo desde cualquier dispositivo con un navegador, sin importar si es antiguo. ¡No consume muchos recursos!</li>
                    <li><strong>Versiones Futuras:</strong> Aunque ahora es web, contaremos con versiones de aplicación para Linux, Windows, Mac, Android y iOS.</li>
                    <li><strong>2D y 3D:</strong> La primera versión se enfocará en 2D, pero nuestro objetivo principal es que el motor soporte tanto 2D como 3D.</li>
                    <li><strong>Gratuito:</strong> El motor es y será 100% gratuito.</li>
                    <li><strong>Interfaz Intuitiva:</strong> Ofrecemos una interfaz de motor real, pero con la facilidad y comodidad de la web y un editor muy lindo y fácil de usar.</li>
                    <li><strong>Enfocado en Novatos:</strong> El motor ofrece muchas ayudas para quienes están empezando en el desarrollo de videojuegos.</li>
                    <li><strong>Scripting Flexible:</strong> Nuestro sistema de scripting, hecho con JavaScript, tiene similitudes con C# y te permite programar en tu propio idioma.</li>
                    <li><strong>Todo en Uno:</strong> Incluye muchas herramientas integradas para que puedas crear tu juego sin tener que salir del motor.</li>
                </ul>
            `
        },
        {
            title: "Documentación de Carl IA",
            content: "<p>Aprende a interactuar con Carl IA, cómo darle instrucciones y sacar el máximo provecho de tu asistente de desarrollo.</p><p><em>(Próximamente más detalles...)</em></p>"
        }
    ];

    const topicList = document.querySelector('.doc-topic-list');

    const showDocsModal = (title, content) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content feature-modal-content">
                <span class="close-button">&times;</span>
                <h3>${title}</h3>
                <div>${content}</div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('.close-button').addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                close();
            }
        });
    };

    if (topicList) {
        topicList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');
            if (!listItem) return;

            const topicId = listItem.getAttribute('data-topic-id');
            if (topicId && docTopics[topicId]) {
                const topic = docTopics[topicId];
                showDocsModal(topic.title, topic.content);
            }
        });
    }
});