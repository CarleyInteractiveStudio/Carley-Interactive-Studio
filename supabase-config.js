// =================================================
// ARCHIVO CENTRAL DE CONFIGURACIÓN DE SUPABASE
// =================================================
// Este archivo contiene las credenciales de tu proyecto de Supabase
// y crea UNA ÚNICA instancia del cliente para que la use todo el sitio.

const SUPABASE_URL = 'https://pufujgwkagbpvbkzbeiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZnVqZ3drYWdicHZia3piZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTA1MDksImV4cCI6MjA3NDgyNjUwOX0.cdX3dzjH_KUHQ9SuUjnM6Tvel0LQOY6SnnVz82K1n_E';

// Se asume que el script de Supabase CDN ya se ha cargado y ha creado el objeto global 'supabase'.
// Creamos nuestra instancia del cliente y la asignamos a una nueva variable global para evitar conflictos.
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);