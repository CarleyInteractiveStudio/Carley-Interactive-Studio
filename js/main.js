// js/main.js
window.addEventListener('DOMContentLoaded', () => {
  // Inicializar Supabase
  const SUPABASE_URL = 'https://rblftfzbqllnuadqtufb.supabase.co';
  const SUPABASE_KEY = 'TU_PUBLIC_ANON_KEY';
  const supabase     = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // Panels de feedback
  const errorPanel   = document.getElementById('error-panel');
  const successPanel = document.getElementById('success-panel');
  function mostrarError(msg) {
    errorPanel.textContent = msg;
    errorPanel.classList.remove('oculto');
    setTimeout(() => errorPanel.classList.add('oculto'), 4000);
  }
  function mostrarExito(msg) {
    successPanel.textContent = msg;
    successPanel.classList.remove('oculto');
    setTimeout(() => successPanel.classList.add('oculto'), 4000);
  }

  // Menú ⚙️
  const settingsBtn  = document.getElementById('settings-btn');
  const settingsMenu = document.getElementById('settings-menu');
  settingsBtn.onclick = () => {
    settingsMenu.style.display =
      settingsMenu.style.display === 'flex' ? 'none' : 'flex';
  };
  document.getElementById('back-btn').onclick = () => {
    settingsMenu.style.display = 'none';
  };

  // Modales y backdrop
  const backDrop  = document.getElementById('modal-backdrop');
  const mLogin    = document.getElementById('modal-login');
  const mRegister = document.getElementById('modal-register');
  const mForgot   = document.getElementById('modal-forgot');
  const mChange   = document.getElementById('modal-change');
  function toggleModal(modal) {
    const hidden = modal.classList.contains('oculto');
    [modal, backDrop].forEach(el => el.classList.toggle('oculto', !hidden));
  }
  document.getElementById('login-btn').onclick    = () => toggleModal(mLogin);
  document.getElementById('register-btn').onclick = () => toggleModal(mRegister);
  backDrop.onclick = () =>
    [mLogin, mRegister, mForgot, mChange, backDrop].forEach(el =>
      el.classList.add('oculto')
    );

  // Botón Cerrar sesión dinámico
  const logoutBtn = document.createElement('button');
  logoutBtn.id          = 'logout-btn-menu';
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.classList.add('boton-juego');
  logoutBtn.style.display = 'none';
  settingsMenu.appendChild(logoutBtn);
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    logoutBtn.style.display = 'none';
    document.getElementById('login-btn').style.display    = 'block';
    document.getElementById('register-btn').style.display = 'block';
    mostrarExito('Has cerrado sesión.');
  };

  // Verificar sesión al cargar
    // Verificar sesión al cargar
  async function showLogoutOption() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      logoutBtn.style.display = 'inline-block';
      document.getElementById('login-btn').style.display    = 'none';
      document.getElementById('register-btn').style.display = 'none';
      // Ocultar el campo email en formularios de soporte si ya hay sesión
      document.querySelectorAll('.formulario-soporte input[type="email"]')
        .forEach(el => el.style.display = 'none');
    }
  }
  showLogoutOption();

  // Registro
  document.getElementById('register-submit').onclick = async () => {
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const pass     = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm-password').value;
    const phone    = document.getElementById('reg-phone').value.trim() || null;

    if (!username) 
      return mostrarError('Nombre de usuario obligatorio.');
    if (pass !== confirm) 
      return mostrarError('Las contraseñas no coinciden.');

    // Verificar si ya existe
    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (fetchErr && fetchErr.code !== 'PGRST116') {
      console.error(fetchErr);
      return mostrarError('Error al comprobar el correo.');
    }
    if (existing) 
      return mostrarError('Este correo ya está registrado.');

    // Crear en Auth
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { username, phone },
        emailRedirectTo: `${location.origin}/bienvenida.html`
      }
    });
    if (signUpErr) 
      return mostrarError(signUpErr.message);

    // Insertar en tabla profiles
    const { error: profileErr } = await supabase
      .from('profiles')
      .insert([{ id: signUpData.user.id, email, username, phone }]);
    if (profileErr) {
      console.error(profileErr);
      return mostrarError('Error al crear tu perfil. Contacta soporte.');
    }

    toggleModal(mRegister);
    mostrarExito('¡Cuenta creada! Revisa tu correo para confirmar.');
  };

  // Inicio de sesión
  document.getElementById('login-submit').onclick = async () => {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) 
      return mostrarError('Inicio fallido: ' + error.message);

    toggleModal(mLogin);
    showLogoutOption();
    mostrarExito('Sesión iniciada.');

    // Enviar notificación de inicio por correo (serverless)
    fetch('/send-login-notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  };

  // Recuperar contraseña
  document.getElementById('open-forgot').onclick = () => {
    toggleModal(mLogin);
    toggleModal(mForgot);
  };
  document.getElementById('fog-request-code').onclick = async () => {
    const email = document.getElementById('fog-email').value.trim();
    const phone = document.getElementById('fog-phone').value.trim();

    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .eq('phone', phone)
      .single();
    if (!user) 
      return mostrarError('Email o teléfono no coinciden.');

    await fetch('/.netlify/functions/send-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone })
    });
    document.getElementById('fog-step2').classList.remove('oculto');
    mostrarExito('Código enviado. Revisa tu correo/SMS.');
  };
  document.getElementById('fog-verify-code').onclick = async () => {
    const email = document.getElementById('fog-email').value.trim();
    const code  = document.getElementById('fog-code').value.trim();

    const res = await fetch('/.netlify/functions/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const { valid } = await res.json();
    if (!valid) 
      return mostrarError('Código incorrecto.');

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + '/reset-password.html'
    });
    toggleModal(mForgot);
    mostrarExito('Revisa tu correo para cambiar tu contraseña.');
  };

  // Cambiar contraseña desde perfil
  document.getElementById('change-password-btn').onclick = async () => {
    const oldPass = document.getElementById('old-password').value;
    const newPass = document.getElementById('new-password').value;
    const { data: { session } } = await supabase.auth.getSession();
    const email = session.user.email;

    const res = await supabase.auth.signInWithPassword({ email, password: oldPass });
    if (res.error) 
      return mostrarError('Contraseña actual incorrecta.');

    const change = await supabase.auth.updateUser({ password: newPass });
    if (change.error) 
      return mostrarError('No se pudo cambiar la contraseña.');

    toggleModal(mChange);
    mostrarExito('Contraseña actualizada con éxito.');
  };

  // Descargas placeholder
  document.querySelectorAll('.descargar').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      mostrarExito('Próximamente disponibles en 2025.');
    };
  });

  // Toggle formularios de soporte
  window.toggleForm = id => {
    document.getElementById(id).classList.toggle('mostrar');
  };

  // Chat Carley Bot
  const chatWidget = document.getElementById('chat-widget');
  const openBtn    = document.getElementById('chat-open-btn');
  const closeBtn   = document.getElementById('chat-close-btn');
  const sendBtn    = document.getElementById('chat-send-btn');
  const inputField = document.getElementById('chat-input-field');
  const messagesEl = document.getElementById('chat-messages');
  let respuestas   = [];

  openBtn.onclick  = () => chatWidget.classList.remove('oculto');
  closeBtn.onclick = () => chatWidget.classList.add('oculto');

  async function cargarRespuestas() {
    const res = await fetch('data/respuestas.json');
    return res.json();
  }
  async function initBot() {
    respuestas = await cargarRespuestas();
  }
  initBot();

  function appendMessage(text, isBot = false) {
    const msg = document.createElement('div');
    msg.className = isBot ? 'msg bot' : 'msg user';
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function mostrarBotonesRedes() {
    const html = `
      <div class="redes-botones">
        <a href="https://youtube.com/@carleyinteractivestudio?si=L4xipACppCy4u6-2" target="_blank">📺 YouTube</a>
        <a href="https://whatsapp.com/channel/0029Vao9B2OJP21CsSXDHL20" target="_blank">📱 WhatsApp</a>
        <a href="https://www.facebook.com/share/19Lb2KuphF/" target="_blank">📘 Facebook</a>
      </div>`;
    messagesEl.innerHTML += html;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function obtenerRespuesta(txt) {
    const msg = txt.toLowerCase();
    for (const r of respuestas) {
      if (r.intents.some(i => msg.includes(i))) {
        return r.respuesta;
      }
    }
    return null;
  }

  sendBtn.onclick = () => {
    const text = inputField.value.trim();
    if (!text) return;
    appendMessage(text, false);
    inputField.value = '';
    setTimeout(() => {
      const resp = obtenerRespuesta(text);
      if (resp) appendMessage(resp, true);
      else {
        appendMessage('Lo siento, no entendí. Te dejo mis redes:', true);
        mostrarBotonesRedes();
      }
    }, 300);
  };

  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
  });
});