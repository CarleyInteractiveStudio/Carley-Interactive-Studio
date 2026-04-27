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
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalContent;
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }, 2000);
}

// Supabase Global Client Initialization
{
    const SB_URL = 'https://rblftfzbqllnuadqtufb.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibGZ0ZnpicWxsbnVhZHF0dWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjQyMzQsImV4cCI6MjA2ODU0MDIzNH0.cH-KJG2k43dKQaVccQDkw7t6m0sf1zIOLWPADdmKLt8';
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
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
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

    // Check for password recovery link in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('type') === 'recovery' || window.location.hash.includes('access_token')) {
        // If we are on a recovery flow, show the reset password modal
        // Supabase automatically logs in the user when they click the recovery link
        if (session) {
            setTimeout(() => {
                if (typeof openStudioModal === 'function') openStudioModal('modal-reset-password');
            }, 500);
        }
    }

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

    // Password Recovery Handler
    const recoverySubmit = document.getElementById('do-recovery');
    if (recoverySubmit) {
        recoverySubmit.onclick = async () => {
            const email = document.getElementById('recovery-email').value;
            if (!email) return alert("Por favor, ingresa tu correo.");

            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + window.location.pathname + '?type=recovery',
            });

            if (error) alert("Error: " + error.message);
            else {
                alert("Instrucciones enviadas a tu correo.");
                closeStudioModal('modal-recovery');
            }
        };
    }

    // Reset Password Handler
    const resetPassSubmit = document.getElementById('do-reset-password');
    if (resetPassSubmit) {
        resetPassSubmit.onclick = async () => {
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-new-password').value;

            if (newPass !== confirmPass) return alert("Las contraseñas no coinciden.");
            if (newPass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");

            const { error } = await window.supabaseClient.auth.updateUser({ password: newPass });

            if (error) alert("Error: " + error.message);
            else {
                alert("Contraseña actualizada con éxito.");
                closeStudioModal('modal-reset-password');
                // Limpiar URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        };
    }
    const registerSubmit = document.getElementById('do-register');
    if (registerSubmit) {
        registerSubmit.onclick = async () => {
            const username = document.getElementById('reg-username').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const pass = document.getElementById('reg-pass').value;
            const confirm = document.getElementById('reg-pass-confirm').value;
            const phone = document.getElementById('reg-phone').value.trim() || null;

            if (!username) return alert('Nombre de usuario obligatorio.');
            if (pass !== confirm) return alert('Las contraseñas no coinciden.');

            const { data, error } = await window.supabaseClient.auth.signUp({
                email,
                password: pass,
                options: {
                    data: { username, phone }
                }
            });
            if (error) return alert(error.message);

            // Create initial profile record if user is new
            if (data.user) {
                await window.supabaseClient.from('profiles').upsert({
                    id: data.user.id,
                    language: localStorage.getItem('carley-lang') || 'es',
                    username: username,
                    phone: phone,
                    email: email
                });
            }

            closeStudioModal('modal-auth-register');
            alert('Cuenta creada e iniciada con éxito.');
        };
    }
}

function updateAuthStateUI(session) {
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

    // Ensure we don't add listeners twice
    if (searchInput.dataset.searchInitialized) return;
    searchInput.dataset.searchInitialized = "true";

    const searchMap = [
        { name: 'Creative Engine', id: 'info', url: 'creative-engine.html', keywords: ['motor', 'videojuegos', '2d', 'ia'], available: true },
        { name: 'AppCraft', id: 'app-craft-home', keywords: ['motor', 'app', 'aplicaciones', 'web', 'desarrollo'], available: false },
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

function initializeTranslations() {
    const picker = document.getElementById('lang-picker') || document.getElementById('lang-picker-ce');

    const updateTexts = async (lang) => {
        // Merge main translations with doc-specific content if available
        let t = {...(translations[lang] || translations["es"])};
        if (window.docsTranslations) {
            const docLang = window.docsTranslations[lang] ? lang : 'en'; // Fallback to English for docs
            t = {...t, ...window.docsTranslations[docLang]};
        }

        const isDocPage = window.location.pathname.includes('documentacion.html');
        const supportedDocs = ['es', 'en', 'pt', 'ru', 'zh'];
        const notAvailableMsg = document.querySelector('.not-available-msg');

        // Hide not available message always if we fallback to English
        if (isDocPage) {
            if (notAvailableMsg) notAvailableMsg.classList.add('hidden');
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (key.includes('-code')) {
                    el.textContent = t[key].replace(/\\n/g, '\n');
                    // Show the wrapper if it was hidden and has content
                    const wrapper = el.closest('.code-block-wrapper');
                    if (wrapper) wrapper.classList.remove('hidden');
                } else if ((el.tagName === 'UL' || el.tagName === 'LI' || el.tagName === 'P') && (t[key].includes('<li>') || t[key].includes('<b>'))) {
                    el.innerHTML = t[key];
                } else {
                    el.textContent = t[key];
                }
            } else if (key.includes('-code')) {
                // Hide code blocks that have no content for the current language
                const wrapper = el.closest('.code-block-wrapper');
                if (wrapper) wrapper.classList.add('hidden');
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

    function closeToast() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }

    const timer = setTimeout(closeToast, 10000);

    const iconYes = document.getElementById('toast-yes');
    const iconNo = document.getElementById('toast-no');
    if (iconYes) iconYes.onclick = () => {
        clearTimeout(timer);
        window.open('https://www.youtube.com/@CarleyInteractiveStudioOficial', '_blank');
        closeToast();
    };
    if (iconNo) iconNo.onclick = () => {
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
