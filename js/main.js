window.addEventListener('DOMContentLoaded', () => {
  // The global 'supabase' object is initialized in index.html's <head> script.
  // This script can use it directly.

  // Helpers
  const settingsBtn  = document.getElementById('settings-btn');
  const settingsMenu = document.getElementById('settings-menu');
  const backDrop     = document.getElementById('modal-backdrop');
  const mLogin       = document.getElementById('modal-login');
  const mRegister    = document.getElementById('modal-register');
  const mForgot      = document.getElementById('modal-forgot');

  function toggleModal(modal) {
    const hidden = modal.classList.contains('oculto');
    [modal, backDrop].forEach(el =>
      el.classList.toggle('oculto', !hidden)
    );
  }

  // Menú de opciones
  settingsBtn.onclick = () => {
    const shown = settingsMenu.style.display === 'flex';
    settingsMenu.style.display = shown ? 'none' : 'flex';
  };
  document.getElementById('back-btn').onclick = () => {
    settingsMenu.style.display = 'none';
  };
  document.getElementById('login-btn').onclick    = () => toggleModal(mLogin);
  document.getElementById('register-btn').onclick = () => toggleModal(mRegister);
  backDrop.onclick = () => [mLogin, mRegister, mForgot, backDrop].forEach(el =>
    el.classList.add('oculto')
  );

  // Supabase Auth: Registro
  document.getElementById('register-submit').onclick = async () => {
    const email    = document.getElementById('reg-email').value;
    const pass     = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm-password').value;
    const phone    = document.getElementById('reg-phone').value || null;
    if (pass !== confirm) return alert('Las contraseñas no coinciden.');

    const { error } = await supabase.auth.signUp({
      email, password: pass, options: { data: { phone } }
    });
    if (error) return alert(error.message);
    toggleModal(mRegister);
    showLogoutOption();
    alert('¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.');
  };

  // Supabase Auth: Login
  document.getElementById('login-submit').onclick = async () => {
    const email = document.getElementById('login-email').value;
    const pass  = document.getElementById('login-password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return alert(error.message);
    toggleModal(mLogin);
    showLogoutOption();
    alert('¡Bienvenido de nuevo!');
  };

  // Supabase Auth: Logout
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.id = 'logout-btn-menu';
  logoutBtn.style.display = 'none';
  logoutBtn.classList.add('boton-juego');
  settingsMenu.appendChild(logoutBtn);

  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    logoutBtn.style.display = 'none';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('register-btn').style.display = 'block';
    alert('Has cerrado sesión.');
  };

  // Verifica sesión al cargar
  async function showLogoutOption() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      logoutBtn.style.display = 'inline-block';
      document.getElementById('login-btn').style.display = 'none';
      document.getElementById('register-btn').style.display = 'none';
    }
  }
  showLogoutOption();

  // Recuperación de contraseña
  document.getElementById('open-forgot').onclick = () => {
    toggleModal(mLogin);
    toggleModal(mForgot);
  };

  document.getElementById('fog-request-code').onclick = async () => {
    const email = document.getElementById('fog-email').value;
    const phone = document.getElementById('fog-phone').value;

    // The original logic here was complex and depended on serverless functions
    // and database queries which are not secure or available.
    // Simplifying to the basic Supabase password reset flow.
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/Recuperacion.html' });
    if (error) {
        return alert('Error al enviar correo de recuperación: ' + error.message);
    }
    document.getElementById('fog-step2').classList.remove('oculto');
    alert('Se ha enviado un enlace de recuperación a tu correo. Si no lo ves en tu bandeja de entrada, por favor revisa tu carpeta de spam.');
  };

  document.getElementById('fog-verify-code').onclick = async () => {
    alert('Por favor, busca el correo de recuperación en tu bandeja de entrada y sigue las instrucciones para cambiar tu contraseña.');
  };

  // Descarga con alerta
  document.querySelectorAll('.descargar').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      alert('Este proyecto aún está en desarrollo.\nPróximamente “Creative Engine” para que tú también crees tu mundo.');
    };
  });

  // This function is called by inline onclick attributes in the HTML
  window.toggleForm = (id) => {
    document.getElementById(id).classList.toggle('mostrar');
  }

  // Chat: Carley Bot
  const chatWidget   = document.getElementById('chat-widget');
  const openBtn      = document.getElementById('chat-open-btn');
  const closeBtn     = document.getElementById('chat-close-btn');
  const sendBtn      = document.getElementById('chat-send-btn');
  const inputField   = document.getElementById('chat-input-field');
  const messagesEl   = document.getElementById('chat-messages');

  openBtn.onclick  = () => chatWidget.classList.remove('oculto');
  closeBtn.onclick = () => chatWidget.classList.add('oculto');

  function appendMessage(text, isBot = false) {
    const msg = document.createElement('div');
    msg.className = isBot ? 'msg bot' : 'msg user';
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getBotResponse(txt) {
    const msg = txt.toLowerCase();

    if (msg.includes('recuper') && msg.includes('cuenta')) {
      return 'Para recuperar su contrasena dirigese a comfiguracion, si estas con la sesion inisiada presiona serrar sesion, luego iniciarsesion y por ultimo presiona me olvide de mi contrasena, poner los datos y listo se le mandara un codigo con la cual podras cambiar su contrasena, puedo ayudarte en otra cosea?';
    }
    if (msg.includes('whatsapp')) {
      return 'Únete a nuestro canal: https://whatsapp.com/channel/0029Vao9B2OJP21CsSXDHL20';
    }
    if (msg.includes('proyecto') || msg.includes('objetivo')) {
      return 'Desarrollamos juegos como Fire at Will y estamos creando Creative Engine para que tú también diseñes tu propio mundo.';
    }
    if (msg.includes('recuperar') && msg.includes('cuenta')) {
    return 'Pulsa "¿Olvidaste tu contraseña?" y sigue los pasos para recuperar tu cuenta.';
  }

  if (msg.includes('descargar') && msg.includes('fire at will')) {
    return 'Fire at Will estará disponible en Android y se lanzará en 2025. ¡Prepárate para la acción!';
  }

  if (msg.includes('descargar') && msg.includes('the battle')) {
    return 'The Battle of the Capsurers estará disponible en Android. ¡Explora su mundo multijugador!';
  }

  if (msg.includes('la república')) {
    return 'La República está en desarrollo. Pronto habrá noticias sobre su lanzamiento.';
  }

  if (msg.includes('power force')) {
    return 'Power Force está en preparación. ¡Mantente atento para conocer más detalles!';
  }

  if (msg.includes('creative engine') || msg.includes('motor') || msg.includes('engine')) {
    return 'Creative Engine es nuestro motor con IA para que diseñes tus propios videojuegos. ¡Muy pronto!';
  }

  if (msg.includes('cuándo') && msg.includes('sale')) {
    return 'Nuestros juegos principales están planeados para lanzarse en 2025.';
  }

  if (msg.includes('iniciar sesión') || msg.includes('login') || msg.includes('entrar')) {
    return 'Presiona el icono ⚙️, luego "Iniciar sesión" e ingresa tu correo y contraseña.';
  }

  if (msg.includes('crear cuenta') || msg.includes('registro') || msg.includes('registrarme')) {
    return 'Haz clic en ⚙️ → "Crear cuenta" y completa los campos para registrarte.';
  }

  if (msg.includes('hola') || msg.includes('buenas') || msg.includes('saludos')) {
    return '¡Hola! Soy Carley Bot. ¿En qué puedo ayudarte hoy?';
  }

  if (msg.includes('gracias') || msg.includes('thank you')) {
    return '¡Gracias a ti! Estoy para ayudarte cuando quieras 😊';
  }

  if (msg.includes('quién eres') || msg.includes('como te llamas') || msg.includes('cual es tu nombre')) {
    return 'Soy Carley Bot, el asistente de Carley Interactive Studio. ¡Un gusto conocerte!';
  }

  if (msg.includes('ayuda') || msg.includes('comandos') || msg.includes('puedes hacer')) {
    return 'Puedo ayudarte con descargas, inicio de sesión, soporte y responder dudas sobre nuestros juegos.';
  }

  if (msg.includes('adiós') || msg.includes('nos vemos') || msg.includes('hasta luego')) {
    return '¡Hasta pronto! Si me necesitas, estaré por aquí 👋';
  }

  if (msg.includes('redes sociales') || msg.includes('facebook') || msg.includes('youtube')) {
    return 'Puedes seguirnos en YouTube, Facebook y WhatsApp. Los enlaces están justo aquí abajo 👇';
  }

  if (msg.includes('términos') || msg.includes('condiciones') || msg.includes('licencia')) {
    return 'Puedes consultar nuestros Términos de Uso y política de privacidad al final de la página.';
  }

  if (msg.includes('contacto') || msg.includes('soporte') || msg.includes('problema')) {
    return 'Envía un mensaje usando el formulario de soporte debajo de cada juego, o escríbenos directamente.';
  }

  if (msg.includes('creador') || msg.includes('quién te creó') || msg.includes('john')) {
    return 'Fui creado por John Carley, fundador de Carley Interactive Studio. 🔥';
  }

  if (msg.includes('chiste') || msg.includes('hazme reír')) {
    return '¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25 🎃➡️🎄';
  }

  if (msg.includes('facebook') && msg.includes('grupo')) {
    return 'Únete a nuestro grupo en Facebook para compartir ideas, memes y conocer a otros jugadores: https://facebook.com/groups/carleyJuego';
  }
    if (msg.includes('creador') || msg.includes('dueñ')) {
      return 'Fui creado por John Carley, el genio detras de Carley Interactive Studio';
    }
    if (msg.includes('hola') || msg.includes('buen')) {
      return '¡Hola! Soy Carley Bot. ¿En qué puedo ayudarte?';
    }
    return 'Lo siento, su pregunta va mas alla de mi capacidad y conosimiento, puedes contactar a mi creador y hacer su pregunta. Puedo ayudarte con recuperación de cuenta, WhatsApp, proyectos o información general.';
  }

  sendBtn.onclick = () => {
    const text = inputField.value.trim();
    if (!text) return;
    appendMessage(text, false);
    inputField.value = '';
    setTimeout(() => {
      appendMessage(getBotResponse(text), true);
    }, 300);
  };

  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
  });
});
