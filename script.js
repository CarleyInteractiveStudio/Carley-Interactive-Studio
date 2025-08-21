document.addEventListener('DOMContentLoaded', () => {

    // Welcome Text Animation
    const heroTitle = document.querySelector('.hero-text h1');
    const heroTitleText = heroTitle.textContent;
    heroTitle.innerHTML = '';
    heroTitleText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }
        span.style.animationDelay = `${index * 0.05}s`;
        heroTitle.appendChild(span);
    });
    heroTitle.classList.add('letter-animation');


    // 1. Hero Image Fade-out on Scroll
    const heroImage = document.querySelector('.hero-image');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = heroImage.offsetHeight;
        const opacity = 1 - (scrollPosition / (heroHeight / 1.5));
        heroImage.style.opacity = opacity < 0 ? 0 : opacity;
    });

    // 2. Reveal Sections on Scroll
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 3. PayPal Donation Button
    // The user provided the hosted_button_id: JZ4KM2VUD6AMQ
    // I need to add the PayPal SDK script to the index.html for this to work.
    // I will add it now as it's a small change.
    // Let's assume the SDK is loaded. I'll add the rendering logic here.
    // Note: The SDK script itself should be in the HTML.
    // I will add a function to dynamically load the script to avoid modifying the html again.
    function loadPayPalSDK() {
        const script = document.createElement('script');
        script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
        script.charset = 'UTF-8';
        script.onload = () => {
            PayPal.Donation.Button({
                env: 'production',
                hosted_button_id: 'JZ4KM2VUD6AMQ',
                image: {
                    src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
                    alt: 'Donate with PayPal button',
                    title: 'PayPal - The safer, easier way to pay online!'
                }
            }).render('#paypal-donate-button-container');
        };
        document.body.appendChild(script);
    }
    // I will not call this function yet, as I need to first add the paypal button styling.
    // I will come back to this. For now, a function is defined.
    loadPayPalSDK();


    // 4. "No preview" message on project images
    const projectImageContainers = document.querySelectorAll('.project-item .project-image');
    projectImageContainers.forEach(container => {
        container.style.position = 'relative'; // Needed for the overlay
        container.addEventListener('mouseenter', () => {
            const overlay = document.createElement('div');
            overlay.className = 'project-image-overlay';
            overlay.textContent = 'Aún no hay más vistas previas disponibles';
            container.appendChild(overlay);
        });
        container.addEventListener('mouseleave', () => {
            const overlay = container.querySelector('.project-image-overlay');
            if (overlay) {
                overlay.remove();
            }
        });
    });

    // 5. Modal for Creative Engine access request
    const solicitarBtn = document.getElementById('solicitar-acceso-btn');
    solicitarBtn.addEventListener('click', () => {
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Solicitud de Acceso a Creative Engine</h2>
                <form id="creative-engine-form" action="https://formspree.io/f/xgegrvjg" method="POST">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" required>
                    <label for="reason">¿Por qué quieres probar el motor?</label>
                    <textarea id="reason" name="reason" rows="4" required></textarea>
                    <label for="recommendation">¿Cómo te enteraste de nosotros?</label>
                    <input type="text" id="recommendation" name="recommendation">
                    <button type="submit">Enviar Solicitud</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-button');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        const form = modal.querySelector('#creative-engine-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            let status = form.querySelector('.form-status');
            if (!status) {
                status = document.createElement('p');
                status.className = 'form-status';
                form.appendChild(status);
            }

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "¡Gracias por tu interés! Tu solicitud ha sido enviada.";
                    status.style.color = 'green';
                    form.reset();
                    setTimeout(() => {
                        modal.remove();
                    }, 3000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "Oops! Hubo un problema al enviar tu solicitud.";
                        }
                        status.style.color = 'red';
                        submitButton.disabled = false;
                        submitButton.textContent = 'Enviar Solicitud';
                    })
                }
            }).catch(error => {
                status.innerHTML = "Oops! Hubo un problema al enviar tu solicitud. Revisa tu conexión a internet.";
                status.style.color = 'red';
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Solicitud';
            });
        });
    });

    // 6. Creative Engine Gallery
    const galleryBtn = document.getElementById('gallery-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryCloseBtn = galleryModal.querySelector('.close-button');
    const galleryContainer = document.getElementById('gallery-content-container');

    const galleryData = [
        {
            text: "🗂️ Al iniciar tu primer proyecto, selecciona una carpeta donde se alojará. Recomendamos crear una carpeta dedicada, ya que ahí se guardarán todos tus juegos. Una vez creado el proyecto, se generará automáticamente una carpeta llamada Tutorial, con toda la información necesaria para entender el funcionamiento del motor.",
            image: "carley_foto_web/Creacion de nuevo proyecto.png"
        },
        {
            text: "🎬 Puedes comenzar creando una escena. En la jerarquía, añade un 'matter' (tu entidad base) y acompáñalo con un script que definas su lógica. Haz doble clic en el script para editarlo y luego agrégalo como componente al matter.",
            image: "carley_foto_web/crear un matter en jerarquira.png"
        },
        {
            text: "🧠 Da vida a tu personaje, criatura o idea. Anímalo cuadro por cuadro, prueba tu animación en tiempo real, y observa cómo tu visión cobra forma.",
            image: "carley_foto_web/crea tu personaje.png"
        },
        {
            text: "✨ Esto es lo que ya está listo en Creative Engine, el lugar donde la creación no tiene límites.",
            image: "carley_foto_web/Creative Engine beta.png"
        }
    ];

    galleryBtn.addEventListener('click', () => {
        galleryContainer.innerHTML = ''; // Clear previous content
        galleryData.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <div class="gallery-image">
                    <img src="${item.image}" alt="Galería de Creative Engine">
                </div>
                <div class="gallery-text">
                    <p>${item.text}</p>
                </div>
            `;
            galleryContainer.appendChild(galleryItem);
        });
        galleryModal.classList.remove('oculto');
    });

    const closeGalleryModal = () => {
        galleryModal.classList.add('oculto');
    };

    galleryCloseBtn.addEventListener('click', closeGalleryModal);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });

    // 7. Carly Bot Chat Logic
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatBody = document.getElementById('chat-body');

    const botResponses = {
        "hola": "¡Hola! Soy Carl IA. ¿En qué puedo ayudarte hoy?",
        "proyectos": "Actualmente tenemos dos juegos principales, 'Fire at Will' y 'The Battle of the Capsuleers'. También estamos desarrollando nuestro propio motor, ¡Creative Engine!",
        "creative engine": "Creative Engine es nuestro motor de videojuegos 2D. Puedes ver más sobre su desarrollo en la sección de la galería.",
        "gracias": "¡De nada! Estoy aquí para ayudar.",
        "default": "No he entendido bien. Puedo darte información sobre 'proyectos' o 'Creative Engine'."
    };

    const toggleChat = () => {
        chatWindow.classList.toggle('oculto');
    };

    const sendMessage = () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            appendMessage(botResponse, 'bot');
        }, 500);
    };

    const appendMessage = (message, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = message;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const getBotResponse = (userMessage) => {
        const lowerCaseMessage = userMessage.toLowerCase();
        if (lowerCaseMessage.includes('hola')) return botResponses.hola;
        if (lowerCaseMessage.includes('proyecto')) return botResponses.proyectos;
        if (lowerCaseMessage.includes('creative engine')) return botResponses['creative engine'];
        if (lowerCaseMessage.includes('gracias')) return botResponses.gracias;
        return botResponses.default;
    };

    openChatBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial bot message
    appendMessage("¡Hola! Soy Carl IA. Pregúntame sobre nuestros proyectos.", "bot");
});
