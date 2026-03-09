/* ==============================
   Core Logic & Functional Systems
============================== */

// Security Helpers
window.escapeHTML = function(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// Supabase Global Client Initialization
{
    const SB_URL = 'https://tladrluezsmmhjbhupgb.supabase.co';
    const SB_KEY = 'sb_publishable_zb8TGeURLnafHWDffG9DMg_PtFO_kmv';
    if (typeof supabase !== 'undefined') {
        window.supabaseClient = supabase.createClient(SB_URL, SB_KEY);
    }
}

// Global File Upload Helper
window.uploadFile = async function(bucket, file, path) {
    if (!window.supabaseClient) return { error: { message: "Supabase not initialized" } };

    const { data, error } = await window.supabaseClient.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) return { error };

    const { data: { publicUrl } } = window.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return { publicUrl };
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeAuth();
    initializeSearch();
    initializeTranslations();
    initializeDonations();
    initializeAnimations();

    // Global data fetchers
    if (document.getElementById('opinions-feed')) fetchOpinions();
    if (window.location.pathname.includes('donaciones.html')) {
        fetchDonationStats();
        setupHubListeners();
    } else {
        fetchDonationStats(); // Still need stats for project pages progress bars
    }
});

/* ==============================
   Authentication System
============================== */
async function initializeAuth() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (session) {
        // Fetch real-time language and avatar from profile
        const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('language, avatar_url')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            if (profile.language) {
                localStorage.setItem('carley-lang', profile.language);
                if (window.translateAll) window.translateAll(profile.language);
            }
            if (profile.avatar_url) {
                // Update local session metadata for current display
                session.user.user_metadata.avatar_url = profile.avatar_url;
            }
        }
    }

    updateAuthStateUI(session);

    window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
        updateAuthStateUI(session);
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
            // Check language and avatar on sign in or update
            const { data: profile } = await window.supabaseClient
                .from('profiles')
                .select('language, avatar_url')
                .eq('id', session.user.id)
                .single();
            if (profile) {
                if (profile.language) localStorage.setItem('carley-lang', profile.language);
                if (profile.avatar_url) session.user.user_metadata.avatar_url = profile.avatar_url;

                if (event === 'SIGNED_IN') window.location.reload(); // Force reload only on initial sign in
                else updateAuthStateUI(session); // Just refresh UI on update
            }
        }
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
            window.location.reload(); // Reload to clear session states
        };
    }

    // Auth Submission Logic
    // Login handler on index.html (modal)
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

    // Update Header Icon across all pages
    const headerUserBtn = document.querySelector('.nav-controls .icon-btn i[data-lucide="user"]');
    if (headerUserBtn && session) {
        const meta = session.user.user_metadata;
        const avatarUrl = meta.avatar_url;
        if (avatarUrl) {
            const parent = headerUserBtn.parentElement;
            parent.innerHTML = `<img src="${avatarUrl}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2);">`;
        }
    }

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

window.openDonationFlow = function(app) {
    const modal = document.getElementById('donation-flow-modal');
    if (!modal) return;
    window.currentDonationApp = app;
    const targetName = document.getElementById('app-target-name');
    if (targetName) targetName.textContent = app === 'CE' ? 'Creative Engine' : 'Vid Spri';
    modal.classList.remove('hidden');
    renderPayPal();
};

window.closeDonationFlow = function() {
    const modal = document.getElementById('donation-flow-modal');
    if (modal) modal.classList.add('hidden');
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
};

window.renderPayPal = function() {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    if (!window.paypal) {
        container.innerHTML = '<p style="color: #ffaa00; font-size: 0.8rem;">Error: No se pudo cargar el módulo de PayPal. Verifica tu conexión o el Client ID.</p>';
        return;
    }

    const isJoinChecked = document.getElementById('join-donor-list')?.checked ?? true;
    const donorName = (window.currentUser && isJoinChecked)
        ? (window.currentUser.user_metadata.username || window.currentUser.email.split('@')[0])
        : 'Anónimo';

    window.paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'gold',
            shape:  'rect',
            label:  'paypal'
        },
        createOrder: (data, actions) => {
            const amountInput = document.getElementById('donation-amount');
            const amount = amountInput ? amountInput.value : '10.00';

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount,
                        currency_code: 'USD'
                    },
                    description: `Donación para ${window.currentDonationApp} de ${donorName}`,
                    custom_id: donorName // Simple ID for reporting
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(async details => {
                const capturedAmount = details.purchase_units[0].amount.value;
                const { error } = await window.supabaseClient.from('donations').insert({
                    donor_name: donorName,
                    amount: parseFloat(capturedAmount),
                    product_id: window.currentDonationApp,
                    paypal_order_id: details.id,
                    user_id: window.currentUser ? window.currentUser.id : null
                });

                if (error) {
                    console.error('Error saving donation:', error);
                    alert('¡Gracias! PayPal confirmó el pago, pero hubo un pequeño error al guardarlo en nuestra lista pública. No te preocupes, el dinero llegó correctamente.');
                } else {
                    alert('¡Donación exitosa! Gracias por tu apoyo a Carley Studio.');
                }

                closeDonationFlow();
                if (typeof fetchDonationStats === 'function') fetchDonationStats();
            });
        },
        onError: (err) => {
            console.error('PayPal Buttons Error:', err);
            alert('El sistema de pagos no pudo iniciarse. Asegúrate de que el monto sea válido.');
        }
    }).render('#paypal-button-container');
};

/* ==============================
   Search Engine Logic
============================== */
function initializeSearch() {
    const searchInput = document.getElementById('main-search');
    const dropdown = document.getElementById('search-dropdown');

    if (!searchInput || !dropdown) return;

    const searchMap = [
        { name: 'Creative Engine', id: 'info', url: 'creative-engine.html', keywords: ['motor', 'videojuegos', '2d', 'ia'], available: true },
        { name: 'Cómo crear tu primer juego', id: 'tutorials', url: 'creative-engine.html', keywords: ['tutorial', 'empezar', 'aprender', 'guia'], available: true },
        { name: 'Vid Spri', id: 'info', url: 'vid-spri.html', keywords: ['sprites', 'video', 'animacion', 'sonido'], available: true },
        { name: 'Creative Games', url: 'https://creativegame.online', keywords: ['juegos', 'web', 'jugar', 'online'], available: true },
        { name: 'Carl IA', keywords: ['inteligencia artificial', 'modelo', 'multimodal'], available: false },
        { name: 'Traspilador', keywords: ['modelo', 'codificación', 'traducción', 'c++'], available: false },
        { name: 'Donaciones', id: 'donations', keywords: ['apoyo', 'paypal', 'ayuda', 'ads', 'anuncio'], available: true },
        { name: 'Canales', id: 'footer-channels', keywords: ['redes', 'youtube', 'facebook', 'whatsapp', 'tiktok'], available: true }
    ];

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        const matches = searchMap.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.keywords.some(k => k.includes(query))
        );

        if (matches.length > 0) {
            const match = matches[0];
            navigateToResult(match);
        }
    };

    const navigateToResult = (match) => {
        if (match.url) {
            // Check if we are already on the target page
            const currentPath = window.location.pathname;
            if (currentPath.includes(match.url)) {
                if (match.id) {
                    const el = document.getElementById(match.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.location.href = match.id ? `${match.url}#${match.id}` : match.url;
            }
        } else {
            // If on home page, scroll. If not, go home then scroll.
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                const el = document.getElementById(match.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = `index.html#${match.id}`;
            }
        }
        dropdown.classList.add('hidden');
        searchInput.value = '';
    };

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
            const available = matches.filter(m => m.available);
            const notAvailable = matches.filter(m => !m.available);

            const addGroup = (items, labelKey) => {
                if (items.length === 0) return;
                const lang = localStorage.getItem('carley-lang') || 'es';
                const labelText = translations[lang][labelKey] || translations['es'][labelKey];

                const header = document.createElement('div');
                header.className = 'search-group-header';
                header.textContent = labelText;
                dropdown.appendChild(header);

                items.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    if (!match.available) div.classList.add('not-available');
                    div.textContent = match.name;
                    div.onclick = () => navigateToResult(match);
                    dropdown.appendChild(div);
                });
            };

            addGroup(available, 'footer-available');
            addGroup(notAvailable, 'footer-not-available');

            dropdown.classList.remove('hidden');
        } else {
            dropdown.classList.add('hidden');
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
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
        "creative-games-desc": "Juega sin tener que descargar nada, diviértete en la web. Juega todos los juegos hechos con Creative Engine, ya sea para PC, consola o móviles.",
        "btn-visit": "Visitar",
        "vidspri-home-desc": "Crea animaciones a partir de videos para tus juegos. Genera un video en cualquier página y nuestra herramienta te lo convierte en una hoja de sprites para tus videojuegos.",
        "carl-ia-desc": "Nuestra IA actualmente en desarrollo. Muy pronto estará disponible para ayudarte en todo lo que necesites. Nuestro modelo será completo: tendrá visión, podrá hablar, generar texto y escuchar. Lo estamos entrenando para que sea el compañero integral definitivo.",
        "learn-more": "Saber más",
        "traspilador-desc": "Diseñado para desarrolladores. Un modelo de codificación capaz de convertir proyectos de un lenguaje a otro (ejemplo: de JS a C++). Simplifica la migración de tus proyectos y acelera tu flujo de trabajo.",
        "explore-docs": "Explorar documentación",
        "btn-save": "Guardar Cambios",
        "btn-go-donate-page": "Ir a Donaciones",
        "btn-confirm-delete": "Eliminar Permanentemente",
        "footer-channels": "Canales",
        "footer-donations": "Donaciones",
        "footer-info": "Información",
        "footer-products": "Nuestros Productos",
        "footer-available": "Disponibles",
        "footer-not-available": "No Disponibles",
        "footer-donate-paypal": "Donar con PayPal",
        "footer-donate-info": "¿Qué hacemos con sus donaciones?",
        "footer-see-donors": "Ver donantes",
        "footer-see-collabs": "Colaboradores",
        "footer-privacy": "Política de Privacidad",
        "footer-license": "Licencia",
        "footer-copyright": "© 2026 Carley Interactive Studio. Todos los derechos reservados.",
        "acc-modal-title": "Mi Cuenta",
        "acc-page-title": "Bienvenido a Carley Studio",
        "btn-recovery": "Recuperar",
        "field-recovery-email": "Correo de Recuperación",
        "field-gender": "Sexo",
        "gender-m": "Masculino",
        "gender-f": "Femenino",
        "field-language": "Idioma",
        "acc-global-notice": "Esta cuenta le servirá para todos nuestros productos y app Carley.",
        "acc-terms-accept": "Acepto las condiciones y",
        "recovery-desc": "Introduce tu correo para recibir instrucciones de recuperación.",
        "btn-recovery-action": "Enviar Instrucciones",
        "btn-back-home": "Volver al Inicio",
        "acc-profile-title": "Mi Cuenta",
        "field-email": "Email",
        "field-username": "Nombre de Usuario",
        "field-pfp": "Foto de Perfil (URL .png/.jpg)",
        "field-usage": "Uso de la cuenta",
        "usage-personal": "Personal",
        "usage-edu": "Educativo",
        "usage-biz": "Pequeña Empresa",
        "field-institution": "Nombre de la escuela / estudio",
        "acc-change-pass": "Cambiar Contraseña",
        "acc-support-title": "Apoyo para todos",
        "acc-support-desc": "Mantenemos nuestras apps gratuitas gracias a la colaboración. El costo aumenta según los usuarios.",
        "btn-see-support": "Ver Colaboradores",
        "acc-delete-title": "Zona Peligrosa",
        "acc-delete-warning": "Esta acción es irreversible. Se borrarán todos tus datos.",
        "btn-delete-acc": "Borrar Cuenta",
        "btn-update": "Actualizar Perfil",
        "btn-logout": "Cerrar Sesión",
        "acc-personal-info": "Información Personal",
        "acc-support-simple-desc": "Nuestras aplicaciones son gratuitas gracias a tu apoyo.",
        "acc-100-free": "100% Gratuito",
        "btn-go-donate-page": "Ir a Donaciones",
        "support-ce": "Apoyar a Creative Engine",
        "support-vs": "Apoyar a Vid Spri",
        "claim-sad-msg": "Lamentamos mucho que haya tenido que llegar a este punto. Tratamos de hacer todo de la mejor forma para que todos puedan disfrutar.",
        "field-claim-photo": "Foto de confirmación de donación",
        "ph-claim-desc": "Explica el motivo...",
        "acc-delete-long-warning": "Esta acción es irreversible. Se enviará un correo de confirmación. Por favor, introduce tu contraseña para proceder.",
        "btn-confirm-delete": "Eliminar Permanentemente",
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
        "privacy-modal-title": "Privacidad y Condiciones de Uso",
        "privacy-modal-desc": "Su privacidad es nuestra prioridad. No compartimos sus datos con terceros ni los vendemos. Esta cuenta única le servirá para acceder a todos los productos y aplicaciones de Carley Interactive Studio. El usuario es el único responsable de la seguridad de su cuenta y de los datos que decida compartir con terceros. Ofrecemos soporte integral para la recuperación de cuentas y resolución de problemas de acceso. Al usar nuestros servicios, usted acepta que Carley no es responsable por el uso indebido de la cuenta por parte del usuario mismo.",
        "license-modal-title": "Licencia",
        "license-modal-desc": "Todos nuestros productos están bajo la licencia de Carley Interactive Studio. Los usuarios tienen derecho a usar nuestras herramientas para crear contenido, pero la propiedad intelectual del software original pertenece a Carley.",
        // Creative Engine
        "ce-nav-info": "Información",
        "ce-nav-report": "Reportar",
        "ce-nav-opinions": "Opiniones",
        "ce-nav-license": "Licencia",
        "ce-nav-privacy": "Privacidad",
        "ce-nav-join": "Únete y Seguirnos",
        "ce-nav-claims": "Reclamos",
        "ce-nav-donations": "Donaciones",
        "ce-nav-collabs": "Colaboradores",
        "ce-nav-tutorials": "Tutoriales",
        "ce-tutorial-title": "Cómo crear tu primer juego",
        "ce-tutorial-desc": "Aprende los fundamentos de Creative Engine y empieza tu aventura como desarrollador.",
        "ce-donate-intro": "Tu apoyo es lo que mantiene este proyecto vivo y gratuito para todos. Con total transparencia, te compartimos que mantener Creative Engine requiere cubrir costos de servidores y desarrollo para que siga siendo una herramienta accesible para todos sin barreras económicas. Sus donaciones ayudarán a que otros usen nuestras herramientas gratuitamente.",
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
        "credits-gemini": "Finalmente, agradecemos a Google AI Studio por su generoso plan y a su modelo de Gemini para el uso gratuito de Carl IA.",
        // Vid Spri
        "vs-nav-tutorials": "Tutoriales",
        "vs-donate-intro": "Tu apoyo es lo que permite que Vid Spri siga siendo una herramienta gratuita y de libre acceso. Queremos que cada creador tenga las mejores herramientas sin importar su presupuesto, y por ello mantenemos una total transparencia sobre los costos de servidores necesarios para que la IA funcione para ti. Sus donaciones ayudarán a que otros usen nuestras herramientas gratuitamente.",
        "vs-info-1": "VidSpri fue creado pensando en los desarrolladores novatos o aquellos que quieren crear sus videojuegos 2D pero que no tienen experiencia dibujando cada fotograma.",
        "vs-info-2": "A muchos les ha ocurrido acudir a la IA para generar fotogramas para sus personajes, pero la IA tampoco puede hacer bien este trabajo; no sabe cómo hacerlo hasta que nos dimos cuenta de que la IA, al generar video, lo hace mucho mejor que cuando genera una simple imagen con varios sprites.",
        "vs-info-3": "Se nos ocurrió hacer una herramienta que convierte videos a hojas de sprites. Nuestra herramienta saca fotogramas de videos y los convierte en una hoja de sprites o genera un video para sacarle fotogramas, logrando un mejor resultado.",
        "vs-info-4": "Para hacerlo más completo, hemos hecho que pueda generar sonido para tus videojuegos.",
        "vs-credits-main": "Créditos Desarrollo y Asistencia VidSpri es un proyecto de Carley Interactive Studio. Este proyecto fue desarrollado con la asistencia de Jules, un ingeniero de software de IA de Google. Agradecemos a Google por proporcionar acceso a esta increíble herramienta que hizo posible acelerar y mejorar nuestro proceso de desarrollo.",
        "vs-credits-hf": "Agradecimientos Especiales Queremos extender un agradecimiento especial a Hugging Face por proporcionar el alojamiento gratuito para nuestros servidores a través de su plataforma Spaces. Su apoyo a la comunidad de código abierto es lo que permite que herramientas como VidSpri estén disponibles para todos de forma gratuita.",
        "vs-credits-os": "Tecnologías y Librerías de Código Abierto Esta aplicación no sería posible sin el increíble trabajo de la comunidad de código abierto. Agradecemos a los desarrolladores y mantenedores de las siguientes tecnologías y librerías:",
        "donate-big-title": "Tu apoyo vale mucho",
        "donate-intro-msg": "Estás aportando a que otros puedan usar nuestra app y motor de forma gratuita.",
        "transparency-title": "Nuestra Misión",
        "transparency-desc-long": "Queremos que VidSpri sea gratuito para todos, sin modelos freemium ni premium. Queremos que todos tengan el mismo acceso a todas las herramientas para crear animaciones y música. Creative Engine ya es gratuito, y queremos que Carl IA también lo sea, completamente integrado. Para mantener esto, necesitamos cubrir costos de servidores de Hugging Face y Supabase.",
        "support-action-title": "Apoyar proyecto",
        "vs-tutorial-title": "Tutoriales",
        "vs-tutorial-desc": "Aprende a usar Vid Spri para tus proyectos.",
        "vs-donate-1": "No necesitas ser un desarrollador para aportar a nuestro proyecto. Tu apoyo monetario nos ayudará a contratar desarrolladores y pagar servidores para hacer de Vid Spri una herramienta muy útil y gratis.",
        "vs-os-python-desc": "El lenguaje de programación que impulsa todo nuestro backend.",
        "vs-os-docker-desc": "La plataforma de contenedores que nos permite desplegar el servidor de forma fiable.",
        "vs-os-fastapi-desc": "Un moderno y rápido framework web para construir nuestras APIs.",
        "vs-os-uvicorn-desc": "Un servidor ASGI ultrarrápido, utilizado para ejecutar la aplicación de backend.",
        "vs-os-rembg-desc": "La potente librería utilizada para eliminar el fondo de las imágenes de forma inteligente.",
        "vs-os-pillow-desc": "Una librería fundamental para la manipulación de imágenes en Python.",
        "vs-os-onnx-desc": "El motor de inferencia de alto rendimiento que potencia el modelo de rembg.",
        "vs-os-multipart-desc": "Librería esencial para la gestión de subida de archivos en el servidor.",
        "vs-os-sqlite-desc": "El motor de base de datos utilizado para gestionar la cola de procesamiento y los códigos de prioridad.",
        "vs-os-translate-desc": "El servicio que potencia la funcionalidad de traducción en la aplicación.",
        "vs-os-feather-desc": "La librería de iconos de código abierto que proporciona los iconos de la interfaz de usuario.",
        "vs-os-crop-desc": "Una librería de JavaScript para la funcionalidad de recorte de imágenes en el frontend.",
        "acc-100-free": "100% Gratuito",
        "acc-personal-info": "Información Personal",
        "acc-support-simple-desc": "Nuestras aplicaciones son gratuitas gracias a tu apoyo.",
        "support-ce": "Soporte Creative Engine",
        "support-vs": "Soporte Vid Spri",
        "claim-sad-msg": "Lamentamos mucho que haya tenido que llegar a este punto. Tratamos de hacer todo de la mejor forma para que todos puedan disfrutar.",
        "field-claim-photo": "Foto de confirmación de donación",
        "ph-claim-desc": "Explica el motivo...",
        "acc-delete-long-warning": "Esta acción es irreversible. Se enviará un correo de confirmación. Por favor, introduce tu contraseña para proceder.",
        "btn-confirm-delete": "Eliminar Permanentemente",
        "btn-go-donate-page": "Ir a Donaciones",
        "support-title": "Apoyo para todos",
        "support-intro": "Transparencia absoluta. Aquí puedes ver cómo las apps de Carley se mantienen gratuitas para el mundo.",
        "stat-total-users": "Usuarios Totales",
        "stat-monthly-goal": "Meta Mensual",
        "stat-collected-label": "Recaudado",
        "list-title": "Nuestros Colaboradores",
        "col-name": "Nombre",
        "col-amount": "Aportación",
        "empty-supporters": "Aún no hay aportaciones registradas este mes. ¡Sé el primero!",
        "support-how-to": "¿Quieres aparecer aquí? Apóyanos mediante PayPal en la sección de donaciones de nuestras apps.",
        "btn-go-donate": "Ir a Donar"
    },
    en: {
        welcome: "Welcome, we're glad to have you here",
        "privacy-modal-title": "Privacy and Terms of Use",
        "privacy-modal-desc": "Your privacy is our priority. We do not share your data with third parties or sell it. This unique account will allow you to access all Carley Interactive Studio products and apps. The user is solely responsible for the security of their account and any data they choose to share with third parties. We offer full support for account recovery and access issues. By using our services, you agree that Carley is not responsible for any misuse of the account by the user.",
        "search-ph": "Search in Carley...",
        "hero-desc": "Have you ever thought about developing your own video game? Well, we have designed Creative Engine for you, a 2D video game engine that makes everything easy. Whether you have experience in game creation or not, Creative Engine is made for you. Any idea you have, Creative Engine helps you turn it into reality.",
        "hero-cta": "Start Creating",
        "hero-more": "Learn more",
        "creative-games-desc": "Play without downloading anything, have fun on the web. Play all games made with Creative Engine, whether for PC, console, or mobile.",
        "btn-visit": "Visit",
        "vidspri-home-desc": "Create animations from videos for your games. Generate a video on any page and our tool converts it into a sprite sheet for your video games.",
        "carl-ia-desc": "Our AI currently under development. Very soon it will be available to help you with everything you need. Our model will be complete: it will have vision, be able to speak, generate text, and listen. We are training it to be the ultimate integral companion.",
        "learn-more": "Learn more",
        "traspilador-desc": "Designed for developers. A coding model capable of converting projects from one language to another (example: from JS to C++). Simplify your project migration and speed up your workflow.",
        "explore-docs": "Explore documentation",
        "btn-save": "Save Changes",
        "btn-go-donate-page": "Go to Donations",
        "btn-confirm-delete": "Permanently Delete",
        "footer-channels": "Channels",
        "footer-donations": "Donations",
        "footer-info": "Information",
        "footer-products": "Our Products",
        "footer-available": "Available",
        "footer-not-available": "Not Available",
        "footer-donate-paypal": "Donate with PayPal",
        "footer-donate-info": "What do we do with your donations?",
        "footer-see-donors": "See donors",
        "footer-see-collabs": "Collaborators",
        "footer-privacy": "Privacy Policy",
        "footer-license": "License",
        "footer-copyright": "© 2026 Carley Interactive Studio. All rights reserved.",
        "acc-modal-title": "My Account",
        "acc-page-title": "Welcome to Carley Studio",
        "btn-recovery": "Recover",
        "field-recovery-email": "Recovery Email",
        "field-gender": "Gender",
        "gender-m": "Male",
        "gender-f": "Female",
        "field-language": "Language",
        "acc-global-notice": "This account will serve you for all our products and Carley apps.",
        "acc-terms-accept": "I accept the conditions and",
        "recovery-desc": "Enter your email to receive recovery instructions.",
        "btn-recovery-action": "Send Instructions",
        "btn-back-home": "Back to Home",
        "acc-profile-title": "My Account",
        "field-email": "Email",
        "field-username": "Username",
        "field-pfp": "Profile Picture (URL .png/.jpg)",
        "field-usage": "Account usage",
        "usage-personal": "Personal",
        "usage-edu": "Educational",
        "usage-biz": "Small Business",
        "field-institution": "School / Studio name",
        "acc-change-pass": "Change Password",
        "acc-support-title": "Support for everyone",
        "acc-support-desc": "We keep our apps free thanks to collaboration. Cost increases with users.",
        "btn-see-support": "See Contributors",
        "acc-delete-title": "Danger Zone",
        "acc-delete-warning": "This action is irreversible. All your data will be deleted.",
        "btn-delete-acc": "Delete Account",
        "btn-update": "Update Profile",
        "btn-logout": "Log Out",
        "acc-personal-info": "Personal Information",
        "acc-support-simple-desc": "Our applications are free thanks to your support.",
        "acc-100-free": "100% Free",
        "btn-go-donate-page": "Go to Donations",
        "support-ce": "Support Creative Engine",
        "support-vs": "Support Vid Spri",
        "claim-sad-msg": "We are very sorry that it has come to this. We try to do everything in the best way so that everyone can enjoy.",
        "field-claim-photo": "Donation confirmation photo",
        "ph-claim-desc": "Explain the reason...",
        "acc-delete-long-warning": "This action is irreversible. A confirmation email will be sent. Please enter your password to proceed.",
        "btn-confirm-delete": "Permanently Delete",
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
        "ce-nav-collabs": "Collaborators",
        "ce-nav-tutorials": "Tutoriales",
        "ce-tutorial-title": "How to create your first game",
        "ce-tutorial-desc": "Learn the fundamentals of Creative Engine and start your adventure as a developer.",
        "ce-donate-intro": "Your support is what keeps this project alive and free for everyone. With total transparency, we share that maintaining Creative Engine requires covering server and development costs so that it remains an accessible tool for everyone without economic barriers. Your donations will help others use our tools for free.",
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
        "credits-gemini": "Finally, we thank Google AI Studio for their generous plan and their Gemini model for the free use of Carl IA.",
        // Vid Spri
        "vs-nav-tutorials": "Tutorials",
        "vs-donate-intro": "Your support is what allows Vid Spri to remain a free and open access tool. We want every creator to have the best tools regardless of their budget, and therefore we maintain total transparency about the server costs necessary for the AI to work for you. Your donations will help others use our tools for free.",
        "vs-info-1": "VidSpri was created with novice developers in mind or those who want to create their 2D video games but have no experience drawing each frame.",
        "vs-info-2": "Many have turned to AI to generate frames for their characters, but AI can't do this job well either; it doesn't know how to do it until we realized that AI, when generating video, does it much better than when it generates a simple image with several sprites.",
        "vs-info-3": "We came up with the idea of making a tool that converts videos to sprite sheets. Our tool takes frames from videos and converts them into a sprite sheet or generates a video to take frames from it, achieving a better result.",
        "vs-info-4": "To make it more complete, we've made it possible to generate sound for your video games.",
        "vs-credits-main": "VidSpri Development and Assistance Credits is a project of Carley Interactive Studio. This project was developed with the assistance of Jules, a Google AI software engineer. We thank Google for providing access to this incredible tool that made it possible to accelerate and improve our development process.",
        "vs-credits-hf": "Special Thanks We want to extend a special thanks to Hugging Face for providing free hosting for our servers through their Spaces platform. Their support for the open-source community is what allows tools like VidSpri to be available to everyone for free.",
        "vs-credits-os": "Open Source Technologies and Libraries This application would not be possible without the incredible work of the open-source community. We thank the developers and maintainers of the following technologies and libraries:",
        "donate-big-title": "Your support is worth a lot",
        "donate-intro-msg": "You are contributing so that others can use our app and engine for free.",
        "transparency-title": "Our Mission",
        "transparency-desc-long": "We want VidSpri to be free for everyone, without freemium or premium models. We want everyone to have the same access to all tools to create animations and music. Creative Engine is already free, and we want Carl IA to be too, fully integrated. To maintain this, we need to cover server costs for Hugging Face and Supabase.",
        "support-action-title": "Support project",
        "vs-tutorial-title": "Tutorials",
        "vs-tutorial-desc": "Learn how to use Vid Spri for your projects.",
        "vs-donate-1": "You don't need to be a developer to contribute to our project. Your monetary support will help us hire developers and pay for servers to make Vid Spri a very useful and free tool.",
        "vs-os-python-desc": "The programming language that powers our entire backend.",
        "vs-os-docker-desc": "The container platform that allows us to deploy the server reliably.",
        "vs-os-fastapi-desc": "A modern, fast web framework for building our APIs.",
        "vs-os-uvicorn-desc": "An ultra-fast ASGI server, used to run the backend application.",
        "vs-os-rembg-desc": "The powerful library used to intelligently remove background from images.",
        "vs-os-pillow-desc": "A fundamental library for image manipulation in Python.",
        "vs-os-onnx-desc": "The high-performance inference engine that powers the rembg model.",
        "vs-os-multipart-desc": "Essential library for file upload management on the server.",
        "vs-os-sqlite-desc": "The database engine used to manage the processing queue and priority codes.",
        "vs-os-translate-desc": "The service that powers the translation functionality in the application.",
        "vs-os-feather-desc": "The open-source icon library that provides the user interface icons.",
        "vs-os-crop-desc": "A JavaScript library for image cropping functionality on the frontend.",
        "acc-100-free": "100% Free",
        "acc-personal-info": "Personal Information",
        "acc-support-simple-desc": "Our applications are free thanks to your support.",
        "support-ce": "Creative Engine Support",
        "support-vs": "Vid Spri Support",
        "claim-sad-msg": "We are very sorry that it has come to this. We try to do everything in the best way so that everyone can enjoy.",
        "field-claim-photo": "Donation confirmation photo",
        "ph-claim-desc": "Explain the reason...",
        "acc-delete-long-warning": "This action is irreversible. A confirmation email will be sent. Please enter your password to proceed.",
        "btn-confirm-delete": "Permanently Delete",
        "btn-go-donate-page": "Go to Donations",
        "support-title": "Support for everyone",
        "support-intro": "Absolute transparency. Here you can see how Carley apps stay free for the world.",
        "stat-total-users": "Total Users",
        "stat-monthly-goal": "Monthly Goal",
        "stat-collected-label": "Collected",
        "list-title": "Our Contributors",
        "col-name": "Name",
        "col-amount": "Contribution",
        "empty-supporters": "No contributions recorded this month yet. Be the first!",
        "support-how-to": "Want to appear here? Support us via PayPal in the donations section of our apps.",
        "btn-go-donate": "Go to Donate"
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
        "license-modal-desc": "Tous nos produits sont protégés par les lois internationales sur la propriété intellectuelle.",
        // Vid Spri (FR)
        "vs-nav-tutorials": "Tutoriels",
        "vs-info-1": "VidSpri a été créé pour les développeurs débutants ou ceux qui souhaitent créer leurs jeux vidéo 2D mais n'ont aucune expérience dans le dessin de chaque image.",
        "vs-info-2": "Beaucoup se sont tournés vers l'IA pour générer des images pour leurs personnages, mais l'IA ne peut pas non plus bien faire ce travail ; elle ne sait pas comment s'y prendre jusqu'à ce que nous réalisions que l'IA, lorsqu'elle génère de la vidéo, le fait bien mieux que lorsqu'elle génère une simple image avec plusieurs sprites.",
        "vs-info-3": "Nous avons eu l'idée de créer un outil qui convertit des vidéos en feuilles de sprites. Notre outil extrait des images de vidéos et les convertit en une feuille de sprites ou génère une vidéo pour en extraire des images, obtenant ainsi un meilleur résultat.",
        "vs-info-4": "Pour le rendre plus complet, nous avons permis de générer du son pour vos jeux vidéo.",
        "vs-credits-main": "Crédits de Développement et d'Assistance VidSpri est un projet de Carley Interactive Studio. Ce projet a été développé avec l'assistance de Jules, un ingénieur logiciel IA de Google.",
        "vs-credits-hf": "Remerciements spéciaux à Hugging Face pour l'hébergement gratuit de nos serveurs via Spaces.",
        "vs-credits-os": "Technologies et Bibliothèques Open Source",
        "vs-tutorial-title": "Tutoriels",
        "vs-tutorial-desc": "Apprenez à utiliser Vid Spri pour vos projets.",
        "vs-donate-1": "Votre soutien monétaire nous aidera à embaucher des développeurs et à payer des serveurs pour faire de Vid Spri un outil gratuit.",
        "vs-os-python-desc": "Le langage de programmation qui propulse tout notre backend.",
        "vs-os-docker-desc": "La plateforme de conteneurs pour déployer le serveur de manière fiable.",
        "vs-os-fastapi-desc": "Un framework web moderne et rapide pour construire nos API.",
        "vs-os-uvicorn-desc": "Un serveur ASGI ultra-rapide utilisé pour exécuter l'application backend.",
        "vs-os-rembg-desc": "Bibliothèque puissante pour supprimer intelligemment l'arrière-plan des images.",
        "vs-os-pillow-desc": "Bibliothèque fondamentale pour la manipulation d'images en Python.",
        "vs-os-onnx-desc": "Moteur d'inférence haute performance pour le modèle rembg.",
        "vs-os-multipart-desc": "Essentiel pour la gestion des téléchargements de fichiers sur le serveur.",
        "vs-os-sqlite-desc": "Moteur de base de données pour gérer la file d'attente et les codes de priorité.",
        "vs-os-translate-desc": "Service qui alimente la fonctionnalité de traduction.",
        "vs-os-feather-desc": "Bibliothèque d'icônes open source pour l'interface utilisateur.",
        "vs-os-crop-desc": "Bibliothèque JavaScript pour le recadrage d'images sur le frontend."
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
        "license-modal-desc": "Todos os nossos produtos são protegidos por leis de propriedade intelectual internacionais.",
        // Vid Spri (PT)
        "vs-nav-tutorials": "Tutoriais",
        "vs-info-1": "O VidSpri foi criado pensando nos desenvolvedores novatos ou naqueles que querem criar seus jogos 2D mas não têm experiência desenhando cada quadro.",
        "vs-info-2": "Muitos recorreram à IA para gerar quadros para seus personagens, mas a IA também não consegue fazer bem este trabalho; ela não sabe como fazê-lo até que percebemos que a IA, ao gerar vídeo, faz muito melhor do que quando gera uma simples imagem com vários sprites.",
        "vs-info-3": "Tivemos a ideia de criar uma ferramenta que converte vídeos em folhas de sprites. Nossa ferramenta extrai quadros de vídeos e os converte em uma folha de sprites ou gera um vídeo para extrair quadros, conseguindo um melhor resultado.",
        "vs-info-4": "Para torná-lo mais completo, permitimos que ele gere som para seus jogos.",
        "vs-credits-main": "Créditos de Desenvolvimento e Assistência VidSpri é um projeto da Carley Interactive Studio. Este projeto foi desenvolvido com a assistência de Jules, um engenheiro de software de IA do Google.",
        "vs-credits-hf": "Agradecimentos Especiais à Hugging Face por fornecer hospedagem gratuita para nossos servidores através do Spaces.",
        "vs-credits-os": "Tecnologias e Bibliotecas de Código Aberto",
        "vs-tutorial-title": "Tutoriais",
        "vs-tutorial-desc": "Aprenda a usar o Vid Spri para seus projetos.",
        "vs-donate-1": "Seu apoio monetário nos ajudará a contratar desenvolvedores e pagar servidores para tornar o Vid Spri uma ferramenta gratuita.",
        "vs-os-python-desc": "A linguagem de programação que impulsiona todo o nosso backend.",
        "vs-os-docker-desc": "A plataforma de contêineres que nos permite implantar o servidor de forma confiável.",
        "vs-os-fastapi-desc": "Um framework web moderno e rápido para construir nossas APIs.",
        "vs-os-uvicorn-desc": "Um servidor ASGI ultrarrápido usado para executar o backend.",
        "vs-os-rembg-desc": "Poderosa biblioteca usada para remover o fundo das imagens de forma inteligente.",
        "vs-os-pillow-desc": "Biblioteca fundamental para manipulação de imagens em Python.",
        "vs-os-onnx-desc": "Motor de inferência de alto desempenho que alimenta o modelo rembg.",
        "vs-os-multipart-desc": "Biblioteca essencial para gestão de upload de arquivos no servidor.",
        "vs-os-sqlite-desc": "Motor de banco de dados usado para gerir a fila de processamento.",
        "vs-os-translate-desc": "O serviço que impulsiona a funcionalidade de tradução.",
        "vs-os-feather-desc": "Biblioteca de ícones de código aberto para a interface do usuário.",
        "vs-os-crop-desc": "Biblioteca JavaScript para funcionalidade de recorte de imagens no frontend."
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
        "license-modal-desc": "Все наши продукты защищены международными законами об интеллектуальной собственности.",
        // Vid Spri (RU)
        "vs-nav-tutorials": "Обучение",
        "vs-info-1": "VidSpri был создан для начинающих разработчиков или тех, кто хочет создавать свои 2D-видеоигры, но не имеет опыта рисования каждого кадра.",
        "vs-info-2": "Многие обращались к ИИ для создания кадров персонажей, но ИИ тоже не может хорошо справиться с этой задачей; он не знает, как это сделать, пока мы не поняли, что ИИ при генерации видео делает это гораздо лучше, чем при генерации простого изображения с несколькими спрайтами.",
        "vs-info-3": "Нам пришла в голову идея создать инструмент, который преобразует видео в листы спрайтов. Наш инструмент извлекает кадры из видео и преобразует их в лист спрайтов или генерирует видео для извлечения кадров, достигая лучшего результата.",
        "vs-info-4": "Чтобы сделать его более полным, мы добавили возможность генерации звука для ваших видеоигр.",
        "vs-credits-main": "Кредиты на разработку и помощь VidSpri — это проект Carley Interactive Studio. Этот проект был разработан при содействии Джулса, инженера-программиста Google по ИИ.",
        "vs-credits-hf": "Особая благодарность Hugging Face за бесплатный хостинг наших серверов через Spaces.",
        "vs-credits-os": "Технологии и библиотеки с открытым исходным кодом",
        "vs-tutorial-title": "Обучение",
        "vs-tutorial-desc": "Узнайте, как использовать Vid Spri для ваших проектов.",
        "vs-donate-1": "Ваша денежная поддержка поможет нам нанять разработчиков и оплатить серверы, чтобы сделать Vid Spri бесплатным инструментом.",
        "vs-os-python-desc": "Язык программирования, на котором работает весь наш бэкенд.",
        "vs-os-docker-desc": "Платформа контейнеров, позволяющая надежно развертывать сервер.",
        "vs-os-fastapi-desc": "Современный и быстрый веб-фреймворк для создания наших API.",
        "vs-os-uvicorn-desc": "Сверхбыстрый сервер ASGI, используемый для запуска бэкенд-приложения.",
        "vs-os-rembg-desc": "Мощная библиотека для интеллектуального удаления фона с изображений.",
        "vs-os-pillow-desc": "Фундаментальная библиотека для обработки изображений на Python.",
        "vs-os-onnx-desc": "Высокопроизводительный движок логического вывода для модели rembg.",
        "vs-os-multipart-desc": "Библиотека для управления загрузкой файлов на сервер.",
        "vs-os-sqlite-desc": "Движок базы данных для управления очередью обработки.",
        "vs-os-translate-desc": "Сервис, обеспечивающий функцию перевода в приложении.",
        "vs-os-feather-desc": "Библиотека значков с открытым исходным кодом для пользовательского интерфейса.",
        "vs-os-crop-desc": "Библиотека JavaScript для обрезки изображений на фронтенде."
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
        "license-modal-desc": "我们的所有产品均受国际知识产权法保护。",
        // Vid Spri (ZH)
        "vs-nav-tutorials": "教程",
        "vs-info-1": "VidSpri 是为新手开发人员或想要创建 2D 视频游戏但没有绘制每一帧经验的人创建的。",
        "vs-info-2": "许多人求助于 AI 来为他们的角色生成帧，但 AI 也无法很好地完成这项工作； 它不知道如何去做，直到我们意识到 AI 在生成视频时，比生成包含多个精灵的简单图像时表现得更好。",
        "vs-info-3": "我们萌生了制作一个将视频转换为精灵表的工具的想法。 我们的工具从视频中提取帧并将其转换为精灵表，或者生成视频从中提取帧，从而获得更好的结果。",
        "vs-info-4": "为了使其更完整，我们使其能够为您的视频游戏生成声音。",
        "vs-credits-main": "VidSpri 开发和协助致谢是 Carley Interactive Studio 的一个项目。 该项目是在 Google AI 软件工程师 Jules 的协助下开发的。",
        "vs-credits-hf": "特别感谢 Hugging Face 通过其 Spaces 平台为我们的服务器提供免费托管。",
        "vs-credits-os": "开源技术和库",
        "vs-tutorial-title": "教程",
        "vs-tutorial-desc": "了解如何将 Vid Spri 用于您的项目。",
        "vs-donate-1": "您的资金支持将帮助我们聘请开发人员并支付服务器费用，使 Vid Spri 成为一个免费工具。",
        "vs-os-python-desc": "驱动我们整个后端的编程语言。",
        "vs-os-docker-desc": "允许我们可靠地部署服务器的容器平台。",
        "vs-os-fastapi-desc": "用于构建 API 的现代、快速的 Web 框架。",
        "vs-os-uvicorn-desc": "用于运行后端应用程序的超快速 ASGI 服务器。",
        "vs-os-rembg-desc": "用于智能删除图像背景的强大库。",
        "vs-os-pillow-desc": "Python 中用于图像处理的基础库。",
        "vs-os-onnx-desc": "驱动 rembg 模型的高性能推理引擎。",
        "vs-os-multipart-desc": "用于服务器上文件上传管理的必备库。",
        "vs-os-sqlite-desc": "用于管理处理队列的数据库引擎。",
        "vs-os-translate-desc": "为应用程序中的翻译功能提供支持的服务。",
        "vs-os-feather-desc": "提供用户界面图标的开源图标库。",
        "vs-os-crop-desc": "用于前端图像裁剪功能的 JavaScript 库。"
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
        "license-modal-desc": "Tutti i nostri prodotti sono protetti dalle leggi internazionali sulla proprietà intellettuale.",
        // Vid Spri (IT)
        "vs-nav-tutorials": "Tutorial",
        "vs-info-1": "VidSpri è stato creato pensando agli sviluppatori principianti o a coloro che vogliono creare i propri videogiochi 2D ma non hanno esperienza nel disegnare ogni singolo fotogramma.",
        "vs-info-2": "Molti si sono rivolti all'IA per generare fotogrammi per i propri personaggi, ma l'IA non riesce a fare bene questo lavoro; non sa come farlo finché non ci siamo resi conto che l'IA, quando genera video, lo fa molto meglio di quando genera una semplice immagine con diversi sprite.",
        "vs-info-3": "Ci è venuta l'idea di creare uno strumento che converte i video in fogli di sprite. Il nostro strumento estrae i fotogrammi dai video e li converte in un foglio di sprite o genera un video per estrarne i fotogrammi, ottenendo un risultato migliore.",
        "vs-info-4": "Per renderlo più completo, abbiamo fatto in modo che possa generare suoni per i tuoi videogiochi.",
        "vs-credits-main": "Crediti per lo Sviluppo e l'Assistenza VidSpri è un progetto di Carley Interactive Studio. Questo progetto è stato sviluppato con l'assistenza di Jules, un ingegnere software AI di Google.",
        "vs-credits-hf": "Ringraziamenti speciali a Hugging Face per aver fornito l'hosting gratuito per i nostri server tramite la piattaforma Spaces.",
        "vs-credits-os": "Tecnologie e librerie open source",
        "vs-tutorial-title": "Tutorial",
        "vs-tutorial-desc": "Scopri come usare Vid Spri per i tuoi progetti.",
        "vs-donate-1": "Il tuo supporto monetario ci aiuterà a assumere sviluppatori e a pagare i server per rendere Vid Spri uno strumento gratuito.",
        "vs-os-python-desc": "Il linguaggio di programmazione che alimenta tutto il nostro backend.",
        "vs-os-docker-desc": "La piattaforma di container che ci permette di distribuire il server in modo affidabile.",
        "vs-os-fastapi-desc": "Un framework web moderno e veloce per costruire le nostre API.",
        "vs-os-uvicorn-desc": "Un server ASGI ultraveloce, usato per eseguire l'applicazione backend.",
        "vs-os-rembg-desc": "La potente libreria usata per rimuovere lo sfondo dalle immagini in modo intelligente.",
        "vs-os-pillow-desc": "Una libreria fondamentale per la manipolazione delle immagini in Python.",
        "vs-os-onnx-desc": "Il motore di inferenza ad alte prestazioni che alimenta il modello rembg.",
        "vs-os-multipart-desc": "Libreria essenziale per la gestione del caricamento dei file sul server.",
        "vs-os-sqlite-desc": "Il motore di database usato per gestire la coda di elaborazione.",
        "vs-os-translate-desc": "Il servizio che alimenta la funzionalità di traduzione nell'applicazione.",
        "vs-os-feather-desc": "La libreria di icone open source che fornisce le icone dell'interfaccia utente.",
        "vs-os-crop-desc": "Una libreria JavaScript per la funzionalità di ritaglio delle immagini sul frontend."
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
        "license-modal-desc": "当社のすべての製品は、国際的な知的財産法によって保護されています。",
        // Vid Spri (JA)
        "vs-nav-tutorials": "チュートリアル",
        "vs-info-1": "VidSpriは、初心者開発者や、2Dビデオゲームを作成したいが各フレームを描く経験がない人を対象に作成されました。",
        "vs-info-2": "多くの人がキャラクターのフレームを生成するためにAIに頼ってきましたが、AIもこの仕事をうまくこなすことができません。AIが動画を生成するとき、複数のスプライトを含む単純な画像を生成するときよりもはるかにうまくいくことに気づくまで、その方法はわかりませんでした。",
        "vs-info-3": "動画をスプライトシートに変換するツールを作るというアイデアを思いつきました。私たちのツールは動画からフレームを抽出し、それをスプライトシートに変換したり、フレームを抽出するための動画を生成したりして、より良い結果を実現します。",
        "vs-info-4": "より完璧にするために、ビデオゲーム用のサウンドを生成できるようにしました。",
        "vs-credits-main": "VidSpriの開発および支援のクレジットは、Carley Interactive Studioのプロジェクトです。このプロジェクトは、GoogleのAIソフトウェアエンジニアであるJulesの支援を受けて開発されました。",
        "vs-credits-hf": "Spacesプラットフォームを通じてサーバーに無料のホスティングを提供してくれたHugging Faceに感謝します。",
        "vs-credits-os": "オープンソース技術とライブラリ",
        "vs-tutorial-title": "チュートリアル",
        "vs-tutorial-desc": "プロジェクトでVid Spriを使用する方法を学びます。",
        "vs-donate-1": "皆様の資金援助は、開発者を雇用し、Vid Spriを無料のツールにするためのサーバー費用を支払うのに役立ちます。",
        "vs-os-python-desc": "バックエンド全体を動かすプログラミング言語。",
        "vs-os-docker-desc": "サーバーを確実にデプロイできるようにするコンテナプラットフォーム。",
        "vs-os-fastapi-desc": "APIを構築するためのモダンで高速なWebフレームワーク。",
        "vs-os-uvicorn-desc": "バックエンドアプリケーションを実行するために使用される超高速のASGIサーバー。",
        "vs-os-rembg-desc": "画像から背景をインテリジェントに削除するために使用される強力なライブラリ。",
        "vs-os-pillow-desc": "Pythonでの画像操作のための基本的なライブラリ。",
        "vs-os-onnx-desc": "rembgモデルを動かす高性能推論エンジン。",
        "vs-os-multipart-desc": "サーバー上でのファイルアップロード管理に不可欠なライブラリ。",
        "vs-os-sqlite-desc": "処理キューを管理するために使用されるデータベースエンジン。",
        "vs-os-translate-desc": "アプリケーションの翻訳機能を支えるサービス。",
        "vs-os-feather-desc": "ユーザーインターフェースのアイコンを提供するオープンソースのアイコンライブラリ。",
        "vs-os-crop-desc": "フロントエンドでの画像切り抜き機能のためのJavaScriptライブラリ。"
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
        "license-modal-desc": "Bidhaa zetu zote zinalindwa na sheria za kimataifa za mali miliki.",
        // Vid Spri (SW)
        "vs-nav-tutorials": "Mafunzo",
        "vs-info-1": "VidSpri iliundwa kwa ajili ya watengenezaji wa michezo wanaoanza au wale wanaotaka kuunda michezo yao ya 2D lakini hawana uzoefu wa kuchora kila fremu.",
        "vs-info-2": "Wengi wametumia AI kutoa fremu kwa wahusika wao, lakini AI pia haiwezi kufanya kazi hii vizuri; haijui jinsi ya kuifanya hadi tulipogundua kuwa AI, inapozalisha video, hufanya vizuri zaidi kuliko inavyozalisha picha rahisi yenye sprite kadhaa.",
        "vs-info-3": "Tulipata wazo la kutengeneza zana inayobadilisha video kuwa karatasi za sprite. Zana yetu hutoa fremu kutoka kwa video na kuzibadilisha kuwa karatasi ya sprite au huzalisha video ili kutoa fremu kutoka kwake, na kupata matokeo bora zaidi.",
        "vs-info-4": "Ili kuifanya iwe kamili zaidi, tumeifanya iweze kutoa sauti kwa michezo yako ya video.",
        "vs-credits-main": "Sifa za Maendeleo na Usaidizi wa VidSpri ni mradi wa Carley Interactive Studio. Mradi huu uliundwa kwa usaidizi wa Jules, mhandisi wa programu wa AI wa Google.",
        "vs-credits-hf": "Shukrani za pekee kwa Hugging Face kwa kutoa hosting ya bure kwa seva zetu kupitia jukwaa lao la Spaces.",
        "vs-credits-os": "Teknolojia na Maktaba za Open Source",
        "vs-tutorial-title": "Mafunzo",
        "vs-tutorial-desc": "Jifunze jinsi ya kutumia Vid Spri kwa miradi yako.",
        "vs-donate-1": "Msaada wako wa kifedha utatusaidia kuajiri watengenezaji na kulipia seva ili kufanya Vid Spri kuwa zana ya bure.",
        "vs-os-python-desc": "Lugha ya programu inayowezesha backend yetu yote.",
        "vs-os-docker-desc": "Jukwaa la kontena linaloturuhusu kupeleka seva kwa uaminifu.",
        "vs-os-fastapi-desc": "Mfumo wa kisasa na wa haraka wa wavuti kwa ajili ya kujenga API zetu.",
        "vs-os-uvicorn-desc": "Seva ya haraka sana ya ASGI, inayotumika kuendesha programu ya backend.",
        "vs-os-rembg-desc": "Maktaba yenye nguvu inayotumika kuondoa mandharinyuma kutoka kwa picha kwa akili.",
        "vs-os-pillow-desc": "Maktaba ya msingi ya uchezaji wa picha katika Python.",
        "vs-os-onnx-desc": "Injini ya utendaji wa juu inayowezesha mfumo wa rembg.",
        "vs-os-multipart-desc": "Maktaba muhimu kwa usimamizi wa upakiaji wa faili kwenye seva.",
        "vs-os-sqlite-desc": "Injini ya hifadhidata inayotumika kudhibiti foleni ya usindikaji.",
        "vs-os-translate-desc": "Huduma inayowezesha utendaji wa tafsiri katika programu.",
        "vs-os-feather-desc": "Maktaba ya ikoni ya open source inayotoa ikoni za kiolesura cha mtumiaji.",
        "vs-os-crop-desc": "Maktaba ya JavaScript kwa ajili ya utendaji wa kukata picha kwenye frontend."
    }
};

function initializeTranslations() {
    const picker = document.getElementById('lang-picker');

    const updateTexts = async (lang) => {
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

        // Update pickers
        ['lang-picker', 'lang-picker-ce'].forEach(id => {
            const p = document.getElementById(id);
            if (p) p.value = lang;
        });

        // Sync with Supabase if logged in
        if (window.currentUser) {
            await window.supabaseClient
                .from('profiles')
                .update({ language: lang })
                .eq('id', window.currentUser.id);
        }
    };

    if (picker) picker.onchange = (e) => updateTexts(e.target.value);

    // Initial load
    const savedLang = localStorage.getItem('carley-lang') || 'es';
    if (picker) picker.value = savedLang;
    updateTexts(savedLang);

    window.translateAll = updateTexts;

    // Policy content update for cuenta.html
    const policyContent = document.getElementById('policy-content');
    if (policyContent) {
        policyContent.textContent = translations[savedLang]["privacy-modal-desc"] || translations["es"]["privacy-modal-desc"];
    }

    // Ad button logic (Handles both internal pages and index.html)
    const setupAdButton = () => {
        const adBtn = document.getElementById('ce-ad-btn');
        const adContainer = document.getElementById('ce-ads-container');
        if (adBtn && adContainer) {
            adBtn.onclick = (e) => {
                e.preventDefault();
                if (adContainer.classList.contains('hidden')) {
                    adContainer.classList.remove('hidden');
                    // Push the ad unit only after it becomes visible to ensure proper size calculation
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (err) {
                        console.log("AdSense push waiting for site approval...");
                    }
                }
                adContainer.scrollIntoView({ behavior: 'smooth' });
            };
        }
    };
    setupAdButton();

    // Creative Engine Language Picker Sync
    const cePicker = document.getElementById('lang-picker-ce');
    if (cePicker) {
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

// account-trigger logic moved to account.html or direct link in header

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
    }, { threshold: 0.1 }); // Reduced threshold slightly for better visibility on small screens

    reveals.forEach(r => {
        // If already visible in viewport, activate immediately
        const rect = r.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            r.classList.add('active');
        }
        observer.observe(r);
    });
}

/* ==============================
   Real Data Handlers (Supabase)
============================== */

async function fetchOpinions() {
    const feed = document.getElementById('opinions-feed');
    if (!feed) return;

    // Detect if we are on CE or VS page
    const productId = window.location.pathname.includes('creative-engine.html') ? 'CE' : 'VS';

    const { data, error } = await window.supabaseClient
        .from('opinions')
        .select('*, profiles(username, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) return console.error('Error fetching opinions:', error);

    feed.innerHTML = data.map(op => {
        const username = escapeHTML(op.profiles?.username || op.user_email.split('@')[0]);
        const content = escapeHTML(op.content);
        const avatar = op.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${username}`;

        return `
            <div class="opinion-item product-reveal active">
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.8rem;">
                    <img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
                    <span style="font-weight: 600;">${username}</span>
                    <span style="font-size: 0.8rem; opacity: 0.4;">${new Date(op.created_at).toLocaleDateString()}</span>
                </div>
                <p style="opacity: 0.8; font-size: 0.95rem;">${content}</p>
            </div>
        `;
    }).join('');
}

async function fetchDonationStats() {
    if (!window.supabaseClient) return;
    const { data, error } = await window.supabaseClient
        .from('donations')
        .select('*, profiles(avatar_url, username)');

    if (error) {
        console.error('Detailed Error fetching donations:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
        return;
    }

    const stats = {
        CE: { current: 0, goal: 26000, donors: [] },
        VS: { current: 0, goal: 25000, donors: [] }
    };

    data.forEach(d => {
        if (stats[d.product_id]) {
            stats[d.product_id].current += parseFloat(d.amount);
            stats[d.product_id].donors.push(d);
        }
    });

    updateDonationUI(stats);
    window.currentDonationStats = stats; // Store for sorting in donaciones.html
}

function updateDonationUI(stats) {
    // Update Progress Bars and Labels across pages
    const ceProgress = (stats.CE.current / stats.CE.goal) * 100;
    const vsProgress = (stats.VS.current / stats.VS.goal) * 100;

    // Creative Engine
    const ceBar = document.getElementById('ce-progress-bar');
    const ceLabel = document.getElementById('ce-current-amount');
    if (ceBar) ceBar.style.width = Math.min(ceProgress, 100) + '%';
    if (ceLabel) ceLabel.textContent = 'Actual: $' + stats.CE.current.toLocaleString();

    // Vid Spri
    const vsBar = document.getElementById('vs-progress-bar');
    const vsLabel = document.getElementById('vs-current-amount');
    if (vsBar) vsBar.style.width = Math.min(vsProgress, 100) + '%';
    if (vsLabel) vsLabel.textContent = 'Actual: $' + stats.VS.current.toLocaleString();

    // If on hub page, render list
    if (document.getElementById('donors-hub-container')) {
        renderDonorsList();
    }
}

// Logic for Collaborators page moved to the HTML file for direct access to Supabase data

function setupHubListeners() {
    const filterApp = document.getElementById('filter-app');
    const sortOrder = document.getElementById('sort-order');

    if (filterApp) filterApp.onchange = () => renderDonorsList();
    if (sortOrder) sortOrder.onchange = () => renderDonorsList();
}

function renderDonorsList() {
    const container = document.getElementById('donors-hub-container');
    const filterApp = document.getElementById('filter-app')?.value || 'all';
    const sortOrder = document.getElementById('sort-order')?.value || 'desc';

    if (!container || !window.currentDonationStats) return;

    // Combine all donors
    let allDonors = [];
    if (filterApp === 'all') {
        allDonors = [...window.currentDonationStats.CE.donors, ...window.currentDonationStats.VS.donors];
    } else {
        allDonors = [...window.currentDonationStats[filterApp].donors];
    }

    // Sort
    if (sortOrder === 'desc') allDonors.sort((a,b) => b.amount - a.amount);
    if (sortOrder === 'asc') allDonors.sort((a,b) => a.amount - b.amount);
    if (sortOrder === 'newest') allDonors.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortOrder === 'oldest') allDonors.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));

    if (allDonors.length === 0) {
        container.innerHTML = '<div class="empty-state">No se encontraron donaciones con estos filtros.</div>';
        return;
    }

    container.innerHTML = allDonors.map(d => {
        const goal = d.product_id === 'CE' ? 26000 : 25000;
        const percentage = ((d.amount / goal) * 100).toFixed(2);
        const appName = d.product_id === 'CE' ? 'Creative Engine' : 'Vid Spri';
        const donorNameEscaped = escapeHTML(d.donor_name);

        const avatar = d.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${donorNameEscaped}&background=random`;

        return `
            <div class="donor-card product-reveal active">
                <div class="donor-info">
                    <img src="${avatar}" class="donor-pfp" alt="${donorNameEscaped}">
                    <div>
                        <span class="donor-name">${donorNameEscaped}</span>
                        <span class="donor-app">${appName}</span>
                    </div>
                </div>
                <div class="donor-amount-area">
                    <span class="donor-amount">$${parseFloat(d.amount).toFixed(2)}</span>
                    <span class="donor-percentage">+${percentage}%</span>
                </div>
            </div>
        `;
    }).join('');
}

// Handler for Submitting Opinions
const sendOpinionBtn = document.getElementById('send-opinion');
if (sendOpinionBtn) {
    sendOpinionBtn.onclick = async () => {
        if (!window.currentUser) return alert('Debes iniciar sesión para opinar.');
        const content = document.getElementById('opinion-text').value;
        const productId = window.location.pathname.includes('creative-engine.html') ? 'CE' : 'VS';

        if (!content) return alert('Escribe algo primero.');

        const { error } = await window.supabaseClient.from('opinions').insert({
            user_id: window.currentUser.id,
            user_email: window.currentUser.email,
            product_id: productId,
            content: content
        });

        if (error) alert(error.message);
        else {
            alert('¡Gracias por tu opinión!');
            document.getElementById('opinion-text').value = '';
            fetchOpinions();
        }
    };
}

// Handler for Submitting Bug Reports
const sendReportBtn = document.getElementById('send-report');
if (sendReportBtn) {
    sendReportBtn.onclick = async () => {
        const msg = document.getElementById('report-message').value;
        if (!msg) return alert('Describe el fallo.');

        const { error } = await window.supabaseClient.from('reports').insert({
            user_email: window.currentUser ? window.currentUser.email : 'anon@carley.com',
            message: msg
        });

        if (error) alert(error.message);
        else {
            alert('Reporte enviado con éxito.');
            document.getElementById('report-message').value = '';
        }
    };
}
