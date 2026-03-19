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
