# Cómo obtener tu PayPal Client ID para Carley Studio

Sigue estos pasos para activar las donaciones reales en tu sitio web:

1.  **Entra a PayPal Developer:** Ve a [developer.paypal.com](https://developer.paypal.com/) e inicia sesión con tu cuenta de PayPal.
2.  **Dashboard:** Haz clic en "Dashboard" (arriba a la derecha).
3.  **Apps & Credentials:** Ve a la sección "Apps & Credentials".
4.  **Live:** Asegúrate de estar en la pestaña **"Live"** (no en Sandbox) para recibir dinero real.
5.  **Create App:** Haz clic en "Create App". Ponle un nombre como `CarleyStudioDonations`.
6.  **Copia el Client ID:** Una vez creada, verás una clave larga llamada **Client ID**.
7.  **Sustituye en el código:** Debes abrir los archivos `creative-engine.html`, `vid-spri.html` y `donaciones.html` y buscar la línea:
    `script src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"`
    Cambia `test` por tu clave larga.

**Nota:** Ya he configurado tu **Client ID Real** (`Aa2neOo...`) en todo el sitio web (`creative-engine.html`, `vid-spri.html` y `donaciones.html`). ¡Las donaciones ya están activas y listas para recibir pagos reales!
