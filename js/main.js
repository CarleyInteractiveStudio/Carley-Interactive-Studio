/* ==============================
   Core Logic & Functional Systems
============================== */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeAuth();
    initializeSearch();
    initializeTranslations();
    initializeDonations();
    initializeAnimations();
});

/* ==============================
   Authentication System
============================== */
async function initializeAuth() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    updateAuthStateUI(session);

    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        updateAuthStateUI(session);
    });

    // Profile Actions
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = async () => {
            const newUsername = document.getElementById('username-edit').value;
            const { error } = await window.supabaseClient.auth.updateUser({
                data: { username: newUsername }
            });
            if (error) alert('Error: ' + error.message);
            else alert('Perfil actualizado correctamente.');
        };
    }

    const logoutBtn = document.getElementById('logout-action');
    if (logoutBtn) {
        logoutBtn.onclick = async () => {
            await window.supabaseClient.auth.signOut();
            closeStudioModal('modal-account');
            alert('Has cerrado sesión.');
        };
    }

    // Auth Submission Logic
    const loginSubmit = document.getElementById('do-login');
    if (loginSubmit) {
        loginSubmit.onclick = async () => {
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            const { error } = await window.supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) return alert(error.message);
            closeStudioModal('modal-auth-login');
            alert('¡Bienvenido de nuevo!');
        };
    }

    const registerSubmit = document.getElementById('do-register');
    if (registerSubmit) {
        registerSubmit.onclick = async () => {
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            const confirm = document.getElementById('reg-pass-confirm').value;
            if (pass !== confirm) return alert('Las contraseñas no coinciden.');

            const { error } = await window.supabaseClient.auth.signUp({
                email, password: pass
            });
            if (error) return alert(error.message);
            closeStudioModal('modal-auth-register');
            alert('Cuenta creada e iniciada con éxito.');
        };
    }
}

function updateAuthStateUI(session) {
    const loggedInDiv = document.getElementById('auth-state-logged-in');
    const loggedOutDiv = document.getElementById('auth-state-logged-out');
    const emailDisplay = document.getElementById('user-email-display');
    const usernameInput = document.getElementById('username-edit');

    window.currentUser = session ? session.user : null;

    if (session) {
        if (loggedInDiv) loggedInDiv.classList.remove('hidden');
        if (loggedOutDiv) loggedOutDiv.classList.add('hidden');
        if (emailDisplay) emailDisplay.textContent = session.user.email;
        if (usernameInput) usernameInput.value = session.user.user_metadata.username || session.user.email.split('@')[0];
    } else {
        if (loggedInDiv) loggedInDiv.classList.add('hidden');
        if (loggedOutDiv) loggedOutDiv.classList.remove('hidden');
    }
}

/* ==============================
   Search Engine Logic
============================== */
function initializeSearch() {
    const searchInput = document.getElementById('main-search');
    const dropdown = document.getElementById('search-dropdown');

    if (!searchInput || !dropdown) return;

    const searchMap = [
        { name: 'Creative Engine', id: 'hero-engine', url: 'creative-engine.html', keywords: ['motor', 'videojuegos', '2d', 'ia'] },
        { name: 'Carl IA', id: 'carl-ia', keywords: ['inteligencia artificial', 'modelo', 'multimodal'] },
        { name: 'Traspilador', id: 'traspilador', keywords: ['modelo', 'codificación', 'traducción', 'c++'] },
        { name: 'Donaciones', id: 'studio-footer', keywords: ['apoyo', 'paypal', 'ayuda'] },
        { name: 'Canales', id: 'studio-footer', keywords: ['redes', 'youtube', 'facebook', 'whatsapp'] }
    ];

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        dropdown.innerHTML = '';

        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }

        const matches = searchMap.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.keywords.some(k => k.includes(query))
        );

        if (matches.length > 0) {
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = match.name;
                div.onclick = () => {
                    if (match.url) {
                        window.location.href = match.url;
                    } else {
                        document.getElementById(match.id).scrollIntoView({ behavior: 'smooth' });
                    }
                    dropdown.classList.add('hidden');
                    searchInput.value = '';
                };
                dropdown.appendChild(div);
            });
            dropdown.classList.remove('hidden');
        } else {
            dropdown.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

/* ==============================
   Internationalization System
============================== */
const translations = {
    es: {
        welcome: "Bienvenido, nos alegra tenerte aquí",
        "search-ph": "Buscar en Carley...",
        "hero-desc": "¿Alguna vez has pensado en desarrollar tu propio videojuego? Pues hemos diseñado para ti Creative Engine, un motor de videojuego 2D que te facilita todo. No importa que tengas experiencia en la creación de videojuegos o no, Creative Engine está hecho para ti. Cualquier idea que tengas, Creative Engine te ayuda a convertirla en realidad.",
        "hero-cta": "Empezar a Crear",
        "hero-more": "Saber más",
        "carl-ia-desc": "Nuestra IA actualmente en desarrollo. Muy pronto estará disponible para ayudarte en todo lo que necesites. Nuestro modelo será completo: tendrá visión, podrá hablar, generar texto y escuchar. Lo estamos entrenando para que sea el compañero integral definitivo.",
        "learn-more": "Saber más",
        "traspilador-desc": "Diseñado para desarrolladores. Un modelo de codificación capaz de convertir proyectos de un lenguaje a otro (ejemplo: de JS a C++). Simplifica la migración de tus proyectos y acelera tu flujo de trabajo.",
        "explore-docs": "Explorar documentación",
        "footer-channels": "Canales",
        "footer-donations": "Donaciones",
        "footer-info": "Información",
        "footer-products": "Nuestros Productos",
        "footer-donate-paypal": "Donar con PayPal",
        "footer-donate-info": "¿Qué hacemos con sus donaciones?",
        "footer-privacy": "Política de Privacidad",
        "footer-license": "Licencia",
        "footer-copyright": "© 2026 Carley Interactive Studio. Todos los derechos reservados.",
        "acc-modal-title": "Mi Cuenta",
        "field-email": "Email",
        "field-username": "Nombre de Usuario",
        "btn-update": "Actualizar Perfil",
        "btn-logout": "Cerrar Sesión",
        "modal-hint": "Inicia sesión para gestionar tus proyectos.",
        "btn-login": "Entrar",
        "btn-register": "Crear Cuenta",
        "login-title": "Iniciar Sesión",
        "ph-email": "Email",
        "ph-pass": "Contraseña",
        "ph-pass-confirm": "Confirmar Contraseña",
        "btn-login-action": "Entrar",
        "register-title": "Crear Cuenta",
        "btn-register-action": "Registrar",
        "donations-modal-title": "¿Qué hacemos con sus donaciones?",
        "donations-modal-desc": "Tu apoyo nos permite contratar más talento, mejorar nuestros servidores y acelerar el desarrollo de herramientas gratuitas para la comunidad como Creative Engine. Cada donación se invierte directamente en la mejora de nuestras tecnologías.",
        "privacy-modal-title": "Privacidad",
        "privacy-modal-desc": "Tus datos están seguros. Solo los utilizamos para mejorar tu experiencia en nuestra plataforma.",
        "license-modal-title": "Licencia",
        "license-modal-desc": "Todos nuestros productos están protegidos por leyes de propiedad intelectual internacionales.",
        // Creative Engine
        "ce-nav-info": "Información",
        "ce-nav-report": "Reportar",
        "ce-nav-opinions": "Opiniones",
        "ce-nav-license": "Licencia",
        "ce-nav-privacy": "Privacidad",
        "ce-nav-join": "Únete y Seguirnos",
        "ce-nav-claims": "Reclamos",
        "ce-nav-donations": "Donaciones",
        "ce-info-1": "Creative Engine fue diseñado para todo público. No importa que seas experto, novato o no tengas experiencia alguna, Creative Engine te ayuda y te enseña.",
        "ce-info-2": "Nuestro motor fue inspirado de Unity pero se basa en materias y leyes. Las materias pueden ser cualquier cosa de tu juego y las leyes todo lo que define el comportamiento de cada cosa de tu juego; son un conjunto de reglas que hacen tu juego único y hacerlo lo que quieras que sea.",
        "ce-why-title": "¿Por qué usar Creative Engine?",
        "ce-why-1": "El motor está en varios idiomas diferentes y tiene 3 formas de codificar:",
        "ce-ces-desc": "Diseñado para quienes ya son expertos en la creación de videojuegos y gustan programar a puro código. Hecho con JS e inspirado en C#, JS y Python. Permite programar completamente en español, inglés, portugués, ruso y chino (y se extenderá a más idiomas).",
        "ce-scratch-desc": "Podrán crear la lógica del juego arrastrando bloques. Muy bueno para quienes están empezando. Aún está en desarrollo.",
        "ce-human-desc": "Aquí solo tendrás que hablarle al motor, decirle lo que quieres que haga el script y el motor te entenderá.",
        "ce-info-3": "Puedes crear un juego en menos de 1 hora y sin escribir ni una sola línea de código. El motor incluye varios componentes básicos que te ayudan a crear tus juegos. Al ser web, puedes publicarlos en varias plataformas y para varios dispositivos.",
        "ce-info-4": "Nuestro motor tiene un sistema de librería que permite a los desarrolladores crear varias librerías. Si quieres, por ejemplo, una IA para tu juego, no tienes que hacer una IA avanzada desde 0; solo descargas la librería y listo.",
        "ce-info-5": "Nuestro motor tiene integrado a Carl IA que te ayudará a hacer realidad tus ideas y te guiará en cada paso de tu desarrollo.",
        "ce-info-free": "Creative Engine es 100% gratuito. No reclamamos derechos por ningún juego hecho con él; de hecho, mientras más creas, más nos alegramos.",
        "ce-info-open": "El motor mismo estará disponible en código abierto para todos aquellos que quieran modificarlo a sus gustos.",
        "ce-info-team": "Creative Engine tiene en desarrollo un sistema que te permitirá crear videojuegos en equipo. Muy bueno para escuelas que quieren enseñar el desarrollo de videojuegos a los estudiantes o pequeños estudios.",
        "ce-info-vidspri": "Creative Engine tiene integrado a Vid Spri, una herramienta que te permite crear animaciones y sonido para tus videojuegos.",
        "ph-bug-desc": "Describe el fallo...",
        "field-message": "Mensaje",
        "field-photos": "Fotos (Máx 5)",
        "btn-send": "Enviar Reporte",
        "field-opinion": "Tu Opinión",
        "ph-opinion": "¿Qué piensas de Creative Engine?",
        "btn-send-opinion": "Publicar Opinión",
        "opinion-hint": "Leeremos sus opiniones y consideraremos todas aquellas con más me gusta en futuras actualizaciones.",
        "ce-license-1": "Los juegos hechos están disponibles bajo la licencia CLG1 (Carley Gratuito).",
        "ce-license-2": "El licenciatario tiene todo derecho de usar como le dé la gana en todo su producto. No reclamamos ningún porcentaje.",
        "ce-license-3": "No somos responsables; o sea, no tenemos una obligación de resolver bugs, fallos o errores que pueda presentar el producto.",
        "ce-license-4": "No tenemos derechos en el producto del usuario a menos que este nos lo permita.",
        "ce-license-date": "Última actualización: 4 de marzo de 2026",
        "ce-privacy-main": "No guardamos ningún otro tipo de datos que no sea información necesaria para su cuenta y opiniones en nuestros servidores, etc.",
        "ce-claim-reason": "Razón del reclamo",
        "claim-hint": "Puedes reclamar en la misma semana que hayas hecho las donaciones; posteriormente no garantizamos una devuelta.",
        "btn-send-claim": "Enviar Reclamo",
        "ce-donate-1": "No necesitas ser un desarrollador para aportar a nuestro motor. Tu apoyo monetario nos ayudará a contratar desarrolladores y pagar servidores para hacer de Vid Spri una herramienta muy útil y gratis.",
        "ce-donate-2": "Nos financiará a seguir adelante y pagar servidores para que en un futuro puedas usar Carl IA sin depender de API externa de forma gratuita.",
        "btn-support": "Apoyar",
        "btn-ad": "Ver un anuncio para apoyarnos",
        "ce-donate-claim": "Si en todo caso quieres hacer un reclamo puedes hacerlo desde Reclamos.",
        "ce-nav-credits": "Créditos",
        "credits-main": "Este proyecto no estaría sin la increíble ayuda de Google Jules, quien ha hecho gran parte del proyecto. Agradecemos a Google por sus generosos planes gratuitos.",
        "credits-ms": "También agradecemos a Microsoft Copilot, que también ha aportado al proyecto significativamente.",
        "credits-gemini": "Finalmente, agradecemos a Google AI Studio por su generoso plan y a su modelo de Gemini para el uso gratuito de Carl IA."
    },
    en: {
        welcome: "Welcome, we're glad to have you here",
        "search-ph": "Search in Carley...",
        "hero-desc": "Have you ever thought about developing your own video game? Well, we have designed Creative Engine for you, a 2D video game engine that makes everything easy. Whether you have experience in game creation or not, Creative Engine is made for you. Any idea you have, Creative Engine helps you turn it into reality.",
        "hero-cta": "Start Creating",
        "hero-more": "Learn more",
        "carl-ia-desc": "Our AI currently under development. Very soon it will be available to help you with everything you need. Our model will be complete: it will have vision, be able to speak, generate text, and listen. We are training it to be the ultimate integral companion.",
        "learn-more": "Learn more",
        "traspilador-desc": "Designed for developers. A coding model capable of converting projects from one language to another (example: from JS to C++). Simplify your project migration and speed up your workflow.",
        "explore-docs": "Explore documentation",
        "footer-channels": "Channels",
        "footer-donations": "Donations",
        "footer-info": "Information",
        "footer-products": "Our Products",
        "footer-donate-paypal": "Donate with PayPal",
        "footer-donate-info": "What do we do with your donations?",
        "footer-privacy": "Privacy Policy",
        "footer-license": "License",
        "footer-copyright": "© 2026 Carley Interactive Studio. All rights reserved.",
        "acc-modal-title": "My Account",
        "field-email": "Email",
        "field-username": "Username",
        "btn-update": "Update Profile",
        "btn-logout": "Log Out",
        "modal-hint": "Log in to manage your projects.",
        "btn-login": "Enter",
        "btn-register": "Create Account",
        "login-title": "Log In",
        "ph-email": "Email",
        "ph-pass": "Password",
        "ph-pass-confirm": "Confirm Password",
        "btn-login-action": "Enter",
        "register-title": "Create Account",
        "btn-register-action": "Register",
        "donations-modal-title": "What do we do with your donations?",
        "donations-modal-desc": "Your support allows us to hire more talent, improve our servers, and accelerate the development of free tools for the community like Creative Engine. Every donation is invested directly into improving our technologies.",
        "privacy-modal-title": "Privacy",
        "privacy-modal-desc": "Your data is safe. We only use it to improve your experience on our platform.",
        "license-modal-title": "License",
        "license-modal-desc": "All our products are protected by international intellectual property laws.",
        // Creative Engine
        "ce-nav-info": "Information",
        "ce-nav-report": "Report",
        "ce-nav-opinions": "Opinions",
        "ce-nav-license": "License",
        "ce-nav-privacy": "Privacy",
        "ce-nav-join": "Join & Follow",
        "ce-nav-claims": "Claims",
        "ce-nav-donations": "Donations",
        "ce-info-1": "Creative Engine was designed for everyone. It doesn't matter if you're an expert, a novice, or have no experience at all, Creative Engine helps and teaches you.",
        "ce-info-2": "Our engine was inspired by Unity but is based on matters and laws. Matters can be anything in your game and laws are everything that defines the behavior of each thing in your game; they are a set of rules that make your game unique and make it what you want it to be.",
        "ce-why-title": "Why use Creative Engine?",
        "ce-why-1": "The engine is in several different languages and has 3 ways of coding:",
        "ce-ces-desc": "Designed for those who are already experts in video game creation and like to program with pure code. Made with JS and inspired by C#, JS, and Python. Allows programming entirely in Spanish, English, Portuguese, Russian, and Chinese (and will be extended to more languages).",
        "ce-scratch-desc": "You can create game logic by dragging blocks. Great for those who are just starting out. Still in development.",
        "ce-human-desc": "Here you just have to talk to the engine, tell it what you want the script to do, and the engine will understand you.",
        "ce-info-3": "You can create a game in less than 1 hour and without writing a single line of code. The engine includes several basic components that help you create your games. Being web-based, you can publish them on multiple platforms and for various devices.",
        "ce-info-4": "Our engine has a library system that allows developers to create various libraries. If you want, for example, an AI for your game, you don't have to make an advanced AI from scratch; just download the library and that's it.",
        "ce-info-5": "Our engine has Carl IA integrated, which will help you make your ideas a reality and guide you through every step of your development.",
        "ce-info-free": "Creative Engine is 100% free. We do not claim rights to any game made with it; in fact, the more you create, the happier we are.",
        "ce-info-open": "The engine itself will be available in open source for all those who want to modify it to their liking.",
        "ce-info-team": "Creative Engine is developing a system that will allow you to create video games as a team. Great for schools that want to teach video game development to students or small studios.",
        "ce-info-vidspri": "Creative Engine has Vid Spri integrated, a tool that allows you to create animations and sound for your video games.",
        "ph-bug-desc": "Describe the bug...",
        "field-message": "Message",
        "field-photos": "Photos (Max 5)",
        "btn-send": "Send Report",
        "field-opinion": "Your Opinion",
        "ph-opinion": "What do you think of Creative Engine?",
        "btn-send-opinion": "Publish Opinion",
        "opinion-hint": "We will read your opinions and consider all those with more likes in future updates.",
        "ce-license-1": "Games made are available under the CLG1 license (Carley Free).",
        "ce-license-2": "The licensee has every right to use it however they want in their entire product. We do not claim any percentage.",
        "ce-license-3": "We are not responsible; that is, we do not have an obligation to resolve bugs, failures, or errors that the product may present.",
        "ce-license-4": "We have no rights in the user's product unless they allow us.",
        "ce-license-date": "Last updated: March 4, 2026",
        "ce-privacy-main": "We do not store any other type of data other than information necessary for your account and opinions on our servers, etc.",
        "ce-claim-reason": "Reason for the claim",
        "claim-hint": "You can claim in the same week that you have made the donations; thereafter we do not guarantee a refund.",
        "btn-send-claim": "Send Claim",
        "ce-donate-1": "You don't need to be a developer to contribute to our engine. Your monetary support will help us hire developers and pay for servers to make Vid Spri a very useful and free tool.",
        "ce-donate-2": "It will fund us to keep moving forward and pay for servers so that in the future you can use Carl IA without depending on an external API for free.",
        "btn-support": "Support",
        "btn-ad": "Watch an ad to support us",
        "ce-donate-claim": "If in any case you want to make a claim you can do it from Claims.",
        "ce-nav-credits": "Credits",
        "credits-main": "This project wouldn't be possible without the incredible help of Google Jules, who has done much of the project. We thank Google for their generous free plans.",
        "credits-ms": "We also thank Microsoft Copilot, which has also significantly contributed to the project.",
        "credits-gemini": "Finally, we thank Google AI Studio for their generous plan and their Gemini model for the free use of Carl IA."
    },
    fr: {
        welcome: "Bienvenue, nous sommes ravis de vous voir ici",
        "search-ph": "Rechercher dans Carley...",
        "hero-desc": "Avez-vous déjà pensé à développer votre propre jeu vidéo ? Eh bien, nous avons conçu Creative Engine pour vous, un moteur de jeu vidéo 2D qui facilite tout. Que vous ayez de l'expérience dans la création de jeux ou non, Creative Engine est fait pour vous. Quelle que soit votre idée, Creative Engine vous aide à la concrétiser.",
        "hero-cta": "Commencer à créer",
        "carl-ia-desc": "Notre IA actuellement en développement. Très bientôt, elle sera disponible pour vous aider dans tout ce dont vous avez besoin. Notre modèle sera complet : il aura une vision, pourra parler, générer du texte et écouter. Nous l'entraînons pour être le compagnon intégral ultime.",
        "learn-more": "En savoir plus",
        "traspilador-desc": "Conçu pour les développeurs. Un modèle de codage capable de convertir des projets d'un langage à un autre (exemple : de JS à C++). Simplifiez la migration de vos projets et accélérez votre flux de travail.",
        "explore-docs": "Explorer la documentation",
        "footer-channels": "Chaînes",
        "footer-donations": "Dons",
        "footer-info": "Information",
        "footer-products": "Nos produits",
        "footer-donate-paypal": "Faire un don avec PayPal",
        "footer-donate-info": "Que faisons-nous de vos dons ?",
        "footer-privacy": "Politique de confidentialité",
        "footer-license": "Licence",
        "footer-copyright": "© 2026 Carley Interactive Studio. Tous droits réservés.",
        "acc-modal-title": "Mon compte",
        "field-email": "E-mail",
        "field-username": "Nom d'utilisateur",
        "btn-update": "Mettre à jour le profil",
        "btn-logout": "Se déconnecter",
        "modal-hint": "Connectez-vous pour gérer vos projets.",
        "btn-login": "Entrer",
        "btn-register": "Créer un compte",
        "login-title": "Se connecter",
        "ph-email": "E-mail",
        "ph-pass": "Mot de passe",
        "ph-pass-confirm": "Confirmer le mot de passe",
        "btn-login-action": "Entrer",
        "register-title": "Créer un compte",
        "btn-register-action": "S'inscrire",
        "donations-modal-title": "Que faisons-nous de vos dons ?",
        "donations-modal-desc": "Votre soutien nous permet d'embaucher plus de talents, d'améliorer nos serveurs et d'accélérer le développement d'outils gratuits pour la communauté comme Creative Engine. Chaque don est investi directement dans l'amélioration de nos technologies.",
        "privacy-modal-title": "Confidentialité",
        "privacy-modal-desc": "Vos données sont en sécurité. Nous les utilisons uniquement pour améliorer votre expérience sur notre plateforme.",
        "license-modal-title": "Licence",
        "license-modal-desc": "Tous nos produits sont protégés par les lois internationales sur la propriété intellectuelle."
    },
    pt: {
        welcome: "Bem-vindo, estamos felizes em tê-lo aqui",
        "search-ph": "Pesquisar em Carley...",
        "hero-desc": "Já pensou em desenvolver seu próprio videogame? Bem, projetamos o Creative Engine para você, um motor de videogame 2D que facilita tudo. Não importa se você tem experiência na criação de jogos ou não, o Creative Engine foi feito para você. Qualquer ideia que você tenha, o Creative Engine ajuda a torná-la realidade.",
        "hero-cta": "Começar a criar",
        "carl-ia-desc": "Nossa IA atualmente em desenvolvimento. Muito em breve estará disponível para ajudá-lo em tudo o que você precisar. Nosso modelo será completo: terá visão, poderá falar, gerar texto e ouvir. Estamos treinando para ser o companheiro integral definitivo.",
        "learn-more": "Saber mais",
        "traspilador-desc": "Projetado para desenvolvedores. Um modelo de codificação capaz de converter projetos de uma linguagem para outra (exemplo: de JS para C++). Simplifique a migração de seus projetos e acelere seu fluxo de trabalho.",
        "explore-docs": "Explorar documentação",
        "footer-channels": "Canais",
        "footer-donations": "Doações",
        "footer-info": "Informação",
        "footer-products": "Nossos Produtos",
        "footer-donate-paypal": "Doar com PayPal",
        "footer-donate-info": "O que fazemos com suas doações?",
        "footer-privacy": "Política de Privacidade",
        "footer-license": "Licença",
        "footer-copyright": "© 2026 Carley Interactive Studio. Todos os direitos reservados.",
        "acc-modal-title": "Minha Conta",
        "field-email": "E-mail",
        "field-username": "Nome de Usuário",
        "btn-update": "Atualizar Perfil",
        "btn-logout": "Encerrar Sessão",
        "modal-hint": "Faça login para gerenciar seus projetos.",
        "btn-login": "Entrar",
        "btn-register": "Criar Conta",
        "login-title": "Entrar",
        "ph-email": "E-mail",
        "ph-pass": "Senha",
        "ph-pass-confirm": "Confirmar Senha",
        "btn-login-action": "Entrar",
        "register-title": "Criar Conta",
        "btn-register-action": "Registrar",
        "donations-modal-title": "O que fazemos com suas doações?",
        "donations-modal-desc": "Seu apoio nos permite contratar mais talentos, melhorar nossos servidores e acelerar o desenvolvimento de ferramentas gratuitas para a comunidade como o Creative Engine. Cada doação é investida diretamente na melhoria de nossas tecnologias.",
        "privacy-modal-title": "Privacidade",
        "privacy-modal-desc": "Seus dados estão seguros. Usamos apenas para melhorar sua experiência em nossa plataforma.",
        "license-modal-title": "Licença",
        "license-modal-desc": "Todos os nossos produtos são protegidos por leis de propriedade intelectual internacionais."
    },
    ru: {
        welcome: "Добро пожаловать, мы рады видеть вас здесь",
        "search-ph": "Поиск в Carley...",
        "hero-desc": "Вы когда-нибудь задумывались о разработке собственной видеоигры? Что ж, мы разработали для вас Creative Engine — движок для 2D-видеоигр, который упрощает все. Неважно, есть ли у вас опыт создания игр или нет, Creative Engine создан для вас. Любую вашу идею Creative Engine поможет воплотить в реальность.",
        "hero-cta": "Начать создание",
        "carl-ia-desc": "Наш ИИ в настоящее время находится в разработке. Совсем скоро он будет доступен, чтобы помочь вам во всем, что вам нужно. Наша модель будет полноценной: у нее будет зрение, она сможет говорить, генерировать текст и слушать. Мы обучаем его, чтобы он стал идеальным всесторонним компаньоном.",
        "learn-more": "Узнать больше",
        "traspilador-desc": "Создан для разработчиков. Модель кодирования, способная преобразовывать проекты с одного языка на другой (например, с JS на C++). Упростите миграцию ваших проектов и ускорьте рабочий процесс.",
        "explore-docs": "Изучить документацию",
        "footer-channels": "Каналы",
        "footer-donations": "Пожертвования",
        "footer-info": "Информация",
        "footer-products": "Наши продукты",
        "footer-donate-paypal": "Пожертвовать через PayPal",
        "footer-donate-info": "Что мы делаем с вашими пожертвованиями?",
        "footer-privacy": "Политика конфиденциальности",
        "footer-license": "Лицензия",
        "footer-copyright": "© 2026 Carley Interactive Studio. Все права защищены.",
        "acc-modal-title": "Мой аккаунт",
        "field-email": "Электронная почта",
        "field-username": "Имя пользователя",
        "btn-update": "Обновить профиль",
        "btn-logout": "Выйти",
        "modal-hint": "Войдите, чтобы управлять своими проектами.",
        "btn-login": "Войти",
        "btn-register": "Создать аккаунт",
        "login-title": "Вход",
        "ph-email": "Электронная почта",
        "ph-pass": "Пароль",
        "ph-pass-confirm": "Подтвердите пароль",
        "btn-login-action": "Войти",
        "register-title": "Создать аккаунт",
        "btn-register-action": "Зарегистрироваться",
        "donations-modal-title": "Что мы делаем с вашими пожертвованиями?",
        "donations-modal-desc": "Ваша поддержка позволяет нам нанимать больше талантов, улучшать наши серверы и ускорять разработку бесплатных инструментов для сообщества, таких как Creative Engine. Каждое пожертвование инвестируется непосредственно в совершенствование наших технологий.",
        "privacy-modal-title": "Конфиденциальность",
        "privacy-modal-desc": "Ваши данные в безопасности. Мы используем их только для улучшения вашего опыта на нашей платформе.",
        "license-modal-title": "Лицензия",
        "license-modal-desc": "Все наши продукты защищены международными законами об интеллектуальной собственности."
    },
    zh: {
        welcome: "欢迎，很高兴您来到这里",
        "search-ph": "在 Carley 中搜索...",
        "hero-desc": "您是否想过开发自己的视频游戏？ 那么，我们为您设计了 Creative Engine，这是一款让一切变得简单的 2D 视频游戏引擎。 无论您是否有游戏创作经验，Creative Engine 都是为您量身定制的。 无论您有什么想法，Creative Engine 都能帮助您将其变为现实。",
        "hero-cta": "开始创作",
        "carl-ia-desc": "我们的 AI 目前正在开发中。 很快它就能为您提供所需的一切帮助。 我们的模型将是完整的：它将具有视觉，能够说话，生成文本和收听。 我们正在训练它成为最终的全方位伴侣。",
        "learn-more": "了解更多",
        "traspilador-desc": "专为开发人员设计。 一种能够将项目从一种语言转换为另一种语言（例如：从 JS 到 C++）的编码模型。 简化您的项目迁移并加快您的工作流程。",
        "explore-docs": "浏览文档",
        "footer-channels": "频道",
        "footer-donations": "捐赠",
        "footer-info": "信息",
        "footer-products": "我们的产品",
        "footer-donate-paypal": "通过 PayPal 捐赠",
        "footer-donate-info": "我们如何处理您的捐赠？",
        "footer-privacy": "隐私政策",
        "footer-license": "许可",
        "footer-copyright": "© 2026 Carley Interactive Studio。 版权所有。",
        "acc-modal-title": "我的账户",
        "field-email": "电子邮件",
        "field-username": "用户名",
        "btn-update": "更新资料",
        "btn-logout": "登出",
        "modal-hint": "登录以管理您的项目。",
        "btn-login": "进入",
        "btn-register": "创建账户",
        "login-title": "登录",
        "ph-email": "电子邮件",
        "ph-pass": "密码",
        "ph-pass-confirm": "确认密码",
        "btn-login-action": "进入",
        "register-title": "创建账户",
        "btn-register-action": "注册",
        "donations-modal-title": "我们如何处理您的捐赠？",
        "donations-modal-desc": "您的支持使我们能够招聘更多人才、改进我们的服务器并加速开发 Creative Engine 等社区免费工具。 每笔捐赠都直接用于改进我们的技术。",
        "privacy-modal-title": "隐私",
        "privacy-modal-desc": "您的数据是安全的。 我们仅将其用于改善您在我们平台上的体验。",
        "license-modal-title": "许可",
        "license-modal-desc": "我们的所有产品均受国际知识产权法保护。"
    },
    it: {
        welcome: "Benvenuto, siamo felici di averti qui",
        "search-ph": "Cerca in Carley...",
        "hero-desc": "Hai mai pensato di sviluppare il tuo videogioco? Bene, abbiamo progettato per te Creative Engine, un motore di videogioco 2D che semplifica tutto. Non importa se hai esperienza nella creazione di giochi o meno, Creative Engine è fatto per te. Qualunque idea tu abbia, Creative Engine ti aiuta a trasformarla in realtà.",
        "hero-cta": "Inizia a creare",
        "carl-ia-desc": "La nostra IA attualmente in fase di sviluppo. Molto presto sarà disponibile per aiutarti in tutto ciò di cui hai bisogno. Il nostro modello sarà completo: avrà visione, potrà parlare, generare testo e ascoltare. Lo stiamo addestrando per essere il compagno integrale definitivo.",
        "learn-more": "Saperne di più",
        "traspilador-desc": "Progettato per gli sviluppatori. Un modello di codifica in grado di convertire progetti da un linguaggio all'altro (esempio: da JS a C++). Semplifica la migrazione dei tuoi progetti e accelera il tuo flusso di lavoro.",
        "explore-docs": "Esplora la documentazione",
        "footer-channels": "Canali",
        "footer-donations": "Donazioni",
        "footer-info": "Informazione",
        "footer-products": "I nostri prodotti",
        "footer-donate-paypal": "Dona con PayPal",
        "footer-donate-info": "Cosa facciamo con le tue donazioni?",
        "footer-privacy": "Informativa sulla privacy",
        "footer-license": "Licenza",
        "footer-copyright": "© 2026 Carley Interactive Studio. Tutti i diritti riservati.",
        "acc-modal-title": "Il mio account",
        "field-email": "E-mail",
        "field-username": "Nome utente",
        "btn-update": "Aggiorna profilo",
        "btn-logout": "Disconnetti",
        "modal-hint": "Accedi per gestire i tuoi progetti.",
        "btn-login": "Entra",
        "btn-register": "Crea account",
        "login-title": "Accedi",
        "ph-email": "E-mail",
        "ph-pass": "Password",
        "ph-pass-confirm": "Conferma password",
        "btn-login-action": "Entra",
        "register-title": "Crea account",
        "btn-register-action": "Registrati",
        "donations-modal-title": "Cosa facciamo con le tue donazioni?",
        "donations-modal-desc": "Il tuo supporto ci consente di assumere più talenti, migliorare i nostri server e accelerare lo sviluppo di strumenti gratuiti per la comunità come Creative Engine. Ogni donazione viene investita direttamente nel miglioramento delle nostre tecnologie.",
        "privacy-modal-title": "Privacy",
        "privacy-modal-desc": "I tuoi dati sono al sicuro. Li utilizziamo solo per migliorare la tua esperienza sulla nostra piattaforma.",
        "license-modal-title": "Licenza",
        "license-modal-desc": "Tutti i nostri prodotti sono protetti dalle leggi internazionali sulla proprietà intellettuale."
    },
    ja: {
        welcome: "ようこそ、お越しいただきありがとうございます",
        "search-ph": "Carleyで検索...",
        "hero-desc": "自分のビデオゲームを開発したいと思ったことはありませんか？ 私たちは、すべてを簡単にする2Dビデオゲームエンジン「Creative Engine」をあなたのために設計しました。 ゲーム制作の経験があるかないかにかかわらず、Creative Engineはあなたのために作られています。 どんなアイデアでも、Creative Engineがそれを現実に変えるお手伝いをします。",
        "hero-cta": "制作を開始する",
        "carl-ia-desc": "現在開発中の当社のAI。 近い将来、あなたが必要なすべてのことをサポートできるようになります。 当社のモデルは完全なものになります。視覚を持ち、話し、テキストを生成し、聞くことができます。 私たちは、それが究極の統合的なパートナーとなるようトレーニングしています。",
        "learn-more": "詳細はこちら",
        "traspilador-desc": "開発者向けに設計。 ある言語から別の言語（例：JSからC++）へプロジェクトを変換できるコーディングモデル。 プロジェクトの移行を簡素化し、ワークフローを加速します。",
        "explore-docs": "ドキュメントを探索する",
        "footer-channels": "チャンネル",
        "footer-donations": "寄付",
        "footer-info": "情報",
        "footer-products": "当社の製品",
        "footer-donate-paypal": "PayPalで寄付する",
        "footer-donate-info": "寄付金は何に使われますか？",
        "footer-privacy": "プライバシーポリシー",
        "footer-license": "ライセンス",
        "footer-copyright": "© 2026 Carley Interactive Studio. All rights reserved.",
        "acc-modal-title": "マイアカウント",
        "field-email": "メールアドレス",
        "field-username": "ユーザー名",
        "btn-update": "プロフィールを更新",
        "btn-logout": "ログアウト",
        "modal-hint": "ログインしてプロジェクトを管理します。",
        "btn-login": "ログイン",
        "btn-register": "アカウントを作成",
        "login-title": "ログイン",
        "ph-email": "メールアドレス",
        "ph-pass": "パスワード",
        "ph-pass-confirm": "パスワードを認する",
        "btn-login-action": "ログイン",
        "register-title": "アカウントを作成",
        "btn-register-action": "登録",
        "donations-modal-title": "寄付金は何に使われますか？",
        "donations-modal-desc": "皆様のご支援により、より多くの人材を採用し、サーバーを改善し、Creative Engineのようなコミュニティ向けの無料ツールの開発を加速させることができます。 すべての寄付は、当社の技術向上のために直接投資されます。",
        "privacy-modal-title": "プライバシー",
        "privacy-modal-desc": "あなたのデータは安全です。 当社のプラットフォームでの体験を向上させるためにのみ使用します。",
        "license-modal-title": "ライセンス",
        "license-modal-desc": "当社のすべての製品は、国際的な知的財産法によって保護されています。"
    },
    sw: {
        welcome: "Karibu, tunafurahi kuwa nawe hapa",
        "search-ph": "Tafuta katika Carley...",
        "hero-desc": "Je, umewahi kufikiria kukuza mchezo wako wa video? Naam, tumekuandalia Creative Engine, injini ya mchezo wa video wa 2D inayofanya kila kitu kuwa rahisi. Haijalishi kama una uzoefu katika uundaji wa mchezo au la, Creative Engine imeundwa kwa ajili yako. Wazo lolote ulilonalo, Creative Engine inakusaidia kulifanya kuwa kweli.",
        "hero-cta": "Anza Kuunda",
        "carl-ia-desc": "AI yetu inayotengenezwa sasa. Hivi karibuni itapatikana ili kukusaidia kwa kila kitu unachohitaji. Mfano wetu utakuwa kamili: utakuwa na maono, uwezo wa kuzungumza, kutoa maandishi na kusikiliza. Tunaiandaa kuwa mshirika kamili wa mwisho.",
        "learn-more": "Jifunze zaidi",
        "traspilador-desc": "Imeundwa kwa ajili ya watengenezaji. Mfumo wa usimbaji wenye uwezo wa kubadilisha miradi kutoka lugha moja hadi nyingine (mfano: kutoka JS hadi C++). Rahisisha uhamishaji wa mradi wako na uongeze kasi ya utendaji wako.",
        "explore-docs": "Gundua nyaraka",
        "footer-channels": "Vituo",
        "footer-donations": "Michango",
        "footer-info": "Habari",
        "footer-products": "Bidhaa Zetu",
        "footer-donate-paypal": "Changia kwa PayPal",
        "footer-donate-info": "Tunafanya nini na michango yako?",
        "footer-privacy": "Sera ya Faragha",
        "footer-license": "Leseni",
        "footer-copyright": "© 2026 Carley Interactive Studio. Haki zote zimehifadhiwa.",
        "acc-modal-title": "Akaunti Yangu",
        "field-email": "Barua pepe",
        "field-username": "Jina la mtumiaji",
        "btn-update": "Sasisha Wasifu",
        "btn-logout": "Ondoka",
        "modal-hint": "Ingia ili kudhibiti miradi yako.",
        "btn-login": "Ingia",
        "btn-register": "Fungua Akaunti",
        "login-title": "Ingia",
        "ph-email": "Barua pepe",
        "ph-pass": "Nenosiri",
        "ph-pass-confirm": "Thibitisha Nenosiri",
        "btn-login-action": "Ingia",
        "register-title": "Fungua Akaunti",
        "btn-register-action": "Jisajili",
        "donations-modal-title": "Tunafanya nini na michango yako?",
        "donations-modal-desc": "Msaada wako unaturuhusu kuajiri vipaji zaidi, kuboresha seva zetu na kuharakisha uundaji wa zana za bure kwa jamii kama Creative Engine. Kila mchango huwekezwa moja kwa moja katika kuboresha teknolojia zetu.",
        "privacy-modal-title": "Faragha",
        "privacy-modal-desc": "Data yako iko salama. Tunaitumia tu kuboresha matumizi yako kwenye jukwaa letu.",
        "license-modal-title": "Leseni",
        "license-modal-desc": "Bidhaa zetu zote zinalindwa na sheria za kimataifa za mali miliki."
    }
};

function initializeTranslations() {
    const picker = document.getElementById('lang-picker');

    const updateTexts = (lang) => {
        const t = translations[lang] || translations['es'];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });

        localStorage.setItem('carley-lang', lang);
    };

    if (picker) picker.onchange = (e) => updateTexts(e.target.value);

    // Initial load
    const savedLang = localStorage.getItem('carley-lang') || 'es';
    if (picker) picker.value = savedLang;
    updateTexts(savedLang);

    window.translateAll = updateTexts;

    // Creative Engine Language Picker Sync
    const cePicker = document.getElementById('lang-picker-ce');
    if (cePicker) {
        cePicker.value = savedLang;
        cePicker.onchange = (e) => updateTexts(e.target.value);
    }
}

/* ==============================
   Donation System
============================== */
function initializeDonations() {
    const paypalLink = document.getElementById('paypal-link');
    if (paypalLink) {
        paypalLink.onclick = (e) => {
            e.preventDefault();
            window.open('https://www.paypal.com/donate/?hosted_button_id=JZ4KM2VUD6AMQ', '_blank');
        };
    }

    const infoTrigger = document.getElementById('info-donations-trigger');
    if (infoTrigger) {
        infoTrigger.onclick = (e) => {
            e.preventDefault();
            openStudioModal('modal-donations-info');
        };
    }
}

/* ==============================
   UI Helpers & Modals
============================== */
window.openStudioModal = function(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
};

window.closeStudioModal = function(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
};

window.showAuthForm = function(type) {
    closeStudioModal('modal-account');
    if (type === 'login') openStudioModal('modal-auth-login');
    else openStudioModal('modal-auth-register');
};

const modalOverlay = document.getElementById('modal-overlay');
if (modalOverlay) {
    modalOverlay.onclick = () => {
        document.querySelectorAll('.studio-modal').forEach(m => m.classList.add('hidden'));
        modalOverlay.classList.add('hidden');
    };
}

const accountTrigger = document.getElementById('account-trigger');
if (accountTrigger) {
    accountTrigger.onclick = () => {
        openStudioModal('modal-account');
    };
}

/* ==============================
   Animations & Transitions
============================== */
function initializeAnimations() {
    const reveals = document.querySelectorAll('.product-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.2 });

    reveals.forEach(r => observer.observe(r));
}
