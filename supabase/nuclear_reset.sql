-- NUCLEAR RESET SCRIPT: Borra absolutamente todo en el esquema 'public'
-- Úsalo solo si quieres empezar de cero total.

-- 1. Eliminar todos los triggers del esquema public
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name, event_object_table
              FROM information_schema.triggers
              WHERE trigger_schema = 'public')
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON ' || r.event_object_table || ';';
    END LOOP;
END $$;

-- 2. Eliminar todas las funciones del esquema public
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT proname, oidvectortypes(parameter_ids) as args
              FROM pg_proc p
              JOIN pg_namespace n ON p.pronamespace = n.oid
              WHERE n.nspname = 'public')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || r.proname || '(' || r.args || ') CASCADE;';
    END LOOP;
END $$;

-- 3. Eliminar todas las tablas del esquema public (incluyendo vistas)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || r.tablename || ' CASCADE;';
    END LOOP;
END $$;

-- 4. Re-crear el esquema public para asegurar limpieza total
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

-- Ahora puedes ejecutar setup.sql para reconstruir la base de datos de Carley Studio.
