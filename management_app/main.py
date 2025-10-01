import os
from dotenv import load_dotenv
from supabase import create_client, Client
import mimetypes

def save_credentials_to_env(url: str, key: str):
    """Saves the provided credentials to a .env file in the app's directory."""
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    with open(dotenv_path, 'w') as f:
        f.write(f'SUPABASE_URL="{url}"\n')
        f.write(f'SUPABASE_KEY="{key}"\n')
    print(f".env file created/updated at {dotenv_path}")

def setup_supabase_client():
    """
    Loads environment variables and initializes the Supabase client.
    Returns None if the .env file or keys are missing.
    """
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(dotenv_path):
        return None
    load_dotenv(dotenv_path=dotenv_path)
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)

supabase = setup_supabase_client()
BUCKET_NAME = "media"

def get_sections():
    """Fetches all sections from the database."""
    if not supabase: return [], "Cliente de Supabase no inicializado."
    try:
        response = supabase.from_("sections").select("id, name").execute()
        return response.data or [], None
    except Exception as e:
        return [], f"Error al cargar secciones: {e}"

def create_section(name: str):
    """Creates a new section. Returns (data, error_message)."""
    if not supabase: return None, "Cliente de Supabase no inicializado."
    try:
        response = supabase.from_("sections").insert({"name": name}).execute()
        if response.data:
            return response.data[0], f"Sección '{name}' creada con éxito."
        else:
            # Try to parse a more specific error from the Supabase response
            error_details = response.get("error", {}).get("message", "Error desconocido.")
            return None, f"No se pudo crear la sección: {error_details}"
    except Exception as e:
        return None, f"Error al crear sección: {e}"

def upload_file(file_path: str):
    """Uploads a file. Returns (file_name, message)."""
    if not supabase: return None, "Cliente de Supabase no inicializado."
    try:
        file_name = os.path.basename(file_path)
        content_type, _ = mimetypes.guess_type(file_path)
        content_type = content_type or 'application/octet-stream'

        with open(file_path, 'rb') as f:
            supabase.storage.from_(BUCKET_NAME).upload(
                path=file_name,
                file=f,
                file_options={"content-type": content_type, "upsert": "true"} # Upsert allows overwriting
            )
        return file_name, f"Archivo '{file_name}' subido."
    except Exception as e:
        error_str = str(e)
        if "Duplicate" in error_str or "23505" in error_str: # Handle duplicate error code
             return os.path.basename(file_path), f"Archivo '{os.path.basename(file_path)}' ya existía. Reutilizando."
        # A common error is the bucket not existing
        elif "Bucket not found" in error_str:
            return None, f"Error: El contenedor (bucket) '{BUCKET_NAME}' no existe en Supabase Storage."
        else:
            return None, f"Error al subir '{os.path.basename(file_path)}': {error_str}"

def create_publication(section_id: int, title: str, description: str, images: list = None, video: str = None, youtube: str = None):
    """Creates a new publication. Returns (data, error_message)."""
    if not supabase: return None, "Cliente de Supabase no inicializado."
    try:
        data_to_insert = {
            "section_id": section_id, "title": title, "description": description,
            "images": images, "video": video, "youtube": youtube
        }
        response = supabase.from_("publications").insert(data_to_insert).execute()
        if response.data:
            return response.data[0], f"Publicación '{title}' creada con éxito."
        else:
            error_details = response.get("error", {}).get("message", "Error desconocido.")
            return None, f"No se pudo crear la publicación: {error_details}"
    except Exception as e:
        return None, f"Error al crear publicación: {e}"

def create_collaborator(name: str, description: str, photo_path: str):
    """Creates a collaborator. Returns (data, error_message)."""
    if not supabase: return None, "Cliente de Supabase no inicializado."
    try:
        # First, upload the photo
        uploaded_photo_name, message = upload_file(photo_path)
        if not uploaded_photo_name:
            # The error message from upload_file is passed through
            raise Exception(message)

        # Then, create the record in the database
        data_to_insert = {"name": name, "description": description, "photo_url": uploaded_photo_name}
        response = supabase.from_("collaborators").insert(data_to_insert).execute()
        if response.data:
            return response.data[0], f"Colaborador '{name}' añadido con éxito."
        else:
            error_details = response.get("error", {}).get("message", "Error desconocido.")
            return None, f"No se pudo añadir al colaborador: {error_details}"
    except Exception as e:
        return None, f"Error al crear colaborador: {e}"

if __name__ == '__main__':
    if supabase:
        print("Supabase client initialized successfully.")
    else:
        print("Supabase client could not be initialized. Please run gui.py to configure.")