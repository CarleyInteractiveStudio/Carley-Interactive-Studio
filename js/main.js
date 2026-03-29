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

window.copyToClipboard = function(text, btn) {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback(btn);
        } catch (err) {}
        document.body.removeChild(textArea);
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(btn);
    });
};

function showCopyFeedback(btn) {
    const originalContent = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<i data-lucide="check" style="width:16px;height:16px;"></i>';
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalContent;
        if (window.lucide) window.lucide.createIcons();
    }, 2000);
}

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
        { name: 'Documentación', url: 'documentacion.html', keywords: ['guia', 'leyes', 'componentes', 'scripting', 'ces'], available: true },
        { name: 'Leyes', id: 'leyes', url: 'documentacion.html', keywords: ['componentes', 'guia', 'motor'], available: true },
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
        "btn-yes": "Sí",
        "btn-no": "No",
        "search-ph": "Buscar en Carley...",
        "hero-desc": "¿Has pensado alguna vez en desarrollar tu propio videojuego? Pues bien, hemos diseñado Creative Engine para ti, un motor de videojuegos en 2D que lo facilita todo. No importa si tienes experiencia en la creación de juegos o no, Creative Engine está hecho para ti. Cualquier idea que tengas, Creative Engine te ayuda a hacerla realidad.",
        "hero-cta": "Empezar a crear",
        "creative-games-desc": "Juega sin descargar nada, diviértete en la web. Juega a todos los juegos hechos con Creative Engine, ya sea para PC, consola o móvil.",
        "btn-visit": "Visitar",
        "vidspri-home-desc": "Crea animaciones a partir de vídeos para tus juegos. Genera un vídeo en cualquier página y nuestra herramienta lo convierte en una hoja de sprites para tus videojuegos.",
        "carl-ia-desc": "Nuestra IA actualmente en desarrollo. Muy pronto estará disponible para ayudarte en todo lo que necesites. Nuestro modelo será completo: tendrá visión, podrá hablar, generar texto y escuchar. Lo estamos entrenando para ser el compañero integral definitivo.",
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
        "acc-modal-title": "Mi Cuenta",
        "field-email": "Correo Electrónico",
        "field-username": "Nombre de Usuario",
        "btn-update": "Actualizar Perfil",
        "btn-logout": "Cerrar Sesión",
        "modal-hint": "Inicia sesión para gestionar tus proyectos.",
        "btn-login": "Entrar",
        "btn-register": "Crear Cuenta",
        "login-title": "Entrar",
        "ph-email": "Correo Electrónico",
        "ph-pass": "Contraseña",
        "ph-pass-confirm": "Confirmar Contraseña",
        "btn-login-action": "Entrar",
        "register-title": "Crear Cuenta",
        "ph-reg-user": "Nombre de Usuario",
        "ph-reg-email": "Correo Electrónico",
        "ph-reg-pass": "Contraseña",
        "ph-reg-pass-confirm": "Confirmar Contraseña",
        "btn-reg-action": "Registrarse",
        "btn-delete-acc": "Eliminar Cuenta",
        "ce-nav-info": "Información",
        "ce-nav-tutorials": "Tutoriales",
        "ce-nav-collabs": "Colaboradores",
        "ce-nav-solutions": "Soluciones Rápidas",
        "ce-nav-docs": "Documentación",
        "ce-nav-docs-leyes": "Componentes",
        "ce-nav-docs-scripting": "Scripting CES",
        "ce-nav-docs-libs": "Librerías",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Editores",
        "ce-nav-docs-advanced": "Avanzado",
        "ce-nav-docs-config": "Configuración",
        "ce-docs-leyes-title": "Guía de Componentes (Leyes) - Creative Engine",
        "ce-docs-leyes-intro": "En Creative Engine, las **Materias** (objetos) cobran vida a través de las **Leyes** (componentes). Cada Ley añade una funcionalidad específica, como gravedad, renderizado de imagen o lógica de IA.",
        "ce-docs-leyes-inspector": "Uso en Inspector:",
        "ce-docs-leyes-scripting": "Scripting:",
        "ce-docs-core-title": "1. Componentes Base (Core)",
        "ce-docs-transform-name": "Transform (Transformación)",
        "ce-docs-transform-desc": "Define la posición, rotación y escala de un objeto en el espacio 2D.",
        "ce-docs-transform-inspector": "Uso en Inspector: Edita los valores X e Y para mover el objeto. Usa los botones de volteo (Flip) para invertir la imagen.",
        "ce-docs-camera-name": "Camera (Cámara)",
        "ce-docs-camera-desc": "Define el área visible del juego.",
        "ce-docs-camera-inspector": "Uso en Inspector: Configura el color de fondo, el zoom y la máscara de capas (Culling Mask) para decidir qué objetos ve esta cámara.",
        "ce-docs-render-title": "2. Renderizado y Visuales",
        "ce-docs-sprite-name": "SpriteRenderer (Renderizador de Sprite)",
        "ce-docs-sprite-desc": "Muestra una imagen (.png, .jpg) o un cuadro de una hoja de sprites (.ceSprite).",
        "ce-docs-sprite-inspector": "Uso en Inspector: Arrastra una imagen al campo \"Source\". Puedes cambiar el color para tintar la imagen o ajustar la opacidad.",
        "ce-docs-water-name": "Water (Agua)",
        "ce-docs-water-desc": "Simulación física de fluidos basada en partículas.",
        "ce-docs-water-inspector": "Uso en Inspector: Define el ancho y alto del área de agua. Ajusta la densidad (flotación) y viscosidad.",
        "ce-docs-video-name": "VideoPlayer (Reproductor de Video)",
        "ce-docs-video-desc": "Reproduce archivos de video en el mundo o en la UI.",
        "ce-docs-video-inspector": "Uso en Inspector: Soporta formatos .mp4 y .webm. Puedes activar el bucle (loop) y ajustar el volumen.",
        "ce-docs-physics-title": "3. Físicas 2D",
        "ce-docs-rigidbody-name": "Rigidbody2D (Física)",
        "ce-docs-rigidbody-desc": "Permite que el objeto reaccione a la gravedad y colisiones.",
        "ce-docs-rigidbody-inspector": "Uso en Inspector: Cambia el tipo de cuerpo a \"Dynamic\" para que caiga, o \"Kinematic\" para moverlo manualmente pero que detecte colisiones.",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D (Colisionadores)",
        "ce-docs-collider-desc": "Definen la forma física para los choques.",
        "ce-docs-collider-inspector": "Uso en Inspector: Ajusta el tamaño o radio. Si marcas \"Is Trigger\", el objeto no chocará pero detectará cuando algo entre en su área.",
        "ce-docs-ai-title": "4. Inteligencia y Movimiento",
        "ce-docs-basicai-name": "BasicAI (IA Básica)",
        "ce-docs-basicai-desc": "Comportamientos automáticos para NPCs y enemigos.",
        "ce-docs-basicai-modes": "Modos: Follow (Sigue a una Materia), Escape (Huye de un objetivo), Wander (Camina aleatoriamente).",
        "ce-docs-patrol-name": "Patrol (Patrulla)",
        "ce-docs-patrol-desc": "Mueve el objeto entre dos puntos.",
        "ce-docs-ui-title": "5. Interfaz de Usuario (UI)",
        "ce-docs-canvas-name": "Canvas (Lienzo)",
        "ce-docs-canvas-desc": "El contenedor principal para todos los elementos de interfaz.",
        "ce-docs-button-name": "Button (Botón)",
        "ce-docs-button-desc": "Detecta clics del usuario.",
        "ce-docs-button-inspector": "Uso en Inspector: Permite definir colores para los estados (Normal, Presionado, Desactivado) o cambiar sprites.",
        "ce-docs-uitext-name": "UIText (Texto UI)",
        "ce-docs-uitext-desc": "Muestra texto en pantalla con fuentes personalizadas.",
        "ce-docs-anim-title": "6. Animación y Audio",
        "ce-docs-animator-name": "AnimatorController (Controlador)",
        "ce-docs-animator-desc": "Gestiona estados de animación (Caminar, Saltar, Quieto).",
        "ce-docs-animator-inspector": "Uso en Inspector: Requiere un archivo .ceanim. El \"Smart Mode\" anima automáticamente según el movimiento.",
        "ce-docs-audio-name": "AudioSource (Fuente de Audio)",
        "ce-docs-audio-desc": "Reproduce efectos de sonido o música.",
        "ce-docs-audio-inspector": "Uso en Inspector: Soporta Audio Espacial (el volumen baja si el objeto se aleja).",
        "ce-docs-others-title": "7. Otros Componentes",
        "ce-docs-others-raycast": "RaycastSource (Rallo): Lanza rayos invisibles para detectar paredes o enemigos.",
        "ce-docs-others-particles": "ParticleSystem (Partículas): Crea efectos de fuego, humo o chispas.",
        "ce-docs-others-parallax": "Parallax: Crea fondos infinitos con profundidad.",
        "ce-docs-others-light": "Light2D (Luces): Ilumina tu escena con luces puntuales o focales.",
        "ce-docs-protip-title": "Pro-Tip de Scripting",
        "ce-docs-protip-desc": "Recuerda que en Creative Engine, puedes acceder a cualquier componente directamente por su nombre en español. No necesitas usar prefijos.",
        "ce-docs-carl-keys": "Configura tu clave en Editar > Preferencias > IA. Soportamos Google Gemini (Gratis), OpenAI y Anthropic.",
        "ce-docs-carl-skill-1": "\"Crea un objeto llamado Jugador con SpriteRenderer.\"",
        "ce-docs-carl-skill-2": "\"Crea un script que mueva al jugador con las flechas.\"",
        "ce-docs-terminal-ls": "ls: Listar archivos.",
        "ce-docs-terminal-cd": "cd <carpeta>: Cambiar de carpeta.",
        "ce-docs-terminal-clear": "clear: Limpiar terminal.",
        "ce-docs-terminal-act-1": "Ventana > Terminal",
        "ce-docs-terminal-act-2": "Panel Inferior > Pestaña Terminal",
        "ce-docs-advanced-struct-1": "/Assets: Imágenes, sonidos, scripts.",
        "ce-docs-advanced-struct-2": "/lib: Librerías (.celib).",
        "ce-docs-advanced-struct-3": "project.ceconfig: Configuración técnica.",
        "ce-docs-advanced-scenes-desc": "Usa Ctrl + S para guardar. Las escenas (.ceScene) contienen todos los objetos y luces.",
        "ce-docs-advanced-build-desc": "Genera un paquete web independiente (.zip) listo para hosting.",
        "ce-docs-editors-sprite-desc": "Recorta imágenes grandes en múltiples sprites pequeños.",
        "ce-docs-editors-anim-desc": "Crea secuencias (.cea) usando una línea de tiempo.",
        "ce-docs-editors-tilemap-desc": "Diseña niveles basados en rejilla con pinceles y capas.",
        "ce-docs-config-project-desc": "Gestiona Sorting Layers, Collision Layers y Tags.",
        "ce-docs-config-ambient-desc": "Ciclo Día/Noche, filtros de color y luces ambientales.",
        "ce-docs-scripting": "Scripting",
        "ce-docs-scripting-title": "Guía Maestra de Scripting (CES)",
        "ce-docs-scripting-intro": "Creative Engine utiliza CES (Creative Engine Script), un lenguaje potente basado en JavaScript pero simplificado para creadores de videojuegos.",
        "ce-docs-scripting-core-title": "Conceptos Fundamentales",
        "ce-docs-scripting-import": "Todo script debe empezar con la instrucción para conectar con el motor: ve motor;",
        "ce-docs-scripting-access": "Acceso Directo: NO necesitas escribir this. o mtr. para acceder a los componentes.",
        "ce-docs-scripting-vars-title": "Variables Públicas (Inspector)",
        "ce-docs-scripting-vars-desc": "Para que una variable aparezca en el Inspector, usa la palabra clave publico.",
        "ce-docs-scripting-events-title": "Eventos de Ciclo de Vida",
        "ce-docs-scripting-input-title": "Entrada (Input) y Movimiento",
        "ce-docs-scripting-example-title": "Ejemplos Prácticos",
        "ce-docs-scripting-functions-title": "Funciones Especiales",
        "ce-docs-libs-title": "Guía de Librerías y Extensibilidad",
        "ce-docs-libs-intro": "Las librerías (.celib) permiten extender tanto la interfaz del editor como las capacidades de programación.",
        "ce-docs-libs-ui-title": "1. Librerías de Interfaz (Herramientas del Editor)",
        "ce-docs-libs-runtime-title": "2. Librerías de Runtime (Nuevas Funciones)",
        "ce-docs-libs-install-title": "Cómo Crear e Instalar una Librería",
        "ce-docs-carl-title": "Guía de Carl IA: Tu Asistente Autónomo",
        "ce-docs-carl-intro": "Carl IA es un agente inteligente capaz de manipular el editor, crear archivos y ayudarte a construir tu juego paso a paso.",
        "ce-docs-carl-activate-title": "Cómo Activar a Carl IA",
        "ce-docs-carl-config-title": "Configuración (API Keys)",
        "ce-docs-carl-skills-title": "Habilidades Autónomas",
        "ce-docs-carl-modes-title": "Modos de Ejecución",
        "ce-docs-carl-modes-desc": "Carl puede trabajar en modo \"Asistente\" (te guía) o \"Autónomo\" (hace los cambios por ti).",
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
        "btn-go-donate": "Ir a Donar",
        "ce-docs-transform-code": "posicion.x += 5; // Mueve a la derecha\nrotacion += 45;  // Rota 45 grados\nescala.x = 2;    // Duplica el tamaño horizontal\nvoltearH = verdadero; // Invierte horizontalmente",
        "ce-docs-camera-code": "camara.orthographicSize = 10; // Cambia el zoom\ncamara.backgroundColor = \"#ff0000\"; // Fondo rojo",
        "ce-docs-sprite-code": "renderizadorDeSprite.color = \"#00ff00\"; // Tinta de verde\nrenderizadorDeSprite.opacity = 0.5;      // Semi-transparente\nrenderizadorDeSprite.spriteName = \"Salto\"; // Cambia el sprite",
        "ce-docs-water-code": "agua.densidad = 2.0; // Los objetos flotarán más\nagua.mostrarMareas = verdadero;",
        "ce-docs-video-code": "reproductorDeVideo.reproducir();\nreproductorDeVideo.pausar();\nreproductorDeVideo.volumen = 0.8;",
        "ce-docs-rigidbody-code": "fisica.applyImpulse(nuevo Vector2(0, -10)); // Salto\nfisica.velocity.x = 5; // Velocidad constante\nfisica.gravityScale = 0; // Desactiva gravedad",
        "ce-docs-collider-code": "si (estaTocandoTag(\"Suelo\")) {\n    imprimir(\"En el suelo\");\n}",
        "ce-docs-basicai-code": "iaBasica.speed = 250;\niaBasica.behavior = \"Follow\";\niaBasica.target = buscar(\"Jugador\");",
        "ce-docs-patrol-code": "patrulla.distancia = 500;\npatrulla.velocidad = 100;",
        "ce-docs-canvas-code": "lienzo.scaleChildren = verdadero;",
        "ce-docs-button-code": "alHacerClick() {\n    imprimir(\"¡Botón presionado!\");\n}",
        "ce-docs-uitext-code": "textoUI.text = \"Puntos: \" + puntos;\ntextoUI.fontSize = 40;",
        "ce-docs-animator-code": "controlador.play(\"Atacar\"); // Fuerza un estado",
        "ce-docs-audiosource-code": "fuenteDeAudio.reproducir();\nfuenteDeAudio.loop = verdadero;\nreproducir.Explosion(); // Atajo proxy",
        "ce-docs-protip-code": "ve motor;\n\npublico numero fuerzaSalto = 12;\n\nalActualizar(delta) {\n    si (teclaRecienPresionada(\"Space\") y estaTocandoTag(\"Suelo\")) {\n        fisica.applyImpulse(nuevo Vector2(0, -fuerzaSalto));\n        reproducir.Salto(); // Llama al sonido o animación\n    }\n}",
        "ce-docs-scripting-import-code": "ve motor;",
        "ce-docs-scripting-input-code": "si (teclaPresionada(\"Space\")) {\n    fisica.applyImpulse(nuevo Vector2(0, 10));\n}",
        "ce-docs-scripting-functions-code": "buscar(\"Enemigo\");\ndestruir(estaMateria);\ninstanciar(balaPrefab, posicion);",
        "ce-docs-scripting-vars-code": "publico numero velocidad = 5;\npublico texto nombreJugador = \"Héroe\";\npublico booleano esInvencible = falso;\npublico Materia objetivo;\npublico Sprite icono;\npublico Audio sonidoSalto;",
        "ce-docs-scripting-events-code": "alEmpezar() {\n    imprimir(\"¡Hola Mundo!\");\n}\n\nalActualizar(delta) {\n    // Se ejecuta cada frame\n}\n\nalHacerClick() {\n}",
        "ce-docs-scripting-example-code": "ve motor;\npublico numero velocidad = 300;\n\nalActualizar(delta) {\n    variable movX = 0;\n    si (teclaPresionada(\"ArrowRight\")) movX = 1;\n    sino si (teclaPresionada(\"ArrowLeft\")) movX = -1;\n\n    fisica.velocity.x = movX * (velocidad * delta);\n}",
        "ce-docs-libs-ui-code": "CreativeEngine.API.registrarVentana({\n    nombre: \"Mi Herramienta\",\n    alAbrir: function(panel) {\n        panel.texto(\"¡Hola!\");\n        panel.boton(\"Click\", () => alert(\"OK\"));\n    }\n});",
        "ce-docs-libs-runtime-code": "const MiLib = {\n    saludar: () => console.log(\"Hola desde Lib\")\n};\nCreativeEngine.API.registrarRuntimeAPI(\"MiLib\", MiLib);",
        "ce-docs-terminal-code": "mkobj Bala\naddcomp 10 SpriteRenderer\nsetprop 10 Transform position.x 100",
        "ce-docs-not-available": "La documentación no está disponible actualmente en este idioma.",
        "ce-docs-tech-title": "5. Sistemas Técnicos",
        "ce-docs-particles-title": "Partículas",
        "ce-docs-particles-desc": "Crea efectos visuales complejos como fuego o humo.",
        "ce-docs-particles-code": "particulas.emitir(10);\nparticulas.detener();",
        "ce-docs-post-title": "Post-procesamiento",
        "ce-docs-post-desc": "Filtros visuales globales como Bloom o Corrección de Color.",
        "ce-docs-post-code": "postProcesado.bloom = verdadero;\npostProcesado.vignette = 0.5;",
        "ce-docs-audio-title": "Audio",
        "ce-docs-audio-code": "sonido.reproducir(\"Explosion\");\nsonido.volumenPrincipal = 1.0;",
        "ce-docs-opt-title": "Optimización",
        "ce-docs-opt-desc": "Herramientas para mejorar el rendimiento del juego.",
        "btn-see-support": "Ver Colaboradores",
        "ce-docs-advanced-build-title": "3. El Sistema de Build",
        "ce-docs-advanced-intro": "Gestión de activos, diseño de niveles y publicación.",
        "ce-docs-advanced-scenes-title": "2. Gestión de Escenas",
        "ce-docs-advanced-struct-title": "1. Estructura de Proyectos",
        "ce-docs-advanced-title": "Guía Avanzada",
        "ce-docs-audiosource-desc": "Reproduce efectos de sonido o música.",
        "ce-docs-audiosource-inspector": "Uso en Inspector: Soporta Audio Espacial (el volumen baja si el objeto se aleja).",
        "ce-docs-audiosource-name": "AudioSource (Fuente de Audio)",
        "ce-docs-carl-act-1": "Botón Superior: Icono del robot 🤖 (Carl)",
        "ce-docs-carl-act-2": "Atajo: Shift + Ctrl + L",
        "ce-docs-config-ambient-title": "2. Control de Ambiente",
        "ce-docs-config-intro": "Personaliza tu flujo de trabajo y atmósfera.",
        "ce-docs-config-project-title": "1. Configuración del Proyecto",
        "ce-docs-config-title": "Configuración y Ambiente",
        "ce-docs-editors-anim-title": "2. Editor de Animaciones",
        "ce-docs-editors-intro": "Suite de herramientas para animaciones y niveles.",
        "ce-docs-editors-sprite-title": "1. Editor de Sprites",
        "ce-docs-editors-tilemap-title": "3. Editor de Tilemaps",
        "ce-docs-editors-title": "Guía de Editores Visuales",
        "ce-docs-terminal-activate": "Cómo Activar la Terminal",
        "ce-docs-terminal-fs-title": "1. Comandos de Sistema",
        "ce-docs-terminal-intro": "La Terminal es una herramienta avanzada para interactuar con el motor mediante comandos de texto.",
        "ce-docs-terminal-scene-title": "2. Comandos de Escena",
        "ce-docs-terminal-title": "Guía de la Terminal",
        "ce-donate-intro": "Tu apoyo es lo que mantiene este proyecto vivo y gratuito para todos. Con total transparencia, te compartimos que mantener Creative Engine requiere cubrir costos de servidores y desarrollo para que siga siendo una herramienta accesible para todos sin barreras económicas. Sus donaciones ayudarán a que otros usen nuestras herramientas gratuitamente.",
        "ce-info-1": "Creative Engine fue diseñado para todo público. No importa que seas experto, novato o no tengas experiencia alguna, Creative Engine te ayuda y te enseña.",
        "ce-info-2": "Nuestro motor fue inspirado de Unity pero se basa en materias y leyes. Las materias pueden ser cualquier cosa de tu juego y las leyes todo lo que define el comportamiento de cada cosa de tu juego; son un conjunto de reglas que hacen tu juego único y hacerlo lo que quieras que sea.",
        "ce-nav-claims": "Reclamos",
        "ce-nav-donations": "Donaciones",
        "ce-nav-join": "Únete y Seguirnos",
        "ce-nav-license": "Licencia",
        "ce-nav-opinions": "Opiniones",
        "ce-nav-privacy": "Privacidad",
        "ce-nav-report": "Reportar Bug",
        "ce-tutorial-carl-desc": "Aprende a activar a Carl, tu compañero de desarrollo que te acompañará en el desarrollo de tus videojuegos.",
        "ce-tutorial-carl-title": "Cómo activar a Carl",
        "ce-tutorial-desc": "Aprende los fundamentos de Creative Engine y empieza tu aventura como desarrollador.",
        "ce-tutorial-prog-desc": "Aprende a programar tus propios videojuegos usando CES (Creative Engine Scripting) and other coding tools.",
        "ce-tutorial-prog-title": "Cómo programar en Creative Engine",
        "ce-tutorial-title": "Cómo crear tu primer juego",
        "ce-tutorial-ui-desc": "Aprende la interfaz de Creative Engine para crear con facilidad. Descubrirás todo lo que tiene el motor en su lanzamiento y para qué sirve cada herramienta; así sabrás mejor cómo crear tu videojuego.",
        "ce-tutorial-ui-title": "Aprende la interfaz de Creative Engine",
    },
    en: {
        welcome: "Welcome, we're glad to have you here",
        "btn-yes": "Yes",
        "btn-no": "No",
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
        "support-ce": "Support Creative Engine",
        "support-vs": "Support Vid Spri",
        "claim-sad-msg": "We are very sorry that it has come to this. We try to do everything in the best way so that everyone can enjoy.",
        "field-claim-photo": "Donation confirmation photo",
        "ph-claim-desc": "Explain the reason...",
        "acc-delete-long-warning": "This action is irreversible. A confirmation email will be sent. Please enter your password to proceed.",
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
        "ce-nav-solutions": "Quick Solutions",
        "ce-nav-docs": "Documentation",
        "ce-nav-docs-leyes": "Components",
        "ce-nav-docs-scripting": "Scripting CES",
        "ce-nav-docs-libs": "Libraries",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Editors",
        "ce-nav-docs-advanced": "Advanced",
        "ce-nav-docs-config": "Configuration",
        "ce-docs-leyes-title": "Component Guide (Leyes) - Creative Engine",
        "ce-docs-leyes-intro": "In Creative Engine, **Matters** (objects) come to life through **Leyes** (components). Each Ley adds specific functionality, such as gravity, image rendering, or AI logic.",
        "ce-docs-leyes-inspector": "Inspector Usage:",
        "ce-docs-leyes-scripting": "Scripting:",
        "ce-docs-core-title": "1. Core Components",
        "ce-docs-transform-title": "Transform",
        "ce-docs-transform-desc": "Defines the position, rotation, and scale of an object in 2D space.",
        "ce-docs-transform-ins": "Edit X and Y values to move the object. Use the Flip buttons to invert the image.",
        "ce-docs-camera-title": "Camera",
        "ce-docs-camera-desc": "Defines the visible area of the game.",
        "ce-docs-camera-ins": "Configure background color, zoom, and Culling Mask.",
        "ce-docs-render-title": "2. Rendering and Visuals",
        "ce-docs-sprite-title": "SpriteRenderer",
        "ce-docs-sprite-desc": "Displays an image (.png, .jpg) or a frame from a sprite sheet (.ceSprite).",
        "ce-docs-sprite-ins": "Drag an image to the 'Source' field. You can change the color tint or adjust opacity.",
        "ce-docs-water-title": "Water",
        "ce-docs-water-desc": "Physics-based fluid simulation using particles.",
        "ce-docs-water-ins": "Define width and height of the water area. Adjust density (buoyancy) and viscosity.",
        "ce-docs-video-title": "VideoPlayer",
        "ce-docs-video-desc": "Plays video files in the world or UI.",
        "ce-docs-video-ins": "Supports .mp4 and .webm formats. You can enable loop and adjust volume.",
        "ce-docs-physics-title": "3. 2D Physics",
        "ce-docs-rigidbody-title": "Rigidbody2D",
        "ce-docs-rigidbody-desc": "Allows the object to react to gravity and collisions.",
        "ce-docs-rigidbody-ins": "Change body type to 'Dynamic' to fall, or 'Kinematic' to move manually.",
        "ce-docs-colliders-title": "BoxCollider2D / CircleCollider2D",
        "ce-docs-colliders-desc": "Define the physical shape for collisions.",
        "ce-docs-colliders-ins": "Adjust size or radius. If 'Is Trigger' is checked, the object detects overlaps without physical collision.",
        "ce-docs-ai-title": "4. Intelligence and Movement",
        "ce-docs-basicai-title": "BasicAI",
        "ce-docs-basicai-desc": "Automatic behaviors for NPCs and enemies.",
        "ce-docs-patrol-title": "Patrol",
        "ce-docs-patrol-desc": "Moves the object between two points.",
        "ce-docs-ui-title": "5. User Interface (UI)",
        "ce-docs-canvas-title": "Canvas",
        "ce-docs-canvas-desc": "The main container for all UI elements.",
        "ce-docs-button-title": "Button",
        "ce-docs-button-desc": "Detects user clicks.",
        "ce-docs-uitext-title": "UIText",
        "ce-docs-uitext-desc": "Displays text on screen with custom fonts.",
        "ce-docs-anim-title": "6. Animation and Audio",
        "ce-docs-animator-title": "AnimatorController",
        "ce-docs-animator-desc": "Manages animation states (Walk, Jump, Idle).",
        "ce-docs-audio-title": "AudioSource",
        "ce-docs-audio-desc": "Plays sound effects or music. Supports Spatial Audio.",
        "ce-docs-other-title": "7. Other Components",
        "ce-docs-other-list": "RaycastSource, ParticleSystem, Parallax, Light2D.",
        "ce-docs-tip-title": "Scripting Pro-Tip",
        "ce-docs-tip-desc": "Remember that in Creative Engine, you can access any component directly by its name in Spanish. No prefixes needed.",
        "ce-docs-scripting-title": "Scripting Master Guide (CES)",
        "ce-docs-scripting-intro": "Creative Engine uses CES (Creative Engine Script), a powerful language based on JavaScript but simplified for game creators.",
        "ce-docs-scripting-core-title": "Core Concepts",
        "ce-docs-scripting-import": "Every script must start with the engine connection statement: ve motor;",
        "ce-docs-scripting-access": "Direct Access: You DO NOT need to write this. or mtr. to access components.",
        "ce-docs-scripting-vars-title": "Public Variables (Inspector)",
        "ce-docs-scripting-vars-desc": "Define variables so they appear in the Inspector.",
        "ce-docs-scripting-input-title": "Input and Movement",
        "ce-docs-scripting-functions-title": "Special Functions",
        "ce-docs-libs-title": "Library Installation (.celib)",
        "ce-docs-libs-intro": "Libraries extend engine functionality (e.g., Multiplayer, Inventories).",
        "ce-docs-libs-step-1": "Download the .celib file.",
        "ce-docs-libs-step-2": "Move it to the /lib folder of your project.",
        "ce-docs-libs-step-3": "The engine will load it automatically on startup.",
        "ce-docs-carl-title": "Execution with Carl AI",
        "ce-docs-carl-intro": "Carl can automate complex tasks using AI.",
        "ce-docs-carl-modes": "Execution Modes:",
        "ce-docs-carl-mode-1": "Command Mode: Executes immediate actions in the editor.",
        "ce-docs-carl-mode-2": "Scripting Mode: Helps write and debug CES code.",
        "ce-docs-terminal-title": "Terminal Guide",
        "ce-docs-terminal-intro": "The Terminal is an advanced tool for interacting with the engine through text commands.",
        "ce-docs-terminal-activate": "How to Activate the Terminal",
        "ce-docs-terminal-fs-title": "1. File System Commands",
        "ce-docs-terminal-scene-title": "2. Scene Commands",
        "ce-docs-advanced-title": "Advanced Guide: Projects, Scenes, and Build",
        "ce-docs-advanced-intro": "This guide covers the fundamental aspects of asset management, level design, and final game publishing.",
        "ce-docs-advanced-struct-title": "1. Project Structure",
        "ce-docs-advanced-scenes-title": "2. Scene Management (.ceScene)",
        "ce-docs-advanced-build-title": "3. The Build System (Publishing)",
        "ce-docs-editors-title": "Visual Editors Guide",
        "ce-docs-editors-intro": "Creative Engine includes a suite of visual tools to manage graphics, animations, and levels intuitively.",
        "ce-docs-editors-sprite-title": "1. Sprite Editor (Sprite Slicer)",
        "ce-docs-editors-anim-title": "2. Animation Editor (.cea)",
        "ce-docs-editors-tilemap-title": "3. Tilemap Editor",
        "ce-docs-config-title": "Configuration and Atmosphere Guide",
        "ce-docs-config-intro": "Learn how to customize your workflow and configure the technical parameters of your project.",
        "ce-docs-config-project-title": "1. Project Configuration",
        "ce-docs-config-ambient-title": "2. Atmosphere Control",
        "ce-docs-carl-keys": "Configure your key in Edit > Preferences > AI. We support Google Gemini (Free), OpenAI, and Anthropic.",
        "ce-docs-carl-skill-1": "\"Create an object named Player with SpriteRenderer.\"",
        "ce-docs-carl-skill-2": "\"Create a script that moves the player with arrows.\"",
        "ce-docs-terminal-ls": "ls: List files.",
        "ce-docs-terminal-cd": "cd <folder>: Change folder.",
        "ce-docs-terminal-clear": "clear: Clear terminal.",
        "ce-docs-terminal-act-1": "Window > Terminal",
        "ce-docs-terminal-act-2": "Bottom Panel > Terminal Tab.",
        "ce-docs-advanced-struct-1": "/Assets: Images, sounds, scripts.",
        "ce-docs-advanced-struct-2": "/lib: Libraries (.celib).",
        "ce-docs-advanced-struct-3": "project.ceconfig: Technical configuration.",
        "ce-docs-advanced-scenes-desc": "Use Ctrl + S to save. Scenes (.ceScene) contain all objects and lights.",
        "ce-docs-advanced-build-desc": "Generates a standalone web package (.zip) ready for hosting.",
        "ce-docs-editors-sprite-desc": "Slice large images into multiple small sprites.",
        "ce-docs-editors-anim-desc": "Create sequences (.cea) using a timeline.",
        "ce-docs-editors-tilemap-desc": "Design grid-based levels with brushes and layers.",
        "ce-docs-config-project-desc": "Manage Sorting Layers, Collision Layers, and Tags.",
        "ce-docs-config-ambient-desc": "Day/Night cycle, color filters, and ambient lights.",
        "ce-docs-transform-name": "Transform",
        "ce-docs-transform-inspector": "Inspector Use: Edit X and Y values to move the object. Use flip buttons to invert the image.",
        "ce-docs-camera-name": "Camera",
        "ce-docs-camera-inspector": "Inspector Use: Configure background color, zoom, and culling mask to decide which objects this camera sees.",
        "ce-docs-sprite-name": "SpriteRenderer",
        "ce-docs-sprite-inspector": "Inspector Use: Drag an image to the \"Source\" field. You can change the color to tint the image or adjust opacity.",
        "ce-docs-water-name": "Water",
        "ce-docs-water-inspector": "Inspector Use: Define width and height of the water area. Adjust density (buoyancy) and viscosity.",
        "ce-docs-video-name": "VideoPlayer",
        "ce-docs-video-inspector": "Inspector Use: Supports .mp4 and .webm formats. You can enable loop and adjust volume.",
        "ce-docs-rigidbody-name": "Rigidbody2D",
        "ce-docs-rigidbody-inspector": "Inspector Use: Change body type to \"Dynamic\" to fall, or \"Kinematic\" to move manually but detect collisions.",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D",
        "ce-docs-collider-desc": "Define the physical shape for collisions.",
        "ce-docs-collider-inspector": "Inspector Use: Adjust size or radius. If you check \"Is Trigger\", the object won't collide but will detect when something enters its area.",
        "ce-docs-basicai-name": "BasicAI",
        "ce-docs-basicai-modes": "Modes: Follow (Follows a Matter), Escape (Flees from a target), Wander (Walks randomly).",
        "ce-docs-patrol-name": "Patrol",
        "ce-docs-canvas-name": "Canvas",
        "ce-docs-button-name": "Button",
        "ce-docs-button-inspector": "Inspector Use: Allows defining colors for states (Normal, Pressed, Disabled) or changing sprites.",
        "ce-docs-uitext-name": "UIText",
        "ce-docs-animator-name": "AnimatorController",
        "ce-docs-animator-inspector": "Inspector Use: Requires a .ceanim file. \"Smart Mode\" animates automatically based on movement.",
        "ce-docs-audio-name": "AudioSource",
        "ce-docs-audio-inspector": "Inspector Use: Supports Spatial Audio (volume drops as object moves away).",
        "ce-docs-others-title": "7. Other Components",
        "ce-docs-others-raycast": "RaycastSource (Ray): Casts invisible rays to detect walls or enemies.",
        "ce-docs-others-particles": "ParticleSystem (Particles): Creates fire, smoke, or spark effects.",
        "ce-docs-others-parallax": "Parallax: Creates infinite backgrounds with depth.",
        "ce-docs-others-light": "Light2D (Lights): Illuminates your scene with point or spot lights.",
        "ce-docs-protip-title": "Scripting Pro-Tip",
        "ce-docs-protip-desc": "Remember that in Creative Engine, you can access any component directly by its name. No prefixes needed.",
        "ce-docs-scripting": "Scripting",
        // Scripting Guide
        "ce-docs-scripting-events-title": "Lifecycle Events",
        "ce-docs-scripting-example-title": "Practical Examples",
        // Libraries Guide
        "ce-docs-libs-ui-title": "1. Interface Libraries (Editor Tools)",
        "ce-docs-libs-runtime-title": "2. Runtime Libraries (New Functions)",
        "ce-docs-libs-install-title": "How to Create and Install a Library",
        // Carl IA Guide
        "ce-docs-carl-activate-title": "How to Activate Carl IA",
        "ce-docs-carl-config-title": "Configuration (API Keys)",
        "ce-docs-carl-skills-title": "Autonomous Skills",
        "ce-docs-carl-modes-title": "Execution Modes",
        "ce-solutions-title": "Quick Solutions",
        "ce-solutions-placeholder": "For now, there are no quick solutions, but if you find any bugs, please report them. This way we will start adding ways to solve them.",
        "ce-nav-tutorials": "Tutorials",
        "ce-tutorial-ui-title": "Learn the Creative Engine interface",
        "ce-tutorial-ui-desc": "Learn the Creative Engine interface to create with ease. You will discover everything the engine has at launch and what each tool is for; this way you will better know how to create your video game.",
        "ce-tutorial-carl-title": "How to activate Carl",
        "ce-tutorial-carl-desc": "Learn how to activate Carl, your development companion who will accompany you in the development of your video games.",
        "ce-tutorial-prog-title": "How to program in Creative Engine",
        "ce-tutorial-prog-desc": "Learn to program your own video games using CES (Creative Engine Scripting) and other coding tools.",
        "ce-tutorial-title": "How to create your first game",
        "ce-tutorial-desc": "Learn the fundamentals of Creative Engine and start your adventure as a developer.",
        "tutorial-not-available": "This tutorial is not yet available, do you want to see our channel and other videos?",
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
        "btn-go-donate": "Go to Donate",
        "ce-docs-transform-code": "position.x += 5; // Move right\nrotation += 45;  // Rotate 45 degrees\nscale.x = 2;    // Double horizontal size\nflipH = true;    // Invert horizontally",
        "ce-docs-camera-code": "camera.orthographicSize = 10; // Change zoom\ncamera.backgroundColor = \"#ff0000\"; // Red background",
        "ce-docs-sprite-code": "spriteRenderer.color = \"#00ff00\"; // Green tint\nspriteRenderer.opacity = 0.5;      // Semi-transparent\nspriteRenderer.spriteName = \"Jump\"; // Change sprite",
        "ce-docs-water-code": "water.density = 2.0; // Objects will float more\nwater.showTides = true;",
        "ce-docs-video-code": "videoPlayer.play();\nvideoPlayer.pause();\nvideoPlayer.volume = 0.8;",
        "ce-docs-rigidbody-code": "physics.applyImpulse(new Vector2(0, -10)); // Jump\nphysics.velocity.x = 5; // Constant speed\nphysics.gravityScale = 0; // Disable gravity",
        "ce-docs-collider-code": "if (isTouchingTag(\"Floor\")) {\n    print(\"On floor\");\n}",
        "ce-docs-basicai-code": "basicAI.speed = 250;\nbasicAI.behavior = \"Follow\";\nbasicAI.target = find(\"Player\");",
        "ce-docs-patrol-code": "patrol.distance = 500;\npatrol.speed = 100;",
        "ce-docs-canvas-code": "canvas.scaleChildren = true;",
        "ce-docs-button-code": "onClick() {\n    print(\"Button pressed!\");\n}",
        "ce-docs-uitext-code": "uiText.text = \"Points: \" + points;\nuiText.fontSize = 40;",
        "ce-docs-animator-code": "controller.play(\"Attack\"); // Force state",
        "ce-docs-audiosource-code": "audioSource.play();\naudioSource.loop = true;\nplay.Explosion(); // Proxy shortcut",
        "ce-docs-protip-code": "engine motor;\n\npublic number jumpForce = 12;\n\nonUpdate(delta) {\n    if (isKeyJustPressed(\"Space\") and isTouchingTag(\"Floor\")) {\n        physics.applyImpulse(new Vector2(0, -jumpForce));\n        play.Jump(); // Calls sound or animation\n    }\n}",
        "ce-docs-scripting-import-code": "engine motor;",
        "ce-docs-scripting-input-code": "if (isKeyPressed(\"Space\")) {\n    physics.applyImpulse(new Vector2(0, 10));\n}",
        "ce-docs-scripting-functions-code": "find(\"Enemy\");\ndestroy(thisMatter);\ninstantiate(bulletPrefab, position);",
        "ce-docs-scripting-vars-code": "public number speed = 5;\npublic string playerName = \"Hero\";\npublic boolean isInvincible = false;\npublic Matter target;\npublic Sprite icon;\npublic Audio jumpSound;",
        "ce-docs-scripting-events-code": "onStart() {\n    print(\"Hello World!\");\n}\n\nonUpdate(delta) {\n    // Runs every frame\n}\n\nonClick() {\n}",
        "ce-docs-scripting-example-code": "engine motor;\npublic number speed = 300;\n\nonUpdate(delta) {\n    variable movX = 0;\n    if (isKeyPressed(\"ArrowRight\")) movX = 1;\n    else if (isKeyPressed(\"ArrowLeft\")) movX = -1;\n\n    physics.velocity.x = movX * (speed * delta);\n}",
        "ce-docs-libs-ui-code": "CreativeEngine.API.registerWindow({\n    name: \"My Tool\",\n    onOpen: function(panel) {\n        panel.text(\"Hello!\");\n        panel.button(\"Click\", () => alert(\"OK\"));\n    }\n});",
        "ce-docs-libs-runtime-code": "const MyLib = {\n    greet: () => console.log(\"Hello from Lib\")\n};\nCreativeEngine.API.registerRuntimeAPI(\"MyLib\", MyLib);",
        "ce-docs-terminal-code": "mkobj Bullet\naddcomp 10 SpriteRenderer\nsetprop 10 Transform position.x 100",
        "ce-docs-not-available": "Documentation is currently not available in this language.",
        "ce-docs-tech-title": "5. Technical Systems",
        "ce-docs-particles-title": "Particles",
        "ce-docs-particles-desc": "Create complex visual effects like fire or smoke.",
        "ce-docs-particles-code": "particles.emit(10);\nparticles.stop();",
        "ce-docs-post-title": "Post-Processing",
        "ce-docs-post-desc": "Global visual filters like Bloom or Color Correction.",
        "ce-docs-post-code": "postProcessing.bloom = true;\npostProcessing.vignette = 0.5;",
        "ce-docs-audio-code": "sound.play(\"Explosion\");\nsound.masterVolume = 1.0;",
        "ce-docs-opt-title": "Optimization",
        "ce-docs-opt-desc": "Tools to improve game performance.",
    },
    fr: {
        welcome: "Bienvenue, nous sommes ravis de vous voir ici",
        "btn-yes": "Oui",
        "btn-no": "Non",
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
        "ce-nav-tutorials": "Tutoriels",
        "ce-nav-solutions": "Solutions Rapides",
        "ce-nav-docs": "Documentation",
        "ce-docs-terminal-title": "Guide du Terminal",
        "ce-docs-terminal-intro": "Le Terminal est un outil avancé pour interagir avec le moteur via des commandes textuelles.",
        "ce-docs-terminal-activate": "Comment Activer le Terminal",
        "ce-docs-terminal-fs-title": "1. Commandes du Système de Fichiers",
        "ce-docs-terminal-scene-title": "2. Commandes de Scène",
        "ce-docs-advanced-title": "Guide Avancé : Projets, Scènes et Build",
        "ce-docs-advanced-intro": "Ce guide couvre les aspects fondamentaux de la gestion des ressources, de la conception des niveaux et de la publication finale du jeu.",
        "ce-docs-advanced-struct-title": "1. Structure du Projet",
        "ce-docs-advanced-scenes-title": "2. Gestion des Scènes (.ceScene)",
        "ce-docs-advanced-build-title": "3. Le Système de Build (Publication)",
        "ce-docs-editors-title": "Guide des Éditeurs Visuels",
        "ce-docs-editors-intro": "Creative Engine comprend une suite d'outils visuels pour gérer les graphismes, les animations et les niveaux de manière intuitive.",
        "ce-docs-editors-sprite-title": "1. Éditeur de Sprites (Sprite Slicer)",
        "ce-docs-editors-anim-title": "2. Éditeur d'Animations (.cea)",
        "ce-docs-editors-tilemap-title": "3. Éditeur de Tilemap",
        "ce-docs-config-title": "Guide de Configuration et d'Atmosphère",
        "ce-docs-config-intro": "Apprenez à personnaliser votre flux de travail et à configurer les paramètres techniques de votre projet.",
        "ce-docs-config-project-title": "1. Configuration du Projet",
        "ce-docs-config-ambient-title": "2. Contrôle de l'Atmosphère",
        "ce-docs-carl-keys": "Configurez votre clé dans Éditer > Préférences > IA. Nous supportons Google Gemini (Gratuit), OpenAI et Anthropic.",
        "ce-docs-carl-skill-1": "\"Crée un objet appelé Joueur avec SpriteRenderer.\"",
        "ce-docs-carl-skill-2": "\"Crée un script qui déplace le joueur avec les flèches.\"",
        "ce-docs-terminal-ls": "ls : Lister les fichiers.",
        "ce-docs-terminal-cd": "cd <dossier> : Changer de dossier.",
        "ce-docs-terminal-clear": "clear : Effacer le terminal.",
        "ce-docs-terminal-act-1": "Fenêtre > Terminal",
        "ce-docs-terminal-act-2": "Panneau Inférieur > Onglet Terminal.",
        "ce-docs-advanced-struct-1": "/Assets : Images, sons, scripts.",
        "ce-docs-advanced-struct-2": "/lib : Bibliothèques (.celib).",
        "ce-docs-advanced-struct-3": "project.ceconfig : Configuration technique.",
        "ce-docs-advanced-scenes-desc": "Utilisez Ctrl + S pour sauvegarder. Les scènes (.ceScene) contiennent tous les objets et lumières.",
        "ce-docs-advanced-build-desc": "Génère un paquet web indépendant (.zip) prêt pour l'hébergement.",
        "ce-docs-editors-sprite-desc": "Découpez de grandes images en plusieurs petits sprites.",
        "ce-docs-editors-anim-desc": "Créez des séquences (.cea) en utilisant une ligne de temps.",
        "ce-docs-editors-tilemap-desc": "Concevez des niveaux basés sur une grille avec des pinceaux et des calques.",
        "ce-docs-config-project-desc": "Gérez les Sorting Layers, Collision Layers et Tags.",
        "ce-docs-config-ambient-desc": "Cycle Jour/Nuit, filtres de color et lumières d'ambiance.",
        "ce-docs-scripting-title": "Guide Maître du Scripting (CES)",
        "ce-docs-scripting-intro": "Creative Engine utilise CES (Creative Engine Script), un langage puissant basé sur JavaScript mais simplifié pour les créateurs de jeux.",
        "ce-docs-scripting-core-title": "Concepts Fondamentaux",
        "ce-docs-scripting-import": "Tout script doit commencer par l'instruction de connexion au moteur : ve motor;",
        "ce-docs-scripting-access": "Accès Direct : Vous N'AVEZ PAS besoin d'écrire this. ou mtr. pour accéder aux composants.",
        "ce-docs-scripting-vars-title": "Variables Publiques (Inspecteur)",
        "ce-docs-scripting-vars-desc": "Pour qu'une variable apparaisse dans l'Inspecteur, utilisez le mot-clé publico.",
        "ce-docs-scripting-events-title": "Événements de Cycle de Vie",
        "ce-docs-scripting-input-title": "Entrée (Input) et Mouvement",
        "ce-docs-scripting-example-title": "Exemples Pratiques",
        "ce-docs-scripting-functions-title": "Fonctions Spéciales",
        "ce-docs-libs-title": "Guide des Bibliothèques et de l'Extensibilité",
        "ce-docs-libs-intro": "Les bibliothèques (.celib) permettent d'étendre à la fois l'interface de l'éditeur et les capacités de programmation.",
        "ce-docs-libs-ui-title": "1. Bibliothèques d'Interface (Outils de l'Éditeur)",
        "ce-docs-libs-runtime-title": "2. Bibliothèques de Runtime (Nouvelles Fonctions)",
        "ce-docs-libs-install-title": "Comment Créer et Installer une Bibliothèque",
        "ce-docs-carl-title": "Guide de Carl IA : Votre Assistant Autonome",
        "ce-docs-carl-intro": "Carl IA est un agent intelligent capable de manipuler l'éditeur, de créer des fichiers et de vous aider à construire votre jeu étape par étape.",
        "ce-docs-carl-activate-title": "Comment Activer Carl IA",
        "ce-docs-carl-config-title": "Configuration (Clés API)",
        "ce-docs-carl-skills-title": "Compétences Autonomes",
        "ce-docs-carl-modes-title": "Modes d'Exécution",
        "ce-docs-carl-modes-desc": "Carl peut travailler en mode \"Assistant\" (vous guide) ou \"Autonome\" (effectue les changements pour vous).",
        "ce-docs-carl-act-1": "Bouton Supérieur : Icône du robot (Carl)",
        "ce-docs-carl-act-2": "Raccourci : Shift + Ctrl + L",
        "ce-solutions-title": "Solutions Rapides",
        "ce-solutions-placeholder": "Pour l'instant, il n'y a pas de solutions rapides, mais si vous trouvez des bugs, veuillez les signaler. De cette façon, nous commencerons à ajouter des moyens de les résoudre.",
        "ce-tutorial-ui-title": "Apprenez l'interface de Creative Engine",
        "ce-tutorial-ui-desc": "Apprenez l'interface de Creative Engine pour créer avec facilité. Vous découvrirez tout ce que le moteur propose à son lancement et à quoi sert chaque outil ; ainsi, vous saurez mieux comment créer votre jeu vidéo.",
        "ce-tutorial-carl-title": "Comment activer Carl",
        "ce-tutorial-carl-desc": "Apprenez à activer Carl, votre compagnon de développement qui vous accompagnera dans le développement de vos jeux vidéo.",
        "ce-tutorial-prog-title": "Comment programmer dans Creative Engine",
        "ce-tutorial-prog-desc": "Apprenez à programmer vos propres jeux vidéo en utilisant CES (Creative Engine Scripting) et d'autres outils de codage.",
        "tutorial-not-available": "Ce tutoriel n'est pas encore disponible, voulez-vous voir notre chaîne et d'autres vidéos ?",
        // Vid Spri (FR)
        "vs-nav-tutorials": "Tutoriels",
        "ce-docs-leyes-title": "Guide des Composants (Lois) - Creative Engine",
        "ce-docs-leyes-intro": "Dans Creative Engine, les Matières (objets) prennent vie à travers les Lois (composants). Chaque Loi ajoute une fonctionnalité spécifique, telle que la gravité, le rendu d'image ou la logique d'IA. Ce guide détaille l'utilisation des composants tant dans l'Inspecteur que dans les Scripts (.ces) en utilisant la syntaxe moderne (sans préfixes comme this. ou motor.).",
        "ce-docs-core-title": "1. Composants de Base (Core)",
        "ce-docs-transform-name": "Transform (Transformation)",
        "ce-docs-transform-desc": "Définit la position, la rotation et l'échelle d'un objet dans l'espace 2D.",
        "ce-docs-transform-inspector": "Utilisation dans l'Inspecteur : Modifiez les valeurs X et Y pour déplacer l'objet. Utilisez les boutons de retournement (Flip) pour inverser l'image.",
        "ce-docs-camera-name": "Camera (Caméra)",
        "ce-docs-camera-desc": "Définit la zone visible du jeu.",
        "ce-docs-camera-inspector": "Utilisation dans l'Inspecteur : Configurez la couleur d'arrière-plan, le zoom et le masque de calque (Culling Mask) pour décider quels objets cette caméra voit.",
        "ce-docs-render-title": "2. Rendu et Visuels",
        "ce-docs-sprite-name": "SpriteRenderer (Rendu de Sprite)",
        "ce-docs-sprite-desc": "Affiche une image (.png, .jpg) ou une image d'une feuille de sprites (.ceSprite).",
        "ce-docs-sprite-inspector": "Utilisation dans l'Inspecteur : Faites glisser une image vers le champ \"Source\". Vous pouvez changer la couleur pour teinter l'image ou ajuster l'opacité.",
        "ce-docs-water-name": "Water (Eau)",
        "ce-docs-water-desc": "Simulation physique des fluides basée sur des particules.",
        "ce-docs-water-inspector": "Utilisation dans l'Inspecteur : Définit la largeur et la hauteur de la zone d'eau. Ajustez la densité (flottabilité) et la viscosité.",
        "ce-docs-video-name": "VideoPlayer (Lecteur Vidéo)",
        "ce-docs-video-desc": "Lit des fichiers vidéo dans le monde ou dans l'interface utilisateur.",
        "ce-docs-video-inspector": "Utilisation dans l'Inspecteur : Prend en charge les formats .mp4 et .webm. Vous pouvez activer la boucle (loop) et régler le volume.",
        "ce-docs-physics-title": "3. Physique 2D",
        "ce-docs-rigidbody-name": "Rigidbody2D (Physique)",
        "ce-docs-rigidbody-desc": "Permet à l'objet de réagir à la gravité et aux collisions.",
        "ce-docs-rigidbody-inspector": "Utilisation dans l'Inspecteur : Changez le type de corps en \"Dynamic\" pour qu'il tombe, ou en \"Kinematic\" pour le déplacer manuellement tout en détectant les collisions.",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D (Collisionneurs)",
        "ce-docs-collider-desc": "Définissent la forme physique pour les chocs.",
        "ce-docs-collider-inspector": "Utilisation dans l'Inspecteur : Ajustez la taille ou le rayon. Si vous cochez \"Is Trigger\", l'objet n'entrera pas en collision mais détectera quand quelque chose pénètre dans sa zone.",
        "ce-docs-ai-title": "4. Intelligence et Mouvement",
        "ce-docs-basicai-name": "BasicAI (IA de Base)",
        "ce-docs-basicai-desc": "Comportements automatiques pour les PNJ et les ennemis.",
        "ce-docs-basicai-modes": "Modes : Follow (Suit une Matière), Escape (Fuit une cible), Wander (Marche aléatoirement).",
        "ce-docs-patrol-name": "Patrol (Patrouille)",
        "ce-docs-patrol-desc": "Déplace l'objet entre deux points.",
        "ce-docs-ui-title": "5. Interface Utilisateur (UI)",
        "ce-docs-canvas-name": "Canvas (Canevas)",
        "ce-docs-canvas-desc": "Le conteneur principal pour tous les éléments d'interface.",
        "ce-docs-button-name": "Button (Bouton)",
        "ce-docs-button-desc": "Détecte les clics de l'utilisateur.",
        "ce-docs-button-inspector": "Utilisation dans l'Inspecteur : Permet de définir des couleurs pour les états (Normal, Pressé, Désactivé) ou de changer les sprites.",
        "ce-docs-uitext-name": "UIText (Texte UI)",
        "ce-docs-uitext-desc": "Affiche du texte à l'écran avec des polices personnalisées.",
        "ce-docs-anim-title": "6. Animation et Audio",
        "ce-docs-animator-name": "AnimatorController (Contrôleur)",
        "ce-docs-animator-desc": "Gère les états d'animation (Marcher, Sauter, Inactif).",
        "ce-docs-animator-inspector": "Utilisation dans l'Inspecteur : Nécessite un fichier .ceanim. Le \"Smart Mode\" anime automatiquement selon le mouvement.",
        "ce-docs-audio-name": "AudioSource (Source Audio)",
        "ce-docs-audio-desc": "Joue des effets sonores ou de la musique.",
        "ce-docs-audio-inspector": "Utilisation dans l'Inspecteur : Prend en charge l'audio spatial (le volume baisse si l'objet s'éloigne).",
        "ce-docs-others-title": "7. Autres Composants",
        "ce-docs-others-raycast": "RaycastSource (Rayon) : Lance des rayons invisibles pour détecter les murs ou les ennemis.",
        "ce-docs-others-particles": "ParticleSystem (Particules) : Crée des effets de feu, de fumée ou d'étincelles.",
        "ce-docs-others-parallax": "Parallax : Crée des arrière-plans infinis avec de la profondeur.",
        "ce-docs-others-light": "Light2D (Lumières) : Illumine votre scène avec des lumières ponctuelles ou focales.",
        "ce-docs-protip-title": "Pro-Tip de Scripting",
        "ce-docs-protip-desc": "N'oubliez pas que dans Creative Engine, vous pouvez accéder à n'importe quel composant directement par son nom. Aucun préfixe n'est nécessaire.",
        "ce-docs-scripting": "Scripting",
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
        "vs-os-crop-desc": "Bibliothèque JavaScript pour le recadrage d'images sur le frontend.",
        "ce-nav-docs-leyes": "Composants",
        "ce-nav-docs-scripting": "Scripting",
        "ce-nav-docs-libs": "Bibliothèques",
        "ce-nav-docs-carl": "Carl AI",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Éditeurs",
        "ce-nav-docs-advanced": "Avancé",
        "ce-nav-docs-config": "Configuration",
        "ce-docs-leyes-inspector": "Utilisation dans l'Inspecteur :",
        "ce-docs-leyes-scripting": "Scripting :",
        "ce-docs-transform-title": "Transform (Transformation)",
        "ce-docs-transform-ins": "Modifiez les valeurs X et Y pour déplacer l'objet. Utilisez les boutons Flip pour inverser l'image.",
        "ce-docs-camera-title": "Camera (Caméra)",
        "ce-docs-camera-ins": "Configurez la couleur d'arrière-plan, le zoom et le masque de calque (Culling Mask).",
        "ce-docs-sprite-title": "SpriteRenderer (Rendu de Sprite)",
        "ce-docs-sprite-ins": "Faites glisser une image dans le champ 'Source'. Vous pouvez changer la couleur ou ajuster l'opacité.",
        "ce-docs-water-title": "Water (Eau)",
        "ce-docs-water-ins": "Définit la largeur et la hauteur de la zone d'eau. Ajustez la densité (flottaison) et la viscosité.",
        "ce-docs-video-title": "VideoPlayer (Lecteur Vidéo)",
        "ce-docs-video-ins": "Prend en charge les formats .mp4 et .webm. Vous pouvez activer la boucle et régler le volume.",
        "ce-docs-rigidbody-title": "Rigidbody2D (Physique)",
        "ce-docs-rigidbody-ins": "Changez le type de corps en 'Dynamic' pour qu'il tombe, ou 'Kinematic' pour le déplacer manuellement.",
        "ce-docs-colliders-title": "BoxCollider2D / CircleCollider2D",
        "ce-docs-colliders-desc": "Définissent la forme physique pour les chocs.",
        "ce-docs-colliders-ins": "Ajustez la taille ou le rayon. 'Is Trigger' permet de détecter sans collision physique.",
        "ce-docs-basicai-title": "BasicAI (IA de Base)",
        "ce-docs-patrol-title": "Patrol (Patrouille)",
        "ce-docs-canvas-title": "Canvas (Canevas)",
        "ce-docs-button-title": "Button (Bouton)",
        "ce-docs-uitext-title": "UIText (Texte UI)",
        "ce-docs-animator-title": "AnimatorController (Contrôleur)",
        "ce-docs-audio-title": "AudioSource (Source Audio)",
        "ce-docs-other-title": "7. Autres Composants",
        "ce-docs-other-list": "RaycastSource (Rayon), ParticleSystem (Particules), Parallax (Parallaxe), Light2D (Lumières).",
        "ce-docs-tip-title": "Conseil de Scripting",
        "ce-docs-tip-desc": "N'oubliez pas que dans Creative Engine, vous pouvez accéder à n'importe quel composant directement par son nom. Vous n'avez pas besoin d'utiliser de préfixes.",
        "ce-docs-libs-step-1": "Téléchargez le fichier .celib.",
        "ce-docs-libs-step-2": "Déplacez-le dans le dossier /lib de votre projet.",
        "ce-docs-libs-step-3": "Le moteur le chargera automatiquement au démarrage.",
        "ce-docs-carl-modes": "Modes d'Exécution :",
        "ce-docs-carl-mode-1": "Mode Commande : Exécute des actions immédiates dans l'éditeur.",
        "ce-docs-carl-mode-2": "Mode Scripting : Aide à écrire et déboguer du code CES.",
            "ce-docs-not-available": "La documentation n'est pas disponible actuellement dans cette langue.",
    },
    pt: {
        welcome: "Bem-vindo, estamos felizes em tê-lo aqui",
        "btn-yes": "Sim",
        "btn-no": "Não",
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
        "ce-nav-tutorials": "Tutoriais",
        "ce-nav-solutions": "Soluções Rápidas",
        "ce-nav-docs": "Documentação",
        "ce-solutions-title": "Soluções Rápidas",
        "ce-solutions-placeholder": "Por enquanto, não há soluções rápidas, mas se você encontrar algum bug, por favor, denuncie. Assim começaremos a adicionar formas de resolvê-los.",
        "ce-tutorial-ui-title": "Aprenda a interface do Creative Engine",
        "ce-tutorial-ui-desc": "Aprenda a interface do Creative Engine para criar com facilidade. Você descobrirá tudo o que o motor tem no lançamento e para que serve cada ferramenta; assim você saberá melhor como criar o seu videogame.",
        "ce-tutorial-carl-title": "Como ativar o Carl",
        "ce-tutorial-carl-desc": "Aprenda como ativar o Carl, seu companheiro de desenvolvimento que o acompanhará no desenvolvimento de seus videogames.",
        "ce-tutorial-prog-title": "Como programar no Creative Engine",
        "ce-tutorial-prog-desc": "Aprenda a programar seus próprios videogames usando CES (Creative Engine Scripting) e outras ferramentas de codificação.",
        "tutorial-not-available": "Este tutorial ainda não está disponível, você quer ver nosso canal e outros vídeos?",
        // Vid Spri (PT)
        "vs-nav-tutorials": "Tutoriais",
        "ce-docs-leyes-title": "Guia de Componentes (Leis) - Creative Engine",
        "ce-docs-leyes-intro": "No Creative Engine, as Matérias (objetos) ganham vida através das Leis (componentes). Cada Lei adiciona uma funcionalidade específica, como gravidade, renderização de imagem ou lógica de IA. Este guia detalha o uso dos componentes tanto no Inspetor quanto nos Scripts (.ces) usando a sintaxe moderna (sem prefixos como this. ou motor.).",
        "ce-docs-core-title": "1. Componentes Base (Core)",
        "ce-docs-transform-name": "Transform (Transformação)",
        "ce-docs-transform-desc": "Define a posição, rotação e escala de um objeto no espaço 2D.",
        "ce-docs-transform-inspector": "Uso no Inspetor: Edite os valores X e Y para mover o objeto. Use os botões de inversão (Flip) para inverter a imagem.",
        "ce-docs-camera-name": "Camera (Câmera)",
        "ce-docs-camera-desc": "Define a área visível do jogo.",
        "ce-docs-camera-inspector": "Uso no Inspetor: Configure a cor de fundo, o zoom e a máscara de camadas (Culling Mask) para decidir quais objetos esta câmera vê.",
        "ce-docs-render-title": "2. Renderização e Visuais",
        "ce-docs-sprite-name": "SpriteRenderer (Renderizador de Sprite)",
        "ce-docs-sprite-desc": "Mostra uma imagem (.png, .jpg) ou um quadro de uma folha de sprites (.ceSprite).",
        "ce-docs-sprite-inspector": "Uso no Inspetor: Arraste uma imagem para o campo \"Source\". Você pode alterar a cor para tingir a imagem ou ajustar a opacidade.",
        "ce-docs-water-name": "Water (Água)",
        "ce-docs-water-desc": "Simulação física de fluidos baseada em partículas.",
        "ce-docs-water-inspector": "Uso no Inspetor: Define a largura e altura da área de água. Ajuste a densidade (flutuação) e viscosidade.",
        "ce-docs-video-name": "VideoPlayer (Reprodutor de Vídeo)",
        "ce-docs-video-desc": "Reproduz arquivos de vídeo no mundo ou na UI.",
        "ce-docs-video-inspector": "Uso no Inspetor: Suporta formatos .mp4 e .webm. Você pode ativar o loop e ajustar o volume.",
        "ce-docs-physics-title": "3. Físicas 2D",
        "ce-docs-rigidbody-name": "Rigidbody2D (Física)",
        "ce-docs-rigidbody-desc": "Permite que o objeto reaja à gravidade e colisões.",
        "ce-docs-rigidbody-inspector": "Uso no Inspetor: Altere o tipo de corpo para \"Dynamic\" para cair, ou \"Kinematic\" para movê-lo manualmente mas detectar colisões.",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D (Colisores)",
        "ce-docs-collider-desc": "Definem a forma física para os choques.",
        "ce-docs-collider-inspector": "Uso no Inspetor: Ajuste o tamanho ou raio. Se marcar \"Is Trigger\", o objeto não colidirá, mas detectará quando algo entrar em sua área.",
        "ce-docs-ai-title": "4. Inteligencia e Movimento",
        "ce-docs-basicai-name": "BasicAI (IA Básica)",
        "ce-docs-basicai-desc": "Comportamentos automáticos para NPCs e inimigos.",
        "ce-docs-basicai-modes": "Modos: Follow (Segue uma Matéria), Escape (Foge de um alvo), Wander (Caminha aleatoriamente).",
        "ce-docs-patrol-name": "Patrol (Patrulha)",
        "ce-docs-patrol-desc": "Move o objeto entre dois pontos.",
        "ce-docs-ui-title": "5. Interface de Usuário (UI)",
        "ce-docs-canvas-name": "Canvas (Tela)",
        "ce-docs-canvas-desc": "O contêiner principal para todos os elementos de interface.",
        "ce-docs-button-name": "Button (Botão)",
        "ce-docs-button-desc": "Detecta cliques do usuário.",
        "ce-docs-button-inspector": "Uso no Inspetor: Permite definir cores para os estados (Normal, Pressionado, Desativado) ou alterar sprites.",
        "ce-docs-uitext-name": "UIText (Texto UI)",
        "ce-docs-uitext-desc": "Mostra texto na tela com fontes personalizadas.",
        "ce-docs-anim-title": "6. Animação e Áudio",
        "ce-docs-animator-name": "AnimatorController (Controlador)",
        "ce-docs-animator-desc": "Gerencia estados de animação (Caminhar, Saltar, Parado).",
        "ce-docs-animator-inspector": "Uso no Inspetor: Requer um arquivo .ceanim. O \"Smart Mode\" anima automaticamente conforme o movimento.",
        "ce-docs-audio-name": "AudioSource (Fonte de Áudio)",
        "ce-docs-audio-desc": "Reproduz efeitos sonoros ou música.",
        "ce-docs-audio-inspector": "Uso no Inspetor: Suporta Áudio Espacial (o volume diminui se o objeto se afastar).",
        "ce-docs-others-title": "7. Outros Componentes",
        "ce-docs-others-raycast": "RaycastSource (Raio): Lança raios invisíveis para detectar paredes ou inimigos.",
        "ce-docs-others-particles": "ParticleSystem (Partículas): Cria efeitos de fogo, fumaça ou faíscas.",
        "ce-docs-others-parallax": "Parallax: Cria fundos infinitos com profundidade.",
        "ce-docs-others-light": "Light2D (Luzes): Ilumina sua cena com luzes pontuais ou focais.",
        "ce-docs-protip-title": "Pro-Tip de Scripting",
        "ce-docs-protip-desc": "Lembre-se que no Creative Engine, você pode acessar qualquer componente diretamente pelo seu nome. Não precisa usar prefixos.",
        "ce-docs-scripting": "Scripting",
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
        "vs-os-crop-desc": "Biblioteca JavaScript para funcionalidade de recorte de imagens no frontend.",
        "ce-nav-docs-leyes": "Componentes",
        "ce-nav-docs-scripting": "Scripting",
        "ce-nav-docs-libs": "Bibliotecas",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Editores",
        "ce-nav-docs-advanced": "Avançado",
        "ce-nav-docs-config": "Configuração",
        "ce-docs-leyes-inspector": "Uso no Inspetor:",
        "ce-docs-leyes-scripting": "Scripting:",
        "ce-docs-transform-title": "Transform (Transformação)",
        "ce-docs-transform-ins": "Edite os valores X e Y para mover o objeto. Use os botões de inversão (Flip) para inverter a imagem.",
        "ce-docs-camera-title": "Camera (Câmera)",
        "ce-docs-camera-ins": "Configure a cor de fundo, o zoom e a máscara de camadas (Culling Mask).",
        "ce-docs-sprite-title": "SpriteRenderer (Renderizador de Sprite)",
        "ce-docs-sprite-ins": "Arraste uma imagem para o campo 'Source'. Você pode mudar a cor para tingir a imagem ou ajustar la opacidade.",
        "ce-docs-water-title": "Water (Água)",
        "ce-docs-water-ins": "Define a largura e altura da área de água. Ajuste a densidade (flutuação) e viscosidade.",
        "ce-docs-video-title": "VideoPlayer (Reprodutor de Vídeo)",
        "ce-docs-video-ins": "Suporta formatos .mp4 e .webm. Você pode ativar o loop e ajustar o volume.",
        "ce-docs-rigidbody-title": "Rigidbody2D (Física)",
        "ce-docs-rigidbody-ins": "Altere o tipo de corpo para 'Dynamic' para que caia, ou 'Kinematic' para movê-lo manualmente.",
        "ce-docs-colliders-title": "BoxCollider2D / CircleCollider2D",
        "ce-docs-colliders-desc": "Definem a forma física para os choques.",
        "ce-docs-colliders-ins": "Ajuste o tamanho ou raio. Se marcar 'Is Trigger', o objeto detectará sem colidir fisicamente.",
        "ce-docs-basicai-title": "BasicAI (IA Básica)",
        "ce-docs-patrol-title": "Patrol (Patrulha)",
        "ce-docs-canvas-title": "Canvas (Lienzo)",
        "ce-docs-button-title": "Button (Botão)",
        "ce-docs-uitext-title": "UIText (Texto UI)",
        "ce-docs-animator-title": "AnimatorController (Controlador)",
        "ce-docs-audio-title": "AudioSource (Fonte de Áudio)",
        "ce-docs-other-title": "7. Outros Componentes",
        "ce-docs-other-list": "RaycastSource (Raio), ParticleSystem (Partículas), Parallax, Light2D (Luzes).",
        "ce-docs-tip-title": "Pro-Tip de Scripting",
        "ce-docs-tip-desc": "Lembre-se que no Creative Engine, você pode acessar qualquer componente diretamente pelo seu nome. Você não precisa usar prefixos.",
        "ce-docs-scripting-title": "Guia Mestre de Scripting (CES)",
        "ce-docs-scripting-intro": "O Creative Engine utiliza CES (Creative Engine Script), uma linguagem poderosa baseada em JavaScript, mas simplificada para criadores de jogos.",
        "ce-docs-scripting-core-title": "Conceitos Fundamentais",
        "ce-docs-scripting-import": "Todo script deve começar com a instrução de conexão com o motor: ve motor;",
        "ce-docs-scripting-access": "Acesso Direto: Você NÃO precisa escrever this. ou mtr. para acessar os componentes.",
        "ce-docs-scripting-vars-title": "Variáveis Públicas (Inspetor)",
        "ce-docs-scripting-vars-desc": "Defina variáveis para que apareçam no Inspetor.",
        "ce-docs-scripting-input-title": "Entrada e Movimento",
        "ce-docs-scripting-functions-title": "Funções Especiais",
        "ce-docs-libs-title": "Instalação de Bibliotecas (.celib)",
        "ce-docs-libs-intro": "As bibliotecas estendem as funcionalidades do motor (ex: Multijogador, Inventários).",
        "ce-docs-libs-step-1": "Baixe o arquivo .celib.",
        "ce-docs-libs-step-2": "Mova-o para a pasta /lib do seu projeto.",
        "ce-docs-libs-step-3": "O motor irá carregá-lo automaticamente ao iniciar.",
        "ce-docs-carl-title": "Execução com Carl IA",
        "ce-docs-carl-intro": "O Carl pode automatizar tarefas complexas usando IA.",
        "ce-docs-carl-modes": "Modos de Execução:",
        "ce-docs-carl-mode-1": "Modo Comando: Executa ações imediatas no editor.",
        "ce-docs-carl-mode-2": "Modo Scripting: Ajuda a escrever e depurar código CES.",
        "ce-docs-terminal-title": "Guia do Terminal",
        "ce-docs-terminal-intro": "O Terminal é uma ferramenta avançada para interagir com o motor através de comandos de texto.",
        "ce-docs-terminal-activate": "Como Ativar o Terminal",
        "ce-docs-terminal-fs-title": "1. Comandos do Sistema de Arquivos",
        "ce-docs-terminal-scene-title": "2. Comandos de Cena",
        "ce-docs-advanced-title": "Guia Avançado: Projetos, Cenas e Build",
        "ce-docs-advanced-intro": "Este guia cobre os aspectos fundamentais da gestão de ativos, design de níveis e publicação final do jogo.",
        "ce-docs-advanced-struct-title": "1. Estrutura do Projeto",
        "ce-docs-advanced-scenes-title": "2. Gestão de Cenas (.ceScene)",
        "ce-docs-advanced-build-title": "3. O Sistema de Build (Publicación)",
        "ce-docs-editors-title": "Guia de Editores Visuais",
        "ce-docs-editors-intro": "O Creative Engine inclui uma suíte de ferramentas visuais para gerir gráficos, animações e níveis de forma intuitiva.",
        "ce-docs-editors-sprite-title": "1. Editor de Sprites (Sprite Slicer)",
        "ce-docs-editors-anim-title": "2. Editor de Animações (.cea)",
        "ce-docs-editors-tilemap-title": "3. Editor de Tilemap",
        "ce-docs-config-title": "Guia de Configuração e Atmosfera",
        "ce-docs-config-intro": "Aprenda como personalizar seu fluxo de trabalho e configurar os parâmetros técnicos do seu projeto.",
        "ce-docs-config-project-title": "1. Configuração do Projeto",
        "ce-docs-config-ambient-title": "2. Controle de Atmosfera",
        "ce-docs-carl-keys": "Configure sua chave em Editar > Preferências > IA. Suportamos Google Gemini (Grátis), OpenAI e Anthropic.",
        "ce-docs-carl-skill-1": "\"Crie um objeto chamado Jogador com SpriteRenderer.\"",
        "ce-docs-carl-skill-2": "\"Crie um script que mova o jogador com as setas.\"",
        "ce-docs-terminal-ls": "ls: Listar arquivos.",
        "ce-docs-terminal-cd": "cd <pasta>: Mudar de pasta.",
        "ce-docs-terminal-clear": "clear: Limpar terminal.",
        "ce-docs-terminal-act-1": "Janela > Terminal",
        "ce-docs-terminal-act-2": "Painel Inferior > Aba Terminal.",
        "ce-docs-advanced-struct-1": "/Assets: Imagens, sons, scripts.",
        "ce-docs-advanced-struct-2": "/lib: Bibliotecas (.celib).",
        "ce-docs-advanced-struct-3": "project.ceconfig: Configuração técnica.",
        "ce-docs-advanced-scenes-desc": "Use Ctrl + S para salvar. As cenas (.ceScene) contêm todos os objetos e luzes.",
        "ce-docs-advanced-build-desc": "Gera um pacote web independente (.zip) pronto para hospedagem.",
        "ce-docs-editors-sprite-desc": "Recorte imagens grandes em múltiplos sprites pequenos.",
        "ce-docs-editors-anim-desc": "Crie sequências (.cea) usando uma linha do tempo.",
        "ce-docs-editors-tilemap-desc": "Desenhe níveis baseados em grade com pincéis e camadas.",
        "ce-docs-config-project-desc": "Gerencia Sorting Layers, Collision Layers e Tags.",
        "ce-docs-config-ambient-desc": "Ciclo Dia/Noite, filtros de cor e luzes ambiente.",
        "ce-docs-transform-code": "posicao.x += 5; // Move para a direita\nrotacao += 45;  // Roda 45 grados\nescala.x = 2;    // Dobra o tamanho horizontal\ninverterH = verdadero; // Inverte horizontalmente",
        "ce-docs-camera-code": "camara.orthographicSize = 10; // Altera o zoom\ncamara.backgroundColor = \"#ff0000\"; // Fundo vermelho",
        "ce-docs-sprite-code": "renderizadorDeSprite.color = \"#00ff00\"; // Tinta verde\nrenderizadorDeSprite.opacity = 0.5;      // Semi-transparente\nrenderizadorDeSprite.spriteName = \"Salto\"; // Altera o sprite",
        "ce-docs-water-code": "agua.densidad = 2.0; // Objetos flutuarão mais\nagua.mostrarMares = verdadero;",
        "ce-docs-video-code": "reprodutorDeVideo.reproduzir();\nreprodutorDeVideo.pausar();\nreprodutorDeVideo.volumen = 0.8;",
        "ce-docs-rigidbody-code": "fisica.applyImpulse(novo Vector2(0, -10)); // Salto\nfisica.velocity.x = 5; // Velocidade constante\nfisica.gravityScale = 0; // Desativa gravidade",
        "ce-docs-collider-code": "se (estaTocandoTag(\"Chao\")) {\n    imprimir(\"No chao\");\n}",
        "ce-docs-basicai-code": "iaBasica.speed = 250;\niaBasica.behavior = \"Follow\";\niaBasica.target = buscar(\"Jogador\");",
        "ce-docs-patrol-code": "patrulla.distancia = 500;\npatrulla.velocidad = 100;",
        "ce-docs-canvas-code": "tela.scaleChildren = verdadero;",
        "ce-docs-button-code": "aoClicar() {\n    imprimir(\"Botão pressionado!\");\n}",
        "ce-docs-uitext-code": "textoUI.text = \"Pontos: \" + pontos;\ntextoUI.fontSize = 40;",
        "ce-docs-animator-code": "controlador.play(\"Atacar\"); // Força um estado",
        "ce-docs-audiosource-code": "fuenteDeAudio.reproduzir();\nfuenteDeAudio.loop = verdadero;\nreproducir.Explosion(); // Atalho proxy",
        "ce-docs-protip-code": "ve motor;\n\npublico numero forcaSalto = 12;\n\naoAtualizar(delta) {\n    se (teclaRecemPressionada(\"Space\") e estaTocandoTag(\"Chao\")) {\n        fisica.applyImpulse(novo Vector2(0, -forcaSalto));\n        reproducir.Salto(); // Chama o som ou animação\n    }\n}",
        "ce-docs-scripting-import-code": "ve motor;",
        "ce-docs-scripting-input-code": "se (teclaPressionada(\"Space\")) {\n    fisica.applyImpulse(novo Vector2(0, 10));\n}",
        "ce-docs-scripting-functions-code": "buscar(\"Inimigo\");\ndestruir(estaMateria);\ninstanciar(balaPrefab, posicao);",
        "ce-docs-scripting-vars-code": "publico numero velocidade = 5;\npublico texto nomeJogador = \"Herói\";\npublico booleano eInvencivel = falso;\npublico Materia objetivo;\npublico Sprite icone;\npublico Audio somSalto;",
        "ce-docs-scripting-events-code": "aoComecar() {\n    imprimir(\"Olá Mundo!\");\n}\n\naoAtualizar(delta) {\n    // Executa a cada frame\n}\n\naoClicar() {\n}",
        "ce-docs-scripting-example-code": "ve motor;\npublico numero velocidad = 300;\n\naoAtualizar(delta) {\n    variavel movX = 0;\n    se (teclaPressionada(\"ArrowRight\")) movX = 1;\n    senao se (teclaPressionada(\"ArrowLeft\")) movX = -1;\n\n    fisica.velocity.x = movX * (velocidade * delta);\n}",
        "ce-docs-libs-ui-code": "CreativeEngine.API.registrarJanela({\n    nombre: \"Minha Ferramenta\",\n    aoAbrir: function(painel) {\n        painel.texto(\"Olá!\");\n        painel.boton(\"Clique\", () => alert(\"OK\"));\n    }\n});",
        "ce-docs-libs-runtime-code": "const MiLib = {\n    saudar: () => console.log(\"Olá da Lib\")\n};\nCreativeEngine.API.registrarRuntimeAPI(\"MiLib\", MiLib);",
        "ce-docs-terminal-code": "mkobj Bala\naddcomp 10 SpriteRenderer\nsetprop 10 Transform position.x 100",
        "ce-docs-not-available": "A documentação não está disponível no momento neste idioma.",
        "ce-docs-tech-title": "5. Sistemas Técnicos",
        "ce-docs-particles-title": "Partículas",
        "ce-docs-particles-desc": "Cria efeitos visuais complexos como fogo ou fumo.",
        "ce-docs-particles-code": "particulas.emitir(10);\nparticulas.detener();",
        "ce-docs-post-title": "Pós-processamento",
        "ce-docs-post-desc": "Filtros visuais globais como Bloom ou Correção de Cor.",
        "ce-docs-post-code": "posProcessamento.bloom = verdadero;\nposProcessamento.vignette = 0.5;",
        "ce-docs-audio-code": "som.reproducir(\"Explosion\");\nsom.volumenPrincipal = 1.0;",
        "ce-docs-opt-title": "Otimização",
        "ce-docs-opt-desc": "Ferramentas para melhorar o desempenho do jogo.",
        "btn-ad": "Ver um anúncio para nos apoiar",
        "btn-see-support": "Ver Colaboradores",
        "btn-send": "Enviar Reporte",
        "btn-send-claim": "Enviar Reclamação",
        "btn-send-opinion": "Publicar Opinião",
        "btn-support": "Apoiar",
        "ce-ces-desc": "Projetado para quem já é especialista na criação de videogames e gosta de programar com código puro. Feito com JS e inspirado em C#, JS e Python. Permite programar completamente em espanhol, inglês, português, russo e chinês (e será estendido a mais idiomas).",
        "ce-claim-reason": "Razão da reclamação",
        "ce-docs-audiosource-desc": "Reproduz efeitos sonoros ou música.",
        "ce-docs-audiosource-inspector": "Uso no Inspetor: Suporta Áudio Espacial (o volume diminui se o objeto se afastar).",
        "ce-docs-audiosource-name": "AudioSource (Fonte de Áudio)",
        "ce-docs-carl-act-1": "Botão Superior: Ícone do robô 🤖 (Carl)",
        "ce-docs-carl-act-2": "Atalho: Shift + Ctrl + L",
        "ce-docs-carl-activate-title": "Como Ativar o Carl IA",
        "ce-docs-carl-config-title": "Configuração (Chaves API)",
        "ce-docs-carl-modes-desc": "O Carl pode trabalhar no modo \"Assistente\" (guia você) ou \"Autônomo\" (faz as alterações por você).",
        "ce-docs-carl-modes-title": "Modos de Execução",
        "ce-docs-carl-skills-title": "Habilidades Autônomas",
        "ce-docs-libs-install-title": "Como Criar e Instalar uma Biblioteca",
        "ce-docs-libs-runtime-title": "2. Bibliotecas de Runtime (Novas Funções)",
        "ce-docs-libs-ui-title": "1. Bibliotecas de Interface (Ferramentas do Editor)",
        "ce-docs-scripting-events-title": "Eventos de Ciclo de Vida",
        "ce-docs-scripting-example-title": "Exemplos Práticos",
        "ce-donate-2": "Isso nos financiará para seguir em frente e pagar servidores para que, no futuro, você possa usar o Carl IA sem depender de uma API externa gratuitamente.",
        "ce-donate-claim": "Se em algum caso você quiser fazer uma reclamação, pode fazê-lo em Reclamações.",
        "ce-donate-intro": "Seu apoio é o que mantém este projeto vivo e gratuito para todos. Com total transparência, compartilhamos que manter o Creative Engine requer cobrir custos de servidores e desenvolvimento para que continue sendo uma ferramenta acessível a todos sem barreiras econômicas. Suas doações ajudarão outros a usarem nossas ferramentas gratuitamente.",
        "ce-human-desc": "Aqui você só terá que falar com o motor, dizer o que quer que o script faça e o motor entenderá você.",
        "ce-info-1": "O Creative Engine foi projetado para todo o público. Não importa se você é especialista, novato ou não tem experiência nenhuma, o Creative Engine ajuda e ensina você.",
        "ce-info-2": "Nosso motor foi inspirado no Unity, mas baseia-se em matérias e leis. As matérias podem ser qualquer coisa no seu jogo e as leis tudo o que define o comportamento de cada coisa no seu jogo; são um conjunto de regras que tornam o seu jogo único e fazem dele o que você quer que seja.",
        "ce-info-3": "Você pode criar um jogo em menos de 1 hora e sem escrever uma única linha de código. O motor inclui vários componentes básicos que ajudam você a criar seus jogos. Por ser web, você pode publicá-los em várias plataformas e para vários dispositivos.",
        "ce-info-4": "Nosso motor possui um sistema de biblioteca que permite aos desenvolvedores criar várias bibliotecas. Se você quiser, por exemplo, uma IA para o seu jogo, não precisa fazer uma IA avançada do zero; basta baixar a biblioteca e pronto.",
        "ce-info-5": "Nosso motor tem integrado o Carl IA, que ajudará você a tornar suas ideias realidade e guiará você em cada etapa do seu desenvolvimento.",
        "ce-info-free": "O Creative Engine é 100% gratuito. Não reivindicamos direitos sobre nenhum jogo feito com ele; na verdade, quanto mais você cria, mais felizes ficamos.",
        "ce-info-open": "O próprio motor estará disponível em código aberto para todos aqueles que quiserem modificá-lo ao seu gosto.",
        "ce-info-team": "O Creative Engine está desenvolvendo um sistema que permitirá criar videogames em equipe. Muito bom para escolas que querem ensinar o desenvolvimento de videogames aos alunos ou pequenos estúdios.",
        "ce-info-vidspri": "O Creative Engine tem integrado o Vid Spri, uma ferramenta que permite criar animações e som para seus videogames.",
        "ce-license-1": "Os jogos feitos estão disponíveis sob a licença CLG1 (Carley Gratuito).",
        "ce-license-2": "O licenciado tem todo o direito de usar como quiser em todo o seu produto. Não reivindicamos nenhuma porcentagem.",
        "ce-license-3": "Não somos responsáveis; ou seja, não temos a obrigação de resolver bugs, falhas ou erros que o produto possa apresentar.",
        "ce-license-4": "Não temos direitos sobre o produto do usuário, a menos que este nos permita.",
        "ce-license-date": "Última atualização: 4 de março de 2026",
        "ce-nav-claims": "Reclamações",
        "ce-nav-collabs": "Colaboradores",
        "ce-nav-credits": "Créditos",
        "ce-nav-donations": "Doações",
        "ce-nav-info": "Informação",
        "ce-nav-join": "Junte-se e Siga-nos",
        "ce-nav-license": "Licença",
        "ce-nav-opinions": "Opiniões",
        "ce-nav-privacy": "Privacidade",
        "ce-nav-report": "Reportar",
        "ce-privacy-main": "Não guardamos nenhum outro tipo de dados que não seja a informação necessária para a sua conta e opiniões em nossos servidores, etc.",
        "ce-scratch-desc": "Poderão criar a lógica do jogo arrastando blocos. Muito bom para quem está começando. Ainda está em desenvolvimento.",
        "ce-tutorial-desc": "Aprenda os fundamentos do Creative Engine e comece sua aventura como desenvolvedor.",
        "ce-tutorial-title": "Como criar seu primeiro jogo",
        "ce-why-1": "O motor está em vários idiomas diferentes e possui 3 formas de codificar:",
        "ce-why-title": "Por que usar o Creative Engine?",
        "claim-hint": "Você pode reclamar na mesma semana em que fez as doações; posteriormente não garantimos a devolução.",
        "credits-gemini": "Finalmente, agradecemos ao Google AI Studio pelo seu generoso plano e ao seu modelo Gemini para o uso gratuito do Carl IA.",
        "credits-main": "Este projeto não existiria sem a incrível ajuda de Google Jules, que fez grande parte do projeto. Agradecemos ao Google pelos seus generosos planos gratuitos.",
        "credits-ms": "Também agradecemos à Microsoft Copilot, que também contribuiu significativamente para o projeto.",
        "field-message": "Mensagem",
        "field-opinion": "Sua Opinião",
        "field-photos": "Fotos (Máx 5)",
        "opinion-hint": "Leremos suas opiniões e consideraremos todas aquelas com mais curtidas em futuras atualizações.",
        "support-action-title": "Apoiar projeto",
    },
    ru: {
        welcome: "Добро пожаловать, мы рады видеть вас здесь",
        "btn-yes": "Да",
        "btn-no": "Нет",
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
        "ce-nav-tutorials": "Обучение",
        "ce-nav-solutions": "Быстрые решения",
        "ce-nav-docs": "Документация",
        "ce-nav-docs-leyes": "Компоненты",
        "ce-nav-docs-scripting": "Скриптинг CES",
        "ce-nav-docs-libs": "Библиотеки",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Терминал",
        "ce-nav-docs-editors": "Редакторы",
        "ce-nav-docs-advanced": "Продвинутый",
        "ce-nav-docs-config": "Конфигурация",
        "ce-solutions-title": "Быстрые решения",
        "ce-solutions-placeholder": "На данный момент быстрых решений нет, но если вы обнаружите какие-либо ошибки, пожалуйста, сообщите о них. Так мы начнем добавлять способы их решения.",
        "ce-tutorial-ui-title": "Изучите интерфейс Creative Engine",
        "ce-tutorial-ui-desc": "Изучите интерфейс Creative Engine, чтобы с легкостью создавать игры. Вы узнаете обо всем, что есть в движке на момент запуска, и для чего нужен каждый инструмент; так вы будете лучше знать, как создать свою видеоигру.",
        "ce-tutorial-carl-title": "Как активировать Карла",
        "ce-tutorial-carl-desc": "Узнайте, как активировать Карла, вашего компаньона по разработке, который будет сопровождать вас в создании ваших видеоигр.",
        "ce-tutorial-prog-title": "Как программировать в Creative Engine",
        "ce-tutorial-prog-desc": "Научитесь программировать свои собственные видеоигры, используя CES (Creative Engine Scripting) и другие инструменты кодирования.",
        "tutorial-not-available": "Этот урок еще не доступен, вы хотите посмотреть наш канал и другие видео?",
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
        "vs-os-crop-desc": "Библиотека JavaScript для обрезки изображений на фронтенде.",
        "ce-docs-transform-code": "poziciya.x += 5; // Dvizhenie vpravo\nrotaciya += 45;  // Povorot na 45 gradusov\nmasshtab.x = 2;   // Udvoenie gorizontalnogo razmera\notrazitG = istina; // Otrazit gorizontalno",
        "ce-docs-camera-code": "kamera.orthographicSize = 10; // Izmenit zum\nkamera.backgroundColor = \"#ff0000\"; // Krasnyj fon",
        "ce-docs-sprite-code": "renderRenderer.color = \"#00ff00\"; // Zelenyj ottenok\nrenderRenderer.opacity = 0.5;      // Poluprozrachnyj\nrenderRenderer.spriteName = \"Pryzhok\"; // Smenit спрайт",
        "ce-docs-water-code": "voda.plotnost = 2.0; // Obekty budut plavat luchshe\nvoda.pokazatPrilivy = istina;",
        "ce-docs-video-code": "videoPleer.play();\nvideoPleer.pause();\nvideoPleer.volume = 0.8;",
        "ce-docs-rigidbody-code": "fizika.applyImpulse(novyj Vector2(0, -10)); // Pryzhok\nfizika.velocity.x = 5; // Postoyannaya skorost\nfizika.gravityScale = 0; // Otkluchit gravitaciyu",
        "ce-docs-collider-code": "esli (kasaetsyaTaga(\"Pol\")) {\n    pechat(\"Na polu\");\n}",
        "ce-docs-basicai-code": "iaBasica.speed = 250;\niaBasica.behavior = \"Follow\";\niaBasica.target = najti(\"Igrok\");",
        "ce-docs-patrol-code": "patrul.distanciya = 500;\npatrul.skorost = 100;",
        "ce-docs-canvas-code": "holst.scaleChildren = istina;",
        "ce-docs-button-code": "priNazhatii() {\n    pechat(\"Knopka nazhata!\");\n}",
        "ce-docs-uitext-code": "tekstUI.text = \"Ochki: \" + ochki;\ntekstUI.fontSize = 40;",
        "ce-docs-animator-code": "kontroller.play(\"Ataka\"); // Prinuditelnoe sostoyanie",
        "ce-docs-audiosource-code": "istochnikZvuka.play();\nistochnikZvuka.loop = istina;\nvosproizvesti.Explosion(); // Proksi-shortcut",
        "ce-docs-protip-code": "dvigatel motor;\n\npublichnyj chislo silaPryzhka = 12;\n\npriObnovlenii(delta) {\n    esli (klavishaTolkoChtoNazhata(\"Space\") i kasaetsyaTaga(\"Pol\")) {\n        fizika.applyImpulse(novyj Vector2(0, -silaPryzhka));\n        vosproizvesti.Salto(); // Vyzov zvuka ili animacii\n    }\n}",
        "ce-docs-scripting-import-code": "dvigatel motor;",
        "ce-docs-scripting-input-code": "esli (klavishaNazhata(\"Space\")) {\n    fizika.applyImpulse(novyj Vector2(0, 10));\n}",
        "ce-docs-scripting-functions-code": "najti(\"Vrag\");\nunichtozhit(etaMateriya);\nsozdat(pulyaPrefab, poziciya);",
        "ce-docs-scripting-vars-code": "publichnyj logicheskij neuyazvim = lozh;\npublichnyj chislo skorost = 5;\npublichnyj tekst imyaIgroka = \"Geroj\";\npublichnyj Materiya cel;\npublichnyj Sprite ikonka;\npublichnyj Audio zvukPryzhka;",
        "ce-docs-scripting-events-code": "priStarte() {\n    pechat(\"Privet Mir!\");\n}\n\npriObnovlenii(delta) {\n    // Vypolnyaetsya kazhdyj kadr\n}\n\npriNazhatii() {\n}",
        "ce-docs-scripting-example-code": "dvigatel motor;\npublichnyj chislo skorost = 300;\n\npriObnovlenii(delta) {\n    peremennaya movX = 0;\n    esli (klavishaNazhata(\"ArrowRight\")) movX = 1;\n    inache esli (klavishaNazhata(\"ArrowLeft\")) movX = -1;\n\n    fizika.velocity.x = movX * (skorost * delta);\n}",
        "ce-docs-libs-ui-code": "CreativeEngine.API.registrirovatOkno({\n    nazvanie: \"Moj Instrument\",\n    priOtkrytii: function(panel) {\n        panel.tekst(\"Privet!\");\n        panel.knopka(\"Click\", () => alert(\"OK\"));\n    }\n});",
        "ce-docs-libs-runtime-code": "const MiLib = {\n    privet: () => console.log(\"Privet iz Lib\")\n};\nCreativeEngine.API.registrirovatRuntimeAPI(\"MiLib\", MiLib);",
        "ce-docs-terminal-code": "mkobj Bullet\naddcomp 10 SpriteRenderer\nsetprop 10 Transform position.x 100",
        "ce-docs-not-available": "Документация на этом языке в данный момент недоступна.",
        "ce-docs-tech-title": "5. Технические системы",
        "ce-docs-particles-title": "Частицы",
        "ce-docs-particles-desc": "Создавайте сложные визуальные эффекты, такие как огонь или дым.",
        "ce-docs-particles-code": "chasticy.emit(10);\nchasticy.stop();",
        "ce-docs-post-title": "Пост-обработка",
        "ce-docs-post-desc": "Глобальные визуальные фильтры, такие как Bloom или коррекция цвета.",
        "ce-docs-post-code": "postProcesado.bloom = istina;\npostProcessing.vignette = 0.5;",
        "ce-docs-audio-title": "Аудио",
        "ce-docs-audio-desc": "Управление музыкой и звуковыми эффектами.",
        "ce-docs-audio-code": "zvuk.play(\"Explosion\");\nzvuk.masterVolume = 1.0;",
        "ce-docs-opt-title": "Оптимизация",
        "ce-docs-opt-desc": "Инструменты для повышения производительности игры.",
        "ce-docs-core-title": "1. Базовые компоненты (Core)",
        "ce-docs-transform-name": "Transform (Трансформация)",
        "ce-docs-transform-desc": "Определяет положение, поворот и масштаб объекта в 2D пространстве.",
        "ce-docs-transform-inspector": "Использование в инспекторе: Редактируйте значения X и Y для перемещения объекта. Используйте кнопки отражения (Flip) для инверсии изображения.",
        "ce-docs-camera-name": "Camera (Камера)",
        "ce-docs-camera-desc": "Определяет видимую область игры.",
        "ce-docs-camera-inspector": "Использование в инспекторе: Настройте цвет фона, зум и маску слоев (Culling Mask), чтобы решить, какие объекты видит эта камера.",
        "ce-docs-render-title": "2. Рендеринг и визуальные эффекты",
        "ce-docs-sprite-name": "SpriteRenderer (Рендерер спрайтов)",
        "ce-docs-sprite-desc": "Отображает изображение (.png, .jpg) или кадр из атласа спрайтов (.ceSprite).",
        "ce-docs-sprite-inspector": "Использование в инспекторе: Перетащите изображение в поле \"Source\". Вы можете изменить цвет для тонировки изображения или настроить прозрачность.",
        "ce-docs-water-name": "Water (Вода)",
        "ce-docs-water-desc": "Физическая симуляция жидкости на основе частиц.",
        "ce-docs-water-inspector": "Использование в инспекторе: Определите ширину и высоту области воды. Настройте плотность (плавучесть) и вязкость.",
        "ce-docs-video-name": "VideoPlayer (Видеоплеер)",
        "ce-docs-video-desc": "Воспроизводит видеофайлы в мире или в пользовательском интерфейсе.",
        "ce-docs-video-inspector": "Использование в инспекторе: Поддерживает форматы .mp4 и .webm. Вы можете включить зацикливание (loop) и настроить громкость.",
        "ce-docs-physics-title": "3. 2D Физика",
        "ce-docs-rigidbody-name": "Rigidbody2D (Физика)",
        "ce-docs-rigidbody-desc": "Позволяет объекту реагировать на гравитацию и столкновения.",
        "ce-docs-rigidbody-inspector": "Использование в инспекторе: Измените тип тела на \"Dynamic\", чтобы оно падало, или на \"Kinematic\", чтобы перемещать его вручную, но при этом обнаруживать столкновения.",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D (Коллайдеры)",
        "ce-docs-collider-desc": "Определяют физическую форму для столкновений.",
        "ce-docs-collider-inspector": "Использование в инспекторе: Настройте размер или радиус. Если вы отметите \"Is Trigger\", объект не будет сталкиваться, но будет обнаруживать, когда что-то входит в его область.",
        "ce-docs-ai-title": "4. Интеллект и движение",
        "ce-docs-basicai-name": "BasicAI (Базовый ИИ)",
        "ce-docs-basicai-desc": "Автоматическое поведение для NPC и врагов.",
        "ce-docs-basicai-modes": "Режимы: Follow (Следовать за объектом), Escape (Убегать от цели), Wander (Случайное блуждание).",
        "ce-docs-patrol-name": "Patrol (Патруль)",
        "ce-docs-ui-title": "5. Пользовательский интерфейс (UI)",
        "ce-docs-canvas-name": "Canvas (Холст)",
        "ce-docs-canvas-desc": "Основной контейнер для всех элементов интерфейса.",
        "ce-docs-button-name": "Button (Кнопка)",
        "ce-docs-button-desc": "Обнаруживает клики пользователя.",
        "ce-docs-button-inspector": "Использование в инспекторе: Позволяет определять цвета для состояний (обычное, нажатое, отключенное) или менять спрайты.",
        "ce-docs-uitext-name": "UIText (Текст UI)",
        "ce-docs-uitext-desc": "Отображает текст на экране с использованием пользовательских шрифтов.",
        "ce-docs-anim-title": "6. Анимация и звук",
        "ce-docs-animator-name": "AnimatorController (Контроллер анимации)",
        "ce-docs-animator-desc": "Управляет состояниями анимации (ходьба, прыжок, покой).",
        "ce-docs-animator-inspector": "Использование в инспекторе: Требуется файл .ceanim. \"Smart Mode\" анимирует автоматически в зависимости от движения.",
        "ce-docs-audio-name": "AudioSource (Источник звука)",
        "ce-docs-audio-inspector": "Использование в инспекторе: Поддерживает пространственный звук (громкость падает при удалении объекта).",
        "ce-docs-others-title": "7. Другие компоненты",
        "ce-docs-others-raycast": "RaycastSource (Лучи): Испускает невидимые лучи для обнаружения стен или врагов.",
        "ce-docs-others-particles": "ParticleSystem (Система частиц): Создает эффекты огня, дыма или искр.",
        "ce-docs-others-parallax": "Parallax (Параллакс): Создает бесконечные фоны с глубиной.",
        "ce-docs-others-light": "Light2D (Свет): Освещает вашу сцену точечными или направленными источниками света.",
        "ce-docs-protip-title": "Профессиональный совет по скриптингу",
        "ce-docs-protip-desc": "Помните, что в Creative Engine вы можете получить доступ к любому компоненту напрямую по его имени. Префиксы не требуются.",
        "btn-ad": "Посмотреть рекламу, чтобы поддержать нас",
        "btn-see-support": "Посмотреть участников",
        "btn-send": "Отправить отчет",
        "btn-send-claim": "Отправить претензию",
        "btn-send-opinion": "Опубликовать отзыв",
        "btn-support": "Поддержать",
        "ce-ces-desc": "Предназначен для тех, кто уже является экспертом в создании видеоигр и любит программировать на чистом коде. Создан на JS и вдохновлен C#, JS и Python. Позволяет программировать полностью на испанском, английском, португальском, русском и китайском языках (и будет расширен на другие языки).",
        "ce-claim-reason": "Причина претензии",
        "ce-docs-advanced-build-desc": "Создает автономный веб-пакет (.zip), готовый к хостингу.",
        "ce-docs-advanced-build-title": "3. Система сборки",
        "ce-docs-advanced-intro": "Управление активами, дизайн уровней и публикация.",
        "ce-docs-advanced-scenes-desc": "Используйте Ctrl + S для сохранения. Сцены (.ceScene) содержат все объекты и источники света.",
        "ce-docs-advanced-scenes-title": "2. Управление сценами",
        "ce-docs-advanced-struct-1": "/Assets: Изображения, звуки, скрипты.",
        "ce-docs-advanced-struct-2": "/lib: Библиотеки (.celib).",
        "ce-docs-advanced-struct-3": "project.ceconfig: Техническая конфигурация.",
        "ce-docs-advanced-struct-title": "1. Структура проекта",
        "ce-docs-advanced-title": "Продвинутое руководство",
        "ce-docs-audiosource-desc": "Воспроизводит звуковые эффекты или музыку.",
        "ce-docs-audiosource-inspector": "Использование в инспекторе: Поддерживает пространственный звук (громкость падает при удалении объекта).",
        "ce-docs-audiosource-name": "AudioSource (Источник звука)",
        "ce-docs-carl-act-1": "Верхняя кнопка: Иконка робота 🤖 (Carl)",
        "ce-docs-carl-act-2": "Горячая клавиша: Shift + Ctrl + L",
        "ce-docs-carl-activate-title": "Как активировать Carl IA",
        "ce-docs-carl-config-title": "Конфигурация (API ключи)",
        "ce-docs-carl-intro": "Carl IA — это интеллектуальный агент, способный управлять редактором, создавать файлы и помогать вам создавать игру шаг за шагом.",
        "ce-docs-carl-keys": "Настройте свой ключ в Правка > Настройки > ИИ. Мы поддерживаем Google Gemini (бесплатно), OpenAI и Anthropic.",
        "ce-docs-carl-modes-desc": "Карл может работать в режиме «Ассистент» (направляет вас) или «Автономный» (вносит изменения за вас).",
        "ce-docs-carl-modes-title": "Режимы выполнения",
        "ce-docs-carl-skill-1": "«Создай объект с именем Player с SpriteRenderer».",
        "ce-docs-carl-skill-2": "«Создай скрипт, который перемещает игрока с помощью стрелок».",
        "ce-docs-carl-skills-title": "Автономные навыки",
        "ce-docs-carl-title": "Руководство по Carl IA: Ваш автономный помощник",
        "ce-docs-config-ambient-desc": "Цикл день/ночь, цветовые фильтры и окружающее освещение.",
        "ce-docs-config-ambient-title": "2. Контроль окружения",
        "ce-docs-config-intro": "Настройте свой рабочий процесс и атмосферу.",
        "ce-docs-config-project-desc": "Управление слоями сортировки, слоями столкновений и тегами.",
        "ce-docs-config-project-title": "1. Конфигурация проекта",
        "ce-docs-config-title": "Конфигурация и окружение",
        "ce-docs-editors-anim-desc": "Создавайте последовательности (.cea) с помощью временной шкалы.",
        "ce-docs-editors-anim-title": "2. Редактор анимации",
        "ce-docs-editors-intro": "Набор визуальных инструментов для управления графикой, анимацией и уровнями.",
        "ce-docs-editors-sprite-desc": "Разрезайте большие изображения на несколько маленьких спрайтов.",
        "ce-docs-editors-sprite-title": "1. Редактор спрайтов",
        "ce-docs-editors-tilemap-desc": "Проектируйте уровни на основе сетки с помощью кистей и слоев.",
        "ce-docs-editors-tilemap-title": "3. Редактор тайлсетов",
        "ce-docs-editors-title": "Руководство по визуальным редакторам",
        "ce-docs-leyes-intro": "В Creative Engine Материи (объекты) оживают благодаря Законам (компонентам). Каждый Закон добавляет определенную функциональность, такую как гравитация, рендеринг изображения или логика ИИ.",
        "ce-docs-leyes-scripting": "Скриптинг:",
        "ce-docs-leyes-title": "Руководство по компонентам (Законы) — Creative Engine",
        "ce-docs-libs-install-title": "Как создать и установить библиотеку",
        "ce-docs-libs-intro": "Библиотеки (.celib) позволяют расширять как интерфейс редактора, так и возможности программирования.",
        "ce-docs-libs-runtime-title": "2. Runtime библиотеки (Новые функции)",
        "ce-docs-libs-title": "Руководство по библиотекам и расширяемости",
        "ce-docs-libs-ui-title": "1. Интерфейсные библиотеки (инструменты редактора)",
        "ce-docs-patrol-desc": "Перемещает объект между двумя точками.",
        "ce-docs-scripting-access": "Прямой доступ: Вам НЕ нужно писать this. или mtr. для доступа к компонентам.",
        "ce-docs-scripting-core-title": "Фундаментальные концепции",
        "ce-docs-scripting-events-title": "События жизненного цикла",
        "ce-docs-scripting-example-title": "Практические примеры",
        "ce-docs-scripting-functions-title": "Специальные функции",
        "ce-docs-scripting-import": "Каждый скрипт должен начинаться с команды подключения к движку: ve motor;",
        "ce-docs-scripting-input-title": "Ввод (Input) и движение",
        "ce-docs-scripting-intro": "Creative Engine использует CES (Creative Engine Script), мощный язык, основанный на JavaScript, но упрощенный для создателей видеоигр.",
        "ce-docs-scripting-title": "Мастер-руководство по скриптингу (CES)",
        "ce-docs-scripting-vars-desc": "Чтобы переменная появилась в Инспекторе, используйте ключевое слово publico.",
        "ce-docs-scripting-vars-title": "Публичные переменные (Инспектор)",
        "ce-docs-terminal-act-1": "Окно > Терминал",
        "ce-docs-terminal-act-2": "Нижняя панель > Вкладка Терминал",
        "ce-docs-terminal-activate": "Как активировать Терминал",
        "ce-docs-terminal-cd": "cd <папка>: Перейти в папку.",
        "ce-docs-terminal-clear": "clear: Очистить терминал.",
        "ce-docs-terminal-fs-title": "1. Системные команды",
        "ce-docs-terminal-intro": "Терминал — это продвинутый инструмент для взаимодействия с движком с помощью текстовых команд.",
        "ce-docs-terminal-ls": "ls: Список файлов.",
        "ce-docs-terminal-scene-title": "2. Команды сцены",
        "ce-docs-terminal-title": "Руководство по Терминалу",
        "ce-donate-2": "Это профинансирует наше дальнейшее продвижение и оплату серверов, чтобы в будущем вы могли бесплатно использовать Carl IA без зависимости от внешнего API.",
        "ce-donate-claim": "Если в любом случае вы захотите подать претензию, вы можете сделать это в разделе Претензии.",
        "ce-donate-intro": "Ваша поддержка — это то, что поддерживает этот проект живым и бесплатным для всех. С полной прозрачностью мы сообщаем вам, что поддержка Creative Engine требует покрытия расходов на серверы и разработку, чтобы он оставался доступным инструментом для всех без экономических барьеров. Ваши пожертвования помогут другим использовать наши инструменты бесплатно.",
        "ce-human-desc": "Здесь вам просто нужно будет поговорить с движком, сказать ему, что вы хотите, чтобы скрипт делал, и движок вас поймет.",
        "ce-info-1": "Creative Engine был разработан для любой аудитории. Неважно, эксперт вы, новичок или вообще не имеете опыта, Creative Engine поможет и научит вас.",
        "ce-info-2": "Наш движок был вдохновлен Unity, но основан на материях и законах. Материями может быть что угодно в вашей игре, а законы — это все, что определяет поведение каждой вещи в вашей игре; это набор правил, которые делают вашу игру уникальной и делают ее такой, какой вы хотите ее видеть.",
        "ce-info-3": "Вы можете создать игру менее чем за 1 час и без написания единой строки кода. Движок включает в себя несколько базовых компонентов, которые помогут вам создавать игры. Будучи веб-ориентированным, вы можете публиковать их на нескольких платформах и для различных устройств.",
        "ce-info-4": "В нашем движке есть система библиотек, которая позволяет разработчикам создавать различные библиотеки. Если вы хотите, например, ИИ для своей игры, вам не нужно создавать продвинутый ИИ с нуля; вы просто скачиваете библиотеку и готово.",
        "ce-info-5": "В наш движок интегрирован Carl IA, который поможет вам воплотить ваши идеи в реальность и будет направлять вас на каждом этапе разработки.",
        "ce-info-free": "Creative Engine на 100% бесплатен. Мы не претендуем на права ни на одну игру, созданную с его помощью; на самом деле, чем больше вы создаете, тем больше мы радуемся.",
        "ce-info-open": " Сам движок будет доступен в открытом исходном коде для всех тех, кто захочет модифицировать его по своему вкусу.",
        "ce-info-team": "Creative Engine разрабатывает систему, которая позволит вам создавать видеоигры в команде. Очень хорошо для школ, которые хотят обучать разработке видеоигр студентов, или небольших студий.",
        "ce-info-vidspri": "В Creative Engine интегрирован Vid Spri, инструмент, который позволяет создавать анимацию и звук для ваших видеоигр.",
        "ce-license-1": "Созданные игры доступны под лицензией CLG1 (Carley Free).",
        "ce-license-2": "Лицензиат имеет полное право использовать по своему усмотрению во всем своем продукте. Мы не претендуем ни на какой процент.",
        "ce-license-3": "Мы не несем ответственности; то есть у нас нет обязательств по исправлению багов, сбоев или ошибок, которые может представлять продукт.",
        "ce-license-4": "У нас нет прав на продукт пользователя, если только он нам это не позволит.",
        "ce-license-date": "Последнее обновление: 4 марта 2026 г.",
        "ce-nav-claims": "Претензии",
        "ce-nav-collabs": "Участники",
        "ce-nav-credits": "Авторы",
        "ce-nav-donations": "Пожертвования",
        "ce-nav-info": "Информация",
        "ce-nav-join": "Присоединяйтесь и подписывайтесь",
        "ce-nav-license": "Лицензия",
        "ce-nav-opinions": "Отзывы",
        "ce-nav-privacy": "Конфиденциальность",
        "ce-nav-report": "Сообщить о баге",
        "ce-privacy-main": "Мы не храним никакие другие типы данных, кроме информации, необходимой для вашей учетной записи, отзывов на наших серверах и т. д.",
        "ce-scratch-desc": "Вы сможете создавать логику игры, перетаскивая блоки. Очень хорошо для тех, кто только начинает. Пока находится в разработке.",
        "ce-tutorial-desc": "Изучите основы Creative Engine и начните свое приключение в качестве разработчика.",
        "ce-tutorial-title": "Как создать свою первую игру",
        "ce-why-1": "Движок доступен на нескольких разных языках и имеет 3 способа кодирования:",
        "ce-why-title": "Почему стоит использовать Creative Engine?",
        "claim-hint": "Вы можете подать претензию в ту же неделю, когда сделали пожертвование; в дальнейшем мы не гарантируем возврат.",
        "credits-gemini": "Наконец, мы благодарим Google AI Studio за их щедрый план и их модель Gemini для бесплатного использования Carl IA.",
        "credits-main": "Этот проект не существовал бы без невероятной помощи Google Jules, который сделал большую часть проекта. Мы благодарим Google за их щедрые бесплатные планы.",
        "credits-ms": "Мы также благодарим Microsoft Copilot, который также внес значительный вклад в проект.",
        "field-message": "Сообщение",
        "field-opinion": "Ваше мнение",
        "field-photos": "Фото (макс. 5)",
        "opinion-hint": "Мы будем читать ваши отзывы и рассматривать все те, что наберут больше всего лайков, в будущих обновлениях.",
        "support-action-title": "Поддержать проект",
    },
    zh: {
        welcome: "欢迎，很高兴您来到这里",
        "btn-yes": "是",
        "btn-no": "否",
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
        "ce-nav-tutorials": "教程",
        "ce-nav-solutions": "快速解决方案",
        "ce-nav-docs": "文档",
        "ce-nav-docs-leyes": "组件",
        "ce-nav-docs-scripting": "CES 脚本",
        "ce-nav-docs-libs": "库",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "终端",
        "ce-nav-docs-editors": "编辑器",
        "ce-nav-docs-advanced": "高级",
        "ce-nav-docs-config": "配置",
        "ce-solutions-title": "快速解决方案",
        "ce-solutions-placeholder": "目前还没有快速解决方案，但如果您发现任何错误，请举报。这样我们将开始添加解决它们的方法。",
        "ce-tutorial-ui-title": "学习 Creative Engine 界面",
        "ce-tutorial-ui-desc": "学习 Creative Engine 界面，轻松创作。您将发现引擎在发布时所具备的一切功能以及每种工具的用途；这样您就能更好地了解如何制作您的视频游戏。",
        "ce-tutorial-carl-title": "如何激活 Carl",
        "ce-tutorial-carl-desc": "了解如何激活 Carl，他是您的开发伙伴，将陪伴您开发视频游戏。",
        "ce-tutorial-prog-title": "如何在 Creative Engine 中编程",
        "ce-tutorial-prog-desc": "学习使用 CES (Creative Engine Scripting) 和其他编码工具编写您自己的视频游戏。",
        "tutorial-not-available": "本教程尚未推出，您想查看我们的频道和其他视频吗？",
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
        "vs-os-crop-desc": "用于前端图像裁剪功能的 JavaScript 库。",
        "ce-docs-transform-code": "weizhi.x += 5; // 向右移动\nxuanzhuan += 45;  // 旋转45度\nsuofang.x = 2;    // 水平尺寸翻倍\nfanzhuanH = zhen; // 水平翻转",
        "ce-docs-camera-code": "xiangji.orthographicSize = 10; // 更改缩放\nxiangji.backgroundColor = \"#ff0000\"; // 红色背景",
        "ce-docs-sprite-code": "jinglingXuanranqi.color = \"#00ff00\"; // 绿色色调\njinglingXuanranqi.opacity = 0.5;      // 半透明\njinglingXuanranqi.spriteName = \"Tiaoyue\"; // 更改精灵",
        "ce-docs-water-code": "shui.midu = 2.0; // 物体浮力更强\nshui.xianshiChaoxi = zhen;",
        "ce-docs-video-code": "shipinBofangqi.bofang();\nshipinBofangqi.zhanting();\nshipinBofangqi.yinliang = 0.8;",
        "ce-docs-rigidbody-code": "wuli.applyImpulse(xin Vector2(0, -10)); // 跳跃\nwuli.velocity.x = 5; // 恒定速度\nwuli.gravityScale = 0; // 禁用重力",
        "ce-docs-collider-code": "ruguo (pengzhuangTag(\"地面\")) {\n    dayin(\"在地面上\");\n}",
        "ce-docs-basicai-code": "iaBasica.speed = 250;\niaBasica.behavior = \"Follow\";\niaBasica.target = chazhao(\"Player\");",
        "ce-docs-patrol-code": "xunluo.juli = 500;\nxunluo.sudu = 100;",
        "ce-docs-canvas-code": "huabu.scaleChildren = zhen;",
        "ce-docs-button-code": "dianjiShi() {\n    dayin(\"按钮被按下！\");\n}",
        "ce-docs-uitext-code": "wenbenUI.text = \"得分: \" + defen;\nwenbenUI.fontSize = 40;",
        "ce-docs-animator-code": "kongzhiqi.play(\"Gongji\"); // 强制状态",
        "ce-docs-audiosource-code": "yinpinYuan.bofang();\nyinpinYuan.loop = zhen;\nbofang.Explosion(); // 代理快捷方式",
        "ce-docs-protip-code": "yinqing motor;\n\ngongkai shuzi tiaoYueLi = 12;\n\ngengxinShi(delta) {\n    ruguo (gangAnXia(\"Space\") he pengzhuangTag(\"地面\")) {\n        wuli.applyImpulse(xin Vector2(0, -tiaoYueLi));\n        bofang.Jump(); // 调用声音或动画\n    }\n}",
        "ce-docs-scripting-import-code": "yinqing motor;",
        "ce-docs-scripting-input-code": "ruguo (anJianXia(\"Space\")) {\n    wuli.applyImpulse(xin Vector2(0, 10));\n}",
        "ce-docs-scripting-functions-code": "chazhao(\"Enemy\");\nxiaohui(benMateriya);\nshilihua(zidanPrefab, weizhi);",
        "ce-docs-scripting-vars-code": "gongkai shuzi sudu = 5;\ngongkai wenben wanjiaming = \"Hero\";\ngongkai buerr wudiShi = jia;\ngongkai Materiya mubiao;\ngongkai Sprite tubiao;\ngongkai Audio tiaoyueYinxiao;",
        "ce-docs-scripting-events-code": "kaishiShi() {\n    dayin(\"你好，世界！\");\n}\n\ngengxinShi(delta) {\n    // 每帧运行\n}\n\ndianjiShi() {\n}",
        "ce-docs-scripting-example-code": "yinqing motor;\ngongkai shuzi sudu = 300;\n\ngengxinShi(delta) {\n    bianliang movX = 0;\n    ruguo (anJianXia(\"ArrowRight\")) movX = 1;\n    fouze ruguo (anJianXia(\"ArrowLeft\")) movX = -1;\n\n    wuli.velocity.x = movX * (sudu * delta);\n}",
        "ce-docs-libs-ui-code": "CreativeEngine.API.zhuceChuangkou({\n    mingcheng: \"我的工具\",\n    daokaiShi: function(mianban) {\n        mianban.wenben(\"你好！\");\n        mianban.anniu(\"点击\", () => alert(\"OK\"));\n    }\n});",
        "ce-docs-libs-runtime-code": "const MiLib = {\n    wenhou: () => console.log(\"来自库的问候\")\n};\nCreativeEngine.API.zhuceRuntimeAPI(\"MiLib\", MiLib);",
        "ce-docs-terminal-code": "mkobj Bullet\naddcomp 10 SpriteRenderer\nsetprop 10 Transform position.x 100",
        "ce-docs-not-available": "该语言目前的文档尚未提供。",
        "ce-docs-tech-title": "5. 技术系统",
        "ce-docs-particles-title": "粒子",
        "ce-docs-particles-desc": "创建复杂的视觉效果，如火或烟。",
        "ce-docs-particles-code": "lizi.fashe(10);\nlizi.tingzhi();",
        "ce-docs-post-title": "后处理",
        "ce-docs-post-desc": "全局视觉滤镜，如 Bloom 或色彩校正。",
        "ce-docs-post-code": "houchuli.bloom = zhen;\nhouchuli.vignette = 0.5;",
        "ce-docs-audio-title": "音频",
        "ce-docs-audio-desc": "音乐和音效管理。",
        "ce-docs-audio-code": "yinpin.bofang(\"Explosion\");\nyinpin.zhuyinliang = 1.0;",
        "ce-docs-opt-title": "优化",
        "ce-docs-opt-desc": "提高游戏性能的工具。",
        "ce-docs-core-title": "1. 核心组件 (Core)",
        "ce-docs-transform-name": "Transform (变换)",
        "ce-docs-transform-desc": "定义物体在 2D 空间中的位置、旋转和缩放。",
        "ce-docs-transform-inspector": "检视面板用法：编辑 X 和 Y 值以移动物体。使用翻转 (Flip) 按钮镜像图像。",
        "ce-docs-camera-name": "Camera (摄像机)",
        "ce-docs-camera-desc": "定义游戏的可见区域。",
        "ce-docs-camera-inspector": "检视面板用法：设置背景颜色、缩放和裁剪遮罩 (Culling Mask)，以决定此摄像机可以看到哪些物体。",
        "ce-docs-render-title": "2. 渲染与视觉效果",
        "ce-docs-sprite-name": "SpriteRenderer (精灵渲染器)",
        "ce-docs-sprite-desc": "显示图像 (.png, .jpg) 或精灵图集 (.ceSprite) 中的一帧。",
        "ce-docs-sprite-inspector": "检视面板用法：将图像拖入 \"Source\" 字段。你可以更改颜色以对图像进行着色或调整不透明度。",
        "ce-docs-water-name": "Water (水)",
        "ce-docs-water-desc": "基于粒子的流体物理模拟。",
        "ce-docs-water-inspector": "检视面板用法：定义水域的宽度和高度。调整密度（浮力）和粘度。",
        "ce-docs-video-name": "VideoPlayer (视频播放器)",
        "ce-docs-video-desc": "在世界空间或 UI 中播放视频文件。",
        "ce-docs-video-inspector": "检视面板用法：支持 .mp4 和 .webm 格式。你可以启用循环 (loop) 并调整音量。",
        "ce-docs-physics-title": "3. 2D 物理",
        "ce-docs-rigidbody-name": "Rigidbody2D (刚体)",
        "ce-docs-rigidbody-desc": "使物体能够对重力和碰撞做出反应。",
        "ce-docs-rigidbody-inspector": "检视面板用法：将主体类型更改为 \"Dynamic\" 以使其下坠，或更改为 \"Kinematic\" 以手动移动但仍能检测碰撞。",
        "ce-docs-collider-name": "BoxCollider2D / CircleCollider2D (碰撞体)",
        "ce-docs-collider-desc": "定义碰撞的物理形状。",
        "ce-docs-collider-inspector": "检视面板用法：调整大小或半径。如果你勾选 \"Is Trigger\"，物体将不会发生物理碰撞，但会检测何时有物体进入其区域。",
        "ce-docs-ai-title": "4. 智能与移动",
        "ce-docs-basicai-name": "BasicAI (基础人工智能)",
        "ce-docs-basicai-desc": "NPC 和敌人的自动行为。",
        "ce-docs-basicai-modes": "模式：Follow (跟随目标)、Escape (逃离目标)、Wander (随机游走)。",
        "ce-docs-patrol-name": "Patrol (巡逻)",
        "ce-docs-ui-title": "5. 用户界面 (UI)",
        "ce-docs-canvas-name": "Canvas (画布)",
        "ce-docs-canvas-desc": "所有界面元素的主要容器。",
        "ce-docs-button-name": "Button (按钮)",
        "ce-docs-button-desc": "检测用户点击。",
        "ce-docs-button-inspector": "检视面板用法：允许为不同状态（正常、按下、禁用）定义颜色或更改精灵。",
        "ce-docs-uitext-name": "UIText (UI 文本)",
        "ce-docs-uitext-desc": "使用自定义字体在屏幕上显示文本。",
        "ce-docs-anim-title": "6. 动画与音频",
        "ce-docs-animator-name": "AnimatorController (动画控制器)",
        "ce-docs-animator-desc": "管理动画状态（走路、跳跃、空闲）。",
        "ce-docs-animator-inspector": "检视面板用法：需要一个 .ceanim 文件。\"智能模式\" 会根据移动自动播放动画。",
        "ce-docs-audio-name": "AudioSource (音频源)",
        "ce-docs-audio-inspector": "检视面板用法：支持空间音频（音量随物体远去而减小）。",
        "ce-docs-others-title": "7. 其他组件",
        "ce-docs-others-raycast": "RaycastSource (射线)：发射隐形射线以检测墙壁或前方的敌人。",
        "ce-docs-others-particles": "ParticleSystem (粒子系统)：使用预制体作为基础创建火、烟或火花效果。",
        "ce-docs-others-parallax": "Parallax (视差)：创建以不同速度移动的无限背景，以增加深度感。",
        "ce-docs-others-light": "Light2D (光照)：使用点光源、聚光灯或自由形状照亮场景。",
        "ce-docs-protip-title": "脚本编写专业技巧",
        "ce-docs-protip-desc": "请记住，在 Creative Engine 中，你可以直接通过名称访问任何组件。不需要使用前缀。",
        "btn-ad": "观看广告以支持我们",
        "btn-see-support": "查看贡献者",
        "btn-send": "发送报告",
        "btn-send-claim": "发送索赔",
        "btn-send-opinion": "发表意见",
        "btn-support": "支持",
        "ce-ces-desc": "专为那些已经是视频游戏创作专家并喜欢使用纯代码编程的人设计。使用 JS 制作，灵感来自 C#、JS 和 Python。允许完全使用西班牙语、英语、葡萄牙语、俄语和中文（并将扩展到更多语言）进行编程。",
        "ce-claim-reason": "索赔原因",
        "ce-docs-advanced-build-desc": "生成准备好托管的独立 Web 包 (.zip)。",
        "ce-docs-advanced-build-title": "3. 构建系统",
        "ce-docs-advanced-intro": "资产管理、关卡设计和发布。",
        "ce-docs-advanced-scenes-desc": "使用 Ctrl + S 保存。场景 (.ceScene) 包含所有物体和灯光。",
        "ce-docs-advanced-scenes-title": "2. 场景管理",
        "ce-docs-advanced-struct-title": "1. 项目结构",
        "ce-docs-advanced-title": "高级指南",
        "ce-docs-audiosource-desc": "播放音效或音乐。",
        "ce-docs-audiosource-inspector": "检视面板用法：支持空间音频（音量随物体远去而减小）。",
        "ce-docs-audiosource-name": "AudioSource (音频源)",
        "ce-docs-carl-act-1": "顶部按钮：机器人图标 🤖 (Carl)",
        "ce-docs-carl-act-2": "快捷键：Shift + Ctrl + L",
        "ce-docs-carl-activate-title": "如何激活 Carl IA",
        "ce-docs-carl-config-title": "配置 (API 密钥)",
        "ce-docs-carl-intro": "Carl IA 是一个智能代理，能够操作编辑器、创建文件并帮助您逐步构建游戏。",
        "ce-docs-carl-keys": "在 编辑 > 首选项 > AI 中配置您的密钥。我们支持 Google Gemini（免费）、OpenAI 和 Anthropic。",
        "ce-docs-carl-modes-desc": "Carl 可以在“助手”模式（引导您）或“自主”模式（为您进行更改）下工作。",
        "ce-docs-carl-modes-title": "执行模式",
        "ce-docs-carl-skills-title": "自主技能",
        "ce-docs-carl-title": "Carl IA 指南：您的自主助手",
        "ce-docs-config-ambient-desc": "昼夜循环、色彩滤镜和环境光。",
        "ce-docs-config-ambient-title": "2. 环境控制",
        "ce-docs-config-intro": "自定义您的工作流程和氛围。",
        "ce-docs-config-project-desc": "管理排序图层、碰撞图层和标签。",
        "ce-docs-config-project-title": "1. 项目配置",
        "ce-docs-config-title": "配置与环境",
        "ce-docs-editors-anim-desc": "使用时间线创建序列 (.cea)。",
        "ce-docs-editors-anim-title": "2. 动画编辑器",
        "ce-docs-editors-intro": "用于管理图形、动画和关卡的视觉工具套件。",
        "ce-docs-editors-sprite-desc": "将大图像裁剪成多个小精灵。",
        "ce-docs-editors-sprite-title": "1. 精灵编辑器",
        "ce-docs-editors-tilemap-desc": "使用画笔和图层设计基于网格的关卡。",
        "ce-docs-editors-tilemap-title": "3. 瓦片地图编辑器",
        "ce-docs-editors-title": "视觉编辑器指南",
        "ce-docs-leyes-intro": "在 Creative Engine 中，物质（物体）通过法律（组件）获得生命。每条法律都添加了特定的功能，例如重力、图像渲染或 AI 逻辑。",
        "ce-docs-leyes-scripting": "脚本：",
        "ce-docs-leyes-title": "组件指南（法律）- Creative Engine",
        "ce-docs-libs-install-title": "如何创建和安装库",
        "ce-docs-libs-intro": "库 (.celib) 允许扩展编辑器界面和编程能力。",
        "ce-docs-libs-runtime-title": "2. 运行时库（新功能）",
        "ce-docs-libs-title": "库与扩展性指南",
        "ce-docs-libs-ui-title": "1. 界面库（编辑器工具）",
        "ce-docs-patrol-desc": "在两点之间移动物体。",
        "ce-docs-scripting-access": "直接访问：您不需要编写 this. 或 mtr. 来访问组件。",
        "ce-docs-scripting-core-title": "基本概念",
        "ce-docs-scripting-events-title": "生命周期事件",
        "ce-docs-scripting-example-title": "实践示例",
        "ce-docs-scripting-functions-title": "特殊函数",
        "ce-docs-scripting-import": "所有脚本都必须以连接引擎的指令开始：ve motor;",
        "ce-docs-scripting-input-title": "输入 (Input) 与移动",
        "ce-docs-scripting-intro": "Creative Engine 使用 CES (Creative Engine Script)，这是一种基于 JavaScript 但为视频游戏创作者简化的强大语言。",
        "ce-docs-scripting-title": "脚本编写大师指南 (CES)",
        "ce-docs-scripting-vars-desc": "为了让变量出现在检视面板中，请使用关键字 publico。",
        "ce-docs-scripting-vars-title": "公共变量 (检视面板)",
        "ce-docs-terminal-act-1": "窗口 > 终端",
        "ce-docs-terminal-act-2": "底部面板 > 终端选项卡",
        "ce-docs-terminal-activate": "如何激活终端",
        "ce-docs-terminal-cd": "cd <文件夹>：更改文件夹。",
        "ce-docs-terminal-clear": "clear：清除终端。",
        "ce-docs-terminal-fs-title": "1. 系统命令",
        "ce-docs-terminal-intro": "终端是一个通过文本命令与引擎交互的高级工具。",
        "ce-docs-terminal-ls": "ls：列出文件。",
        "ce-docs-terminal-scene-title": "2. 场景命令",
        "ce-docs-terminal-title": "终端指南",
        "ce-donate-2": "它将资助我们继续前进并支付服务器费用，以便将来您可以免费使用 Carl IA，而无需依赖外部 API。",
        "ce-donate-claim": "如果您想提出索赔，可以在“索赔”中进行。",
        "ce-donate-intro": "您的支持是让这个项目对所有人保持活力和免费的原因。我们非常透明地向您说明，维护 Creative Engine 需要支付服务器和开发成本，以便它在没有经济障碍的情况下仍然是所有人都可以使用的工具。您的捐赠将帮助其他人免费使用我们的工具。",
        "ce-human-desc": "在这里，您只需要对引擎说话，告诉它您希望脚本做什么，引擎就会理解您。",
        "ce-info-1": "Creative Engine 专为所有受众设计。无论您是专家、新手还是没有任何经验，Creative Engine 都会为您提供帮助和教学。",
        "ce-info-2": "我们的引擎灵感来自 Unity，但基于物质和法律。物质可以是您游戏中的任何东西，而法律是定义您游戏中每件事物行为的所有内容；它们是一套规则，让您的游戏独一无二，并使其成为您想要的样子。",
        "ce-info-3": "您可以在不到 1 小时内创建一个游戏，而且无需编写任何代码。该引擎包含多个基本组件，可帮助您创建游戏。由于它是基于 Web 的，您可以将其发布在多个平台和多种设备上。",
        "ce-info-4": "我们的引擎有一个库系统，允许开发人员创建各种库。如果您想要（例如）为您的游戏添加 AI，您不必从头开始制作高级 AI；只需下载库即可。",
        "ce-info-5": "我们的引擎集成了 Carl IA，它将帮助您将想法变为现实，并指导您完成开发的每一步。",
        "ce-info-free": "Creative Engine 是 100% 免费的。我们不对使用它制作的任何游戏主张权利；事实上，您创造得越多，我们越高兴。",
        "ce-info-open": "引擎本身将以开源形式提供给所有想要根据自己的喜好进行修改的人。",
        "ce-info-team": "Creative Engine 正在开发一个允许您团队创建视频游戏的系统。非常适合想要向学生教授视频游戏开发的学校或小型工作室。",
        "ce-info-vidspri": "Creative Engine 集成了 Vid Spri，这是一款允许您为视频游戏创建动画和声音的工具。",
        "ce-license-1": "制作的游戏在 CLG1 许可（Carley 免费）下可用。",
        "ce-license-2": "被许可人有权在其整个产品中随心所欲地使用。我们不收取任何比例的费用。",
        "ce-license-3": "我们不承担责任；也就是说，我们没有义务解决产品可能出现的错误、故障或错误。",
        "ce-license-4": "除非用户允许，否则我们对用户产品没有权利。",
        "ce-license-date": "最后更新：2026 年 3 月 4 日",
        "ce-nav-claims": "索赔",
        "ce-nav-collabs": "贡献者",
        "ce-nav-credits": "致谢",
        "ce-nav-donations": "捐赠",
        "ce-nav-info": "信息",
        "ce-nav-join": "加入并关注我们",
        "ce-nav-license": "许可",
        "ce-nav-opinions": "意见",
        "ce-nav-privacy": "隐私",
        "ce-nav-report": "报告错误",
        "ce-privacy-main": "除了您的帐户和服务器上的意见所需的信息外，我们不保存任何其他类型的数据。",
        "ce-scratch-desc": "可以通过拖动块来创建游戏逻辑。非常适合刚开始的人。仍在开发中。",
        "ce-tutorial-desc": "了解 Creative Engine 的基础知识并开始您的开发人员冒险。",
        "ce-tutorial-title": "如何创建您的第一个游戏",
        "ce-why-1": "该引擎支持多种不同的语言，并具有 3 种编码方式：",
        "ce-why-title": "为什么使用 Creative Engine？",
        "claim-hint": "您可以在捐赠后的同一周内提出索赔；之后我们不保证退还。",
        "credits-gemini": "最后，我们感谢 Google AI Studio 提供的慷慨计划及其 Gemini 模型，以便免费使用 Carl IA。",
        "credits-main": "如果没有 Google Jules 的大力帮助，这个项目就不可能完成，他完成了项目的大部分工作。我们感谢 Google 提供的慷慨免费计划。",
        "credits-ms": "我们也感谢 Microsoft Copilot，它也为该项目做出了重大贡献。",
        "field-message": "信息",
        "field-opinion": "您的意见",
        "field-photos": "照片（最多 5 张）",
        "opinion-hint": "我们将阅读您的意见，并在未来的更新中考虑所有获得更多赞的意见。",
        "support-action-title": "支持项目",
    },
    it: {
        welcome: "Benvenuto, siamo felici di averti qui",
        "btn-yes": "Sì",
        "btn-no": "No",
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
        "ce-nav-tutorials": "Tutorial",
        "ce-nav-solutions": "Soluzioni Rapide",
        "ce-nav-docs": "Documentazione",
        "ce-nav-docs-leyes": "Componenti",
        "ce-nav-docs-scripting": "Scripting CES",
        "ce-nav-docs-libs": "Librerie",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Editor",
        "ce-nav-docs-advanced": "Avanzato",
        "ce-nav-docs-config": "Configurazione",
        "ce-solutions-title": "Soluzioni Rapide",
        "ce-solutions-placeholder": "Per ora non ci sono soluzioni rapide, ma se trovi dei bug, segnalali. In questo modo inizieremo ad aggiungere modi per risolverli.",
        "ce-tutorial-ui-title": "Impara l'interfaccia di Creative Engine",
        "ce-tutorial-ui-desc": "Impara l'interfaccia di Creative Engine per creare con facilità. Scoprirai tutto ciò che il motore offre al lancio e a cosa serve ogni strumento; in questo modo saprai meglio come creare il tuo videogioco.",
        "ce-tutorial-carl-title": "Come attivare Carl",
        "ce-tutorial-carl-desc": "Scopri come attivare Carl, il tuo compagno di sviluppo che ti accompagnerà nello sviluppo dei tuoi videogiochi.",
        "ce-tutorial-prog-title": "Come programmare in Creative Engine",
        "ce-tutorial-prog-desc": "Impara a programmare i tuoi videogiochi usando CES (Creative Engine Scripting) e altri strumenti di codifica.",
        "tutorial-not-available": "Questo tutorial non è ancora disponibile, vuoi vedere il nostro canale e altri video?",
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
        "vs-os-crop-desc": "Una libreria JavaScript per la funzionalità di ritaglio delle immagini sul frontend.",
        "ce-docs-not-available": "La documentazione non è attualmente disponible in questa lingua.",
    },
    ja: {
        welcome: "ようこそ、お越しいただきありがとうございます",
        "btn-yes": "はい",
        "btn-no": "いいえ",
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
        "ce-nav-tutorials": "チュートリアル",
        "ce-nav-solutions": "クイックソリューション",
        "ce-nav-docs": "ドキュメント",
        "ce-nav-docs-leyes": "コンポーネント",
        "ce-nav-docs-scripting": "CES スクリプト",
        "ce-nav-docs-libs": "ライブラリ",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "ターミナル",
        "ce-nav-docs-editors": "エディター",
        "ce-nav-docs-advanced": "高度な設定",
        "ce-nav-docs-config": "構成",
        "ce-solutions-title": "クイックソリューション",
        "ce-solutions-placeholder": "現時点ではクイックソリューションはありませんが、バグを見つけた場合は報告してください。これにより、解決方法の追加を開始します。",
        "ce-tutorial-ui-title": "Creative Engineのインターフェースを学ぶ",
        "ce-tutorial-ui-desc": "Creative Engineのインターフェースを学んで、簡単に制作しましょう。発売時にエンジンが備えているすべての機能と、各ツールの用途について説明します。これにより、ビデオゲームの作成方法がより明確になります。",
        "ce-tutorial-carl-title": "Carlを起動する方法",
        "ce-tutorial-carl-desc": "ビデオゲームの開発に同行する開発パートナー、Carlを起動する方法を学びましょう。",
        "ce-tutorial-prog-title": "Creative Engineでのプログラミング方法",
        "ce-tutorial-prog-desc": "CES (Creative Engine Scripting) やその他のコーディングツールを使用して、独自のビデオゲームをプログラミングする方法を学びます。",
        "tutorial-not-available": "このチュートリアルはまだ利用できません。私たちのチャンネルや他のビデオをご覧になりますか？",
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
        "vs-os-crop-desc": "フロントエンドでの画像切り抜き機能のためのJavaScriptライブラリ。",
        "ce-docs-not-available": "現在、この言語のドキュメントは利用できません。",
    },
    sw: {
        welcome: "Karibu, tunafurahi kuwa nawe hapa",
        "btn-yes": "Ndiyo",
        "btn-no": "Hapana",
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
        "ce-nav-tutorials": "Mafunzo",
        "ce-nav-solutions": "Suluhisho za Haraka",
        "ce-nav-docs": "Nyaraka",
        "ce-nav-docs-leyes": "Vipengele",
        "ce-nav-docs-scripting": "Uandishi wa CES",
        "ce-nav-docs-libs": "Maktaba",
        "ce-nav-docs-carl": "Carl IA",
        "ce-nav-docs-terminal": "Terminal",
        "ce-nav-docs-editors": "Wahariri",
        "ce-nav-docs-advanced": "Kina",
        "ce-nav-docs-config": "Usanidi",
        "ce-solutions-title": "Suluhisho za Haraka",
        "ce-solutions-placeholder": "Kwa sasa, hakuna suluhisho za haraka, lakini ukipata hitilafu zozote, tafadhali ziripoti. Kwa njia hii tutaanza kuongeza njia za kuzitatua.",
        "ce-tutorial-ui-title": "Jifunze kiolesura cha Creative Engine",
        "ce-tutorial-ui-desc": "Jifunze kiolesura cha Creative Engine ili kuunda kwa urahisi. Utajua kila kitu ambacho injini inacho wakati wa uzinduzi na kazi ya kila chombo; kwa njia hii utajua vyema jinsi ya kuunda mchezo wako wa video.",
        "ce-tutorial-carl-title": "Jinsi ya kumwanzisha Carl",
        "ce-tutorial-carl-desc": "Jifunze jinsi ya kumwanzisha Carl, mshirika wako wa uundaji ambaye atakuongoza katika uundaji wa michezo yako ya video.",
        "ce-tutorial-prog-title": "Jinsi ya kupanga katika Creative Engine",
        "ce-tutorial-prog-desc": "Jifunze kupanga michezo yako ya video ukitumia CES (Creative Engine Scripting) na zana zingine za usimbaji.",
        "tutorial-not-available": "Mafunzo haya bado hayajapatikana, unataka kuona kituo chetu na video zingine?",
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
    const picker = document.getElementById('lang-picker') || document.getElementById('lang-picker-ce');

    const updateTexts = async (lang) => {
        const t = translations[lang] || translations["es"];

        const isDocPage = window.location.pathname.includes('documentacion.html');
        const supportedDocs = ['es', 'en', 'pt', 'ru', 'zh'];
        const notAvailableMsg = document.querySelector('.not-available-msg');
        const docSeparators = document.querySelectorAll('.doc-separator');
        const docItems = document.querySelectorAll('.doc-item, .doc-protip, .ce-subtitle');

        if (isDocPage) {
            if (supportedDocs.includes(lang)) {
                if (notAvailableMsg) notAvailableMsg.classList.add('hidden');
                docSeparators.forEach(s => s.classList.remove('hidden'));
                docItems.forEach(i => i.classList.remove('hidden'));
            } else {
                if (notAvailableMsg) notAvailableMsg.classList.remove('hidden');
                docSeparators.forEach(s => s.classList.add('hidden'));
                docItems.forEach(i => i.classList.add('hidden'));
            }
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (key.includes('-code')) {
                    el.textContent = t[key].replace(/\\n/g, '\n');
                } else {
                    el.textContent = t[key];
                }
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


    const pickers = [document.getElementById('lang-picker'), document.getElementById('lang-picker-ce')];
    pickers.forEach(p => {
        if (p) p.onchange = (e) => updateTexts(e.target.value);
    });


    // Initial load
    const savedLang = localStorage.getItem('carley-lang') || 'es';
    if (picker) picker.value = savedLang;
    updateTexts(savedLang); window.translateAll = updateTexts;


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

/* ==============================
   Tutorial Availability Logic
============================== */
window.handleTutorialClick = function(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        const lang = localStorage.getItem('carley-lang') || 'es';
        const msg = translations[lang]['tutorial-not-available'] || translations['es']['tutorial-not-available'];

        // Create custom 10-second toast notification
        const existing = document.getElementById('tutorial-toast');
        if (existing) existing.remove();

        const btnYes = translations[lang]['btn-yes'] || translations['es']['btn-yes'];
        const btnNo = translations[lang]['btn-no'] || translations['es']['btn-no'];

        const toast = document.createElement('div');
        toast.id = 'tutorial-toast';
        toast.className = 'studio-toast';

        toast.innerHTML = `
            <p>${msg}</p>
            <div class="toast-actions">
                <button id="toast-yes" class="ce-btn primary small">${btnYes}</button>
                <button id="toast-no" class="ce-btn outline small">${btnNo}</button>
            </div>
            <div id="toast-progress"></div>
        `;

        document.body.appendChild(toast);

        // Trigger progress animation
        setTimeout(() => {
            const bar = document.getElementById('toast-progress');
            if (bar) bar.style.width = '0%';
        }, 10);

        const closeToast = () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        };

        const timer = setTimeout(closeToast, 10000);

        document.getElementById('toast-yes').onclick = () => {
            clearTimeout(timer);
            window.open('https://www.youtube.com/@CarleyInteractiveStudioOficial', '_blank');
            closeToast();
        };

        document.getElementById('toast-no').onclick = () => {
            clearTimeout(timer);
            closeToast();
        };
    }
};

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
