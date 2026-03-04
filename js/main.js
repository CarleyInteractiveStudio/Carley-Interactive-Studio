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

    if (session) {
        loggedInDiv.classList.remove('hidden');
        loggedOutDiv.classList.add('hidden');
        emailDisplay.textContent = session.user.email;
        usernameInput.value = session.user.user_metadata.username || session.user.email.split('@')[0];
    } else {
        loggedInDiv.classList.add('hidden');
        loggedOutDiv.classList.remove('hidden');
    }
}

/* ==============================
   Search Engine Logic
============================== */
function initializeSearch() {
    const searchInput = document.getElementById('main-search');
    const dropdown = document.getElementById('search-dropdown');

    const searchMap = [
        { name: 'Creative Engine', id: 'hero-engine', keywords: ['motor', 'videojuegos', '2d', 'ia'] },
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
                    document.getElementById(match.id).scrollIntoView({ behavior: 'smooth' });
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
    es: { welcome: "Bienvenido, nos alegra tenerte aquí" },
    en: { welcome: "Welcome, we're glad to have you here" },
    fr: { welcome: "Bienvenue, nous sommes ravis de vous voir ici" },
    pt: { welcome: "Bem-vindo, estamos felizes em tê-lo aqui" },
    ru: { welcome: "Добро пожаловать, мы рады видеть вас здесь" },
    zh: { welcome: "欢迎，很高兴您来到这里" },
    it: { welcome: "Benvenuto, siamo felici di averti qui" },
    ja: { welcome: "ようこそ、お越しいただきありがとうございます" },
    sw: { welcome: "Karibu, tunafurahi kuwa nawe hapa" }
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

        localStorage.setItem('carley-lang', lang);
    };

    picker.onchange = (e) => updateTexts(e.target.value);

    // Initial load
    const savedLang = localStorage.getItem('carley-lang') || 'es';
    picker.value = savedLang;
    updateTexts(savedLang);
}

/* ==============================
   Donation System
============================== */
function initializeDonations() {
    document.getElementById('paypal-link').onclick = (e) => {
        e.preventDefault();
        window.open('https://www.paypal.com/donate/?hosted_button_id=JZ4KM2VUD6AMQ', '_blank');
    };

    document.getElementById('info-donations-trigger').onclick = (e) => {
        e.preventDefault();
        openStudioModal('modal-donations-info');
    };
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

document.getElementById('modal-overlay').onclick = () => {
    document.querySelectorAll('.studio-modal').forEach(m => m.classList.add('hidden'));
    document.getElementById('modal-overlay').classList.add('hidden');
};

document.getElementById('account-trigger').onclick = () => {
    openStudioModal('modal-account');
};

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
