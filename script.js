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
