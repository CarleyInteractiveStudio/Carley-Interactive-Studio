-- Reset Script: Borra todo lo anterior para empezar de cero
-- Ejecuta esto en el Editor SQL de Supabase antes del script de configuración

-- 1. Eliminar Triggers y Funciones
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Eliminar Tablas (El orden importa por las referencias)
DROP TABLE IF EXISTS public.donations;
DROP TABLE IF EXISTS public.claims;
DROP TABLE IF EXISTS public.reports;
DROP TABLE IF EXISTS public.opinions;
DROP TABLE IF EXISTS public.profiles;

-- Nota: Esto no borrará los usuarios de Auth.Users, solo sus perfiles extendidos.
