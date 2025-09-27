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


    // 5. Feature List Modals
    const featureListData = [
        {
            title: "100% Web y Local",
            content: "<p>Creative Engine funciona 100% en tu navegador, sin necesidad de descargar pesados programas. Todo el trabajo se guarda de forma local en una carpeta que tú eliges, dándote control total y privacidad sobre tus proyectos. Una vez cargado, puedes trabajar incluso sin conexión a internet.</p>"
        },
        {
            title: "Editor Visual Intuitivo",
            content: "<p>La interfaz del editor, incluyendo la jerarquía de objetos y el inspector de propiedades, ha sido rediseñada para ser más bonita, moderna y funcional que antes, haciendo tu flujo de trabajo más rápido y agradable.</p>"
        },
        {
            title: "Scripting Flexible Inspirado en C# y JS",
            content: "<p>Nuestro lenguaje de scripting, <strong>Creative Engine Scripting</strong>, está inspirado en la sintaxis de C# y la flexibilidad de JavaScript, pero con una gran ventaja: ¡puedes programar en tu propio idioma!</p><p>El objetivo es que no tengas que escribir código en inglés. Por ejemplo, en lugar de la sintaxis estándar en inglés:</p><pre><code>public gameObject character;</code></pre><p>Puedes usar su equivalente en español directamente en nuestro motor:</p><pre><code>publico objetoJuego personaje;</code></pre><p>Esto, combinado con nuestro editor de código con autocompletado inteligente, hace que el proceso de desarrollo sea más rápido, intuitivo y accesible para todos.</p>"
        },
        {
            title: "Animación Simplificada con Controlador",
            content: "<p>Organiza todas las animaciones de un personaje o efecto de forma sencilla con nuestro editor de animación. El <strong>Controlador de Animación</strong> te ahorra escribir código complejo para gestionar estados.</p><p>Solo necesitas definir una animación principal (como 'idle') que se reproducirá por defecto, y animaciones secundarias (como 'saltar' o 'correr'). El sistema cambiará automáticamente a la animación secundaria cuando un evento la llame y volverá a la principal cuando termine. ¡No más código manual!</p>"
        },
        {
            title: "Herramientas Integradas",
            content: "<p>Creative Engine es un entorno de desarrollo todo en uno. Incluye:</p><ul><li>Un <strong>editor de código</strong> para que programes directamente en el motor.</li><li>Un <strong>editor de animación</strong> que te permite dibujar y gestionar tus animaciones por sprites sin salir de la herramienta.</li></ul>"
        },
        {
            title: "Renderizado Dual",
            content: "<p>Elige el motor de renderizado que mejor se adapte a tu proyecto. Puedes cambiar entre nuestro renderizador <strong>Canvas 2D</strong>, desarrollado desde cero para ser ligero y rápido, o usar <strong>PixiRenderer</strong> si buscas efectos más realistas con un mejor sistema de luces y sombras.</p>"
        },
        {
            title: "Integración con Asistente IA",
            content: "<p>Próximamente, Creative Engine integrará a <strong>Carl IA</strong>, tu asistente de inteligencia artificial personal. Podrás conversar con la IA a través de una ventana de chat y darle instrucciones a través de un terminal.</p><p>Carl IA podrá interactuar con tu proyecto, crear carpetas, archivos de código y ayudarte a acelerar tu desarrollo. En el futuro, ¡podrá incluso crear un juego completo basado en tu descripción y los recursos que le proporciones!</p>"
        }
    ];

    const featureList = document.querySelector('.feature-list');

    const showFeatureModal = (title, content) => {
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

    if (featureList) {
        featureList.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');
            if (!listItem) return;

            // Find the index of the clicked li
            const index = Array.from(featureList.children).indexOf(listItem);

            if (index > -1 && featureListData[index]) {
                const feature = featureListData[index];
                // Use the h3 content as a fallback title if needed, but prefer the data object
                const title = feature.title || listItem.querySelector('strong').textContent;
                showFeatureModal(title, feature.content);
            }
        });
    }


    // Modal for Creative Engine access request
    const solicitarBtn = document.getElementById('solicitar-acceso-btn');
    solicitarBtn.addEventListener('click', () => {
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Solicitud de Acceso a Creative Engine</h2>
                <form id="creative-engine-form" action="https://formspree.io/f/mldlyzyy" method="POST">
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


    // Generic Modal for Support/Contact
    const showSupportModal = (config) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${config.title}</h2>
                <p>${config.description}</p>
                <form id="support-form" action="https://formspree.io/f/mldlyzyy" method="POST">
                    <input type="hidden" name="_subject" value="${config.subject}">
                    <label for="email">Tu Correo Electrónico:</label>
                    <input type="email" id="email" name="email" required>
                    <button type="submit">Enviar</button>
                    <p class="form-status"></p>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-button');
        const form = modal.querySelector('#support-form');
        const statusEl = modal.querySelector('.form-status');
        const submitBtn = modal.querySelector('button[type="submit"]');

        const closeModal = () => modal.remove();
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    form.innerHTML = `<p style="color: green;">¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.</p>`;
                    setTimeout(closeModal, 3000);
                } else {
                    response.json().then(data => {
                        statusEl.textContent = data.errors ? data.errors.map(err => err.message).join(', ') : 'Oops! Hubo un problema.';
                        statusEl.style.color = 'red';
                    });
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar';
                }
            }).catch(() => {
                statusEl.textContent = 'Oops! Hubo un problema de red.';
                statusEl.style.color = 'red';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
            });
        });
    };

    // Event Listeners for Support Modals
    const supportButtonConfigs = {
        'support-carl-ia-money': {
            title: 'Apoyar a Carl IA Monetariamente',
            description: 'Tu donación nos ayuda a cubrir los costos de servidor y desarrollo. ¡Muchas gracias por tu apoyo!',
            subject: 'Apoyo Monetario para Carl IA'
        },
        'support-carl-ia-server': {
            title: 'Aportar un Servidor para Carl IA',
            description: 'Si tienes recursos de servidor que puedas aportar, déjanos tu correo y nos pondremos en contacto contigo. ¡Gracias!',
            subject: 'Interés en Aportar Servidor para Carl IA'
        },
        'support-engine-dev': {
            title: 'Colaborar como Desarrollador',
            description: '¡Genial! Nos encanta que quieras unirte al equipo. Déjanos tu correo y te contactaremos para hablar sobre cómo puedes contribuir.',
            subject: 'Interés en Colaborar como Desarrollador'
        },
        'support-engine-money': {
            title: 'Apoyar el Desarrollo del Motor',
            description: 'Cada contribución nos ayuda a dedicar más tiempo y recursos a Creative Engine. ¡Gracias por ayudarnos a hacerlo posible!',
            subject: 'Apoyo Monetario para Creative Engine'
        }
    };

    Object.keys(supportButtonConfigs).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                showSupportModal(supportButtonConfigs[id]);
            });
        }
    });


    // 4. Carly Bot Chat Logic
    const openChatBtn = document.getElementById('open-chat-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatBody = document.getElementById('chat-body');

    const botResponses = {
        "hola": "¡Hola! Soy Carl IA. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre Creative Engine o cómo puedes apoyar nuestros proyectos.",
        "creative engine": "Creative Engine es nuestro motor de videojuegos 100% web. Puedes leer todo sobre él en la sección 'Creative Engine' de esta página.",
        "apoyar": "¡Gracias por tu interés! Puedes apoyar el desarrollo de Creative Engine monetariamente o, si eres desarrollador, uniéndote al equipo. También puedes ayudar a Carl IA aportando un servidor. ¡Toda la información está en la página!",
        "gracias": "¡De nada! Estoy aquí para ayudar.",
        "default": "No he entendido bien. Puedo darte información sobre 'Creative Engine' o cómo 'apoyar' nuestros proyectos."
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
        if (lowerCaseMessage.includes('creative engine')) return botResponses['creative engine'];
        if (lowerCaseMessage.includes('apoyar') || lowerCaseMessage.includes('donar') || lowerCaseMessage.includes('contribuir')) return botResponses.apoyar;
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
    appendMessage("¡Hola! Soy Carl IA. Pregúntame sobre Creative Engine o cómo puedes apoyar.", "bot");
});
