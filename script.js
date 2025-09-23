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
