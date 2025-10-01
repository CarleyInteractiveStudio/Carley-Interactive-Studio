import os
from dotenv import load_dotenv
from supabase import create_client, Client
import mimetypes

def setup_supabase_client():
    """Loads environment variables and initializes the Supabase client."""
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in a .env file.")
    return create_client(url, key)

# Initialize the client
try:
    supabase = setup_supabase_client()
    BUCKET_NAME = "media"
except ValueError as e:
    print(f"Error: {e}")
    supabase = None

def get_sections():
    """Fetches all sections from the database."""
    if not supabase: return []
    try:
        response = supabase.from_("sections").select("id, name").execute()
        return response.data or []
    except Exception as e:
        print(f"Error fetching sections: {e}")
        return []

def create_section(name: str):
    """Creates a new section in the database."""
    if not supabase: return None
    try:
        response = supabase.from_("sections").insert({"name": name}).execute()
        print(f"Section '{name}' created successfully.")
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error creating section: {e}")
        return None

def upload_file(file_path: str) -> str | None:
    """
    Uploads a file to the Supabase storage bucket 'media'.
    Returns the file name (path in bucket) if successful, otherwise None.
    """
    if not supabase: return None
    try:
        file_name = os.path.basename(file_path)
        content_type, _ = mimetypes.guess_type(file_path)
        content_type = content_type or 'application/octet-stream'

        with open(file_path, 'rb') as f:
            # The API expects the path in the bucket and the file object.
            supabase.storage.from_(BUCKET_NAME).upload(
                path=file_name,
                file=f,
                file_options={"content-type": content_type}
            )
        print(f"File '{file_name}' uploaded successfully.")
        return file_name
    except Exception as e:
        # Check if the error is due to a duplicate file, which is acceptable.
        if "Duplicate" in str(e):
            print(f"File '{os.path.basename(file_path)}' already exists. Reusing.")
            return os.path.basename(file_path)
        else:
            print(f"Error uploading file '{os.path.basename(file_path)}': {e}")
            return None

def create_publication(section_id: int, title: str, description: str, images: list = None, video: str = None, youtube: str = None):
    """
    Creates a new publication in the database.
    'images' and 'video' should be file names in the Supabase storage bucket.
    """
    if not supabase: return None
    try:
        data_to_insert = {
            "section_id": section_id,
            "title": title,
            "description": description,
            "images": images,
            "video": video,
            "youtube": youtube
        }
        response = supabase.from_("publications").insert(data_to_insert).execute()
        print(f"Publication '{title}' created successfully.")
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error creating publication: {e}")
        return None

def create_collaborator(name: str, description: str, photo_path: str):
    """Uploads a collaborator's photo and creates a record in the database."""
    if not supabase: return None
    try:
        # First, upload the photo
        uploaded_photo_name = upload_file(photo_path)
        if not uploaded_photo_name:
            raise Exception("Failed to upload collaborator photo.")

        # Then, create the record in the database
        data_to_insert = {
            "name": name,
            "description": description,
            "photo_url": uploaded_photo_name
        }
        response = supabase.from_("collaborators").insert(data_to_insert).execute()
        print(f"Collaborator '{name}' created successfully.")
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error creating collaborator: {e}")
        return None

if __name__ == '__main__':
    # This block is for testing the functions.
    # Before running, make sure you have a .env file with your Supabase credentials.
    if supabase:
        print("Supabase client initialized. Testing functions...")

        # 1. Fetch sections
        print("\n--- Fetching Sections ---")
        all_sections = get_sections()
        if all_sections:
            print("Available sections:", all_sections)
        else:
            print("No sections found. You can create one using the app.")

        print("\nBackend logic is ready. Next step is the GUI.")
    else:
        print("Could not initialize Supabase client. Please check your .env file.")