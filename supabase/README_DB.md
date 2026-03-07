# Configuración del Servidor Supabase - Carley Studio

Este directorio contiene los scripts necesarios para configurar tu backend en Supabase y que los datos (opiniones, donaciones, perfiles) se carguen de verdad.

## Pasos para instalar:

1. Entra a tu panel de **Supabase**.
2. Ve a la sección **SQL Editor**.
3. (Opcional) Copia y ejecuta el contenido de `nuclear_reset.sql` si quieres borrar ABSOLUTAMENTE TODO (tablas, funciones, triggers anteriores) y empezar de limpio total.
4. Copia y ejecuta el contenido de `setup.sql`. Esto creará las tablas y la seguridad necesaria.

## Tablas Creadas:

1.  **profiles**: Almacena el nombre, foto, sexo y tipo de uso de cada usuario. Se crea automáticamente cuando alguien se registra.
2.  **opinions**: Aquí se guardan los comentarios que la gente deja en Creative Engine y Vid Spri.
3.  **reports**: Almacena los fallos (bugs) enviados por los usuarios.
4.  **claims**: Guarda las reclamaciones de dinero o soporte.
5.  **donations**: El registro real de quién ha donado y cuánto. Se actualiza cada vez que alguien paga con PayPal en la web.

## Seguridad:

- He configurado **RLS (Row Level Security)**.
- Las donaciones y opiniones son públicas para que todos puedan ver el progreso y los comentarios.
- Los reportes y reclamos pueden enviarse, pero no son visibles públicamente por seguridad.
- Los perfiles solo pueden ser editados por su dueño.

---
*Configurado por Jules para Carley Interactive Studio.*
