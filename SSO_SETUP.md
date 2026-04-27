# Configuración de SSO - Carley Studio

Este documento explica cómo configurar tus otros sitios web (`carleyengine.com` y `creativegame.online`) para usar el nuevo sistema de autenticación centralizado de **carleystudio.com**.

## 1. Iniciar sesión desde el Sitio Cliente

Para enviar a un usuario a iniciar sesión, redirígelo a la página de SSO con los parámetros de tu dominio:

```javascript
const domain = "carleyengine.com"; // O "creativegame.online"
const redirectTo = window.location.href; // URL a la que volverá el usuario
window.location.href = `https://carleystudio.com/sso.html?domain=${domain}&redirect_to=${redirectTo}`;
```

## 2. Recibir la sesión en el Sitio Cliente

Cuando el usuario regrese, los datos vendrán en el **hash** de la URL para mayor seguridad. Debes capturarlos así:

```javascript
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('sso_token');
    const userId = params.get('user_id');

    if (token) {
        console.log("¡Sesión recibida!", token);
        // Aquí puedes inicializar tu cliente de Supabase local con este token
        // window.location.hash = ""; // Limpia la URL después de capturarlo
    }
});
```

## 3. Consultar datos en segundo plano (Puente Invisible)

Para hacer llamadas a la base de datos sin pedirle al usuario que inicie sesión de nuevo, usa un `iframe` invisible que apunte a `bridge.html`:

### Paso A: Añadir el Iframe
```html
<iframe id="sso-bridge" src="https://carleystudio.com/bridge.html" style="display:none;"></iframe>
```

### Paso B: Enviar una petición
```javascript
const bridge = document.getElementById('sso-bridge').contentWindow;

// Pedir datos del perfil
bridge.postMessage({
    type: 'SUPABASE_CALL',
    payload: {
        table: 'profiles',
        method: 'select',
        query: '*',
        filter: { id: 'ID_DEL_USUARIO' }
    },
    requestId: 'mi-peticion-1'
}, 'https://carleystudio.com');

// Escuchar la respuesta
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://carleystudio.com') return;

    if (event.data.type === 'SUPABASE_RESPONSE') {
        console.log("Datos recibidos:", event.data.payload);
    }
});
```

---
**Nota de Seguridad:** Por razones de privacidad, los códigos de configuración de base de datos no se incluyen en este documento público. Solo los dominios autorizados en `js/sso.js` y `bridge.html` pueden usar este sistema. Si añades un nuevo sitio, asegúrate de actualizar la lista blanca en esos archivos.
