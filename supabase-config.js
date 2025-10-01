// =================================================
// ARCHIVO CENTRAL DE CONFIGURACIÓN DE SUPABASE
// =================================================
// Este archivo contiene las credenciales de tu proyecto de Supabase.
// Todos los demás scripts usarán este archivo para conectarse.
// Si alguna vez necesitas cambiar tus claves, solo tienes que hacerlo aquí.

const SUPABASE_URL = 'https://pufujgwkagbpvbkzbeiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZnVqZ3drYWdicHZia3piZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTA1MDksImV4cCI6MjA3NDgyNjUwOX0.cdX3dzjH_KUHQ9SuUjnM6Tvel0LQOY6SnnVz82K1n_E';

// Inicializamos el cliente de Supabase.
// La librería `supabase-js@2` se carga en los archivos HTML y crea el objeto global `supabase`.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);