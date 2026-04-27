# Carley Interactive Studio - SSO API & Bridge Documentation

Esta documentación explica cómo integrar otros sitios de Carley Interactive Studio con el sistema central de usuarios y base de datos de `carleystudio.com`.

## 1. El Puente (Bridge)
El archivo `bridge.html` en el dominio principal actúa como un proxy seguro. Los sitios secundarios deben cargarlo en un iframe invisible.

## 2. Configuración en el Sitio Secundario
Para usar el bridge, añade este iframe a tu página:
```html
<iframe id="sso-bridge" src="https://carleystudio.com/bridge.html" style="display:none;"></iframe>
```

## 3. Cómo solicitar datos (JavaScript)
Usa la función `postMessage` para comunicarte con el bridge.

### A. Verificar Sesión
```javascript
const bridge = document.getElementById('sso-bridge').contentWindow;

// Enviar solicitud
bridge.postMessage({
    type: 'CHECK_SESSION',
    requestId: 'req-001'
}, 'https://carleystudio.com');

// Escuchar respuesta
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://carleystudio.com') return;

    if (event.data.type === 'SESSION_RESPONSE') {
        const user = event.data.payload;
        if (user) {
            console.log("Usuario logueado:", user.email);
        } else {
            console.log("No hay sesión activa.");
        }
    }
});
```

### B. Consultar la Base de Datos
```javascript
bridge.postMessage({
    type: 'SUPABASE_CALL',
    payload: {
        table: 'user_games',
        method: 'select',
        query: '*',
        filter: { user_id: 'ID_DEL_USUARIO' }
    },
    requestId: 'req-002'
}, 'https://carleystudio.com');
```

## 4. Seguridad
*   **Origen:** Solo los dominios en la lista blanca de `bridge.html` pueden realizar peticiones.
*   **RLS:** Aunque el bridge permite la llamada, las reglas de Row Level Security (RLS) de Supabase siguen vigentes. El usuario solo podrá ver/editar lo que sus permisos permitan.
*   **HTTPS:** Toda la comunicación debe ser sobre HTTPS.

---
© 2026 Carley Interactive Studio. Confidencial y de uso interno.
