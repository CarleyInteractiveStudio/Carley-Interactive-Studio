/* SSO Secure Communication System
   Handles Identity Providing for Carley Studio Ecosystem
*/

const WHITELISTED_DOMAINS = [
    'carleyengine.com',
    'creativegame.online',
    'carleystudio.com',
    'localhost' // For development
];

const CLIENT_CONFIGS = {
    'carleyengine.com': {
        name: 'Creative Engine',
        logo: 'carley_foto_web/Logo_C.png',
        msg: 'No tomará mucho tiempo, ingresa tus datos para acceder a Creative Engine.'
    },
    'creativegame.online': {
        name: 'Creative Games',
        logo: 'carley_foto_web/Creative_Games_Logo.png',
        msg: 'Ingresa tus datos para jugar en Creative Games sin límites.'
    },
    'carleystudio.com': {
        name: 'Carley Studio',
        logo: 'carley_foto_web/Logo_C.png',
        msg: 'No tomará mucho tiempo, ingresa tus datos aquí.'
    },
    'localhost': {
        name: 'Local Dev Site',
        logo: 'carley_foto_web/Logo_C.png',
        msg: 'Probando el sistema SSO localmente.'
    }
};

let currentClient = null;
let returnUrl = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const domain = urlParams.get('domain');
    returnUrl = urlParams.get('redirect_to');

    if (domain && CLIENT_CONFIGS[domain]) {
        currentClient = CLIENT_CONFIGS[domain];
        updateSSOUI(currentClient);
    } else {
        // Fallback or generic Carley Studio SSO
        currentClient = CLIENT_CONFIGS['carleystudio.com'];
        updateSSOUI(currentClient);
    }

    // Check if user is already logged in
    checkExistingSession();
});

function updateSSOUI(client) {
    document.getElementById('requesting-client-logo').src = client.logo;
    document.getElementById('requesting-client-name').textContent = client.name;
    document.getElementById('sso-custom-msg').textContent = client.msg;
}

function switchTab(type) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));

    if (type === 'active') {
        document.getElementById('auth-forms-container').classList.add('hidden');
        document.getElementById('section-active-session').classList.add('active');
    } else {
        document.getElementById('auth-forms-container').classList.remove('hidden');
        document.getElementById('section-active-session').classList.remove('active');

        document.querySelectorAll('.sso-tab').forEach(t => t.classList.remove('active'));
        if (type === 'login') {
            document.querySelector('.sso-tab:first-child').classList.add('active');
            document.getElementById('section-login').classList.add('active');
        } else {
            document.querySelector('.sso-tab:last-child').classList.add('active');
            document.getElementById('section-register').classList.add('active');
        }
    }
}

async function checkExistingSession() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        // Fetch full profile info for display
        const { data: profile } = await window.supabaseClient
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', session.user.id)
            .single();

        const username = (profile && profile.username) || session.user.email.split('@')[0];
        const avatar = (profile && profile.avatar_url) || `https://ui-avatars.com/api/?name=${username}&background=random`;

        document.getElementById('active-username').textContent = username;
        document.getElementById('active-email').textContent = session.user.email;
        document.getElementById('active-pfp').src = avatar;
        document.getElementById('continue-name-hint').textContent = username;

        // Show active session UI
        switchTab('active');

        // Setup continue button
        const continueBtn = document.getElementById('btn-sso-continue');
        if (continueBtn) {
            continueBtn.onclick = () => handleSSOSuccess(session);
        }
    }
}

// Login Handler
const loginBtn = document.getElementById('btn-sso-login');
if (loginBtn) {
    loginBtn.onclick = async () => {
        const email = document.getElementById('sso-email').value;
        const pass = document.getElementById('sso-pass').value;

        showLoading(true);
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password: pass });

        if (error) {
            showLoading(false);
            alert(error.message);
        } else {
            handleSSOSuccess(data.session);
        }
    };
}

// Register Handler
const regBtn = document.getElementById('btn-sso-register');
if (regBtn) {
    regBtn.onclick = async () => {
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;

        if (pass.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");

        showLoading(true);
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    username: username,
                    language: localStorage.getItem('carley-lang') || 'es'
                }
            }
        });

        if (error) {
            showLoading(false);
            alert(error.message);
        } else {
            handleSSOSuccess(data.session);
        }
    };
}

function handleSSOSuccess(session) {
    if (!returnUrl) {
        // If no return URL, just go home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    try {
        const redirectUrl = new URL(returnUrl);
        // Security check: only redirect to whitelisted domains
        const isWhitelisted = WHITELISTED_DOMAINS.some(domain =>
            redirectUrl.hostname === domain || redirectUrl.hostname.endsWith('.' + domain)
        );

        if (!isWhitelisted) {
            console.error('Redirección bloqueada: Dominio no autorizado', redirectUrl.hostname);
            showError('Dominio no autorizado para inicio de sesión seguro.');
            setTimeout(() => { window.location.href = 'index.html'; }, 3000);
            return;
        }

        // Append session token to redirect URL securely via hash to avoid server logs
        redirectUrl.hash = `sso_token=${session.access_token}&user_id=${session.user.id}`;

        const finalUrl = redirectUrl.toString();

        // Automatic redirect
        window.location.href = finalUrl;

        // Visual backup: Show manual link if automatic fails
        document.getElementById('loading-text').textContent = "Identidad verificada. Redirigiendo...";
        const manualArea = document.getElementById('manual-redirect-area');
        const manualLink = document.getElementById('manual-redirect-link');
        if (manualArea && manualLink) {
            manualArea.classList.remove('hidden');
            manualLink.href = finalUrl;
        }

    } catch (e) {
        console.error('Invalid return URL', e);
        showError('La URL de retorno no es válida.');
        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
    }
}

function showError(msg) {
    showLoading(false);
    alert(msg);
}

function showLoading(show) {
    const overlay = document.getElementById('sso-loading-overlay');
    if (show) overlay.classList.remove('hidden');
    else overlay.classList.add('hidden');
}
