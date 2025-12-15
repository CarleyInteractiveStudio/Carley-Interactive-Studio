from fastapi import FastAPI, Form, UploadFile, File, Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
import uuid
import datetime
import shutil
from typing import List

# --- Configuración Inicial de la App ---
app = FastAPI(
    title="API de Soporte - Carley Interactive Studio",
    description="Recibe y gestiona las solicitudes de soporte de los usuarios.",
    version="1.0.0"
)

# --- Configuración de CORS ---
# Permite que el frontend (desde cualquier origen) se comunique con esta API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

# --- Rutas para Almacenamiento y Seguridad ---
TICKETS_DIR = "tickets"
UPLOADS_DIR = "uploads"
os.makedirs(TICKETS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Monta el directorio de 'uploads' para que los archivos sean accesibles vía URL
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Clave de API - Se lee desde una variable de entorno para mayor seguridad.
# Se proporciona un valor por defecto para facilitar el desarrollo local.
API_KEY = os.getenv("API_KEY", "c4r13y-5up3r-53cr3t-4p1-k3y-f0r-d35kt0p-4pp")
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials"
        )

# --- Endpoints de la API ---

@app.get("/", tags=["General"])
def read_root():
    """Endpoint principal para verificar que el servidor está funcionando."""
    return {"message": "Bienvenido a la API de Soporte. El servidor está operativo."}

@app.post("/tickets", status_code=status.HTTP_201_CREATED, tags=["Tickets"])
async def create_ticket(
    reason: str = Form(...),
    app_name: str = Form(..., alias="app"), # El alias es por si el nombre del campo en el form es 'app'
    email: str = Form(...),
    description: str = Form(...),
    files: List[UploadFile] = File(None)
):
    """
    Crea un nuevo ticket de soporte a partir de los datos del formulario.
    """
    ticket_id = str(uuid.uuid4())
    timestamp = datetime.datetime.now().isoformat()

    uploaded_file_info = []
    if files:
        for file in files:
            # Crea un nombre de archivo único para evitar colisiones
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            file_path = os.path.join(UPLOADS_DIR, unique_filename)

            # Guarda el archivo en el servidor
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            uploaded_file_info.append({
                "original_filename": file.filename,
                "stored_filename": unique_filename,
                "content_type": file.content_type,
                "url": f"/uploads/{unique_filename}"
            })

    ticket_data = {
        "id": ticket_id,
        "timestamp": timestamp,
        "status": "open",
        "reason": reason,
        "app": app_name,
        "email": email,
        "description": description,
        "attachments": uploaded_file_info
    }

    # Guarda los datos del ticket en un archivo JSON
    with open(os.path.join(TICKETS_DIR, f"{ticket_id}.json"), "w") as f:
        json.dump(ticket_data, f, indent=4)

    return {"status": "success", "message": "Ticket creado exitosamente.", "ticket_id": ticket_id}


@app.get("/tickets", tags=["Tickets (Protegido)"])
def list_tickets(api_key: str = Depends(get_api_key)):
    """
    Lista todos los IDs de los tickets de soporte. Protegido por clave de API.
    """
    tickets = [f.replace(".json", "") for f in os.listdir(TICKETS_DIR) if f.endswith(".json")]
    return {"tickets": tickets}


@app.get("/tickets/{ticket_id}", tags=["Tickets (Protegido)"])
def get_ticket(ticket_id: str, api_key: str = Depends(get_api_key)):
    """
    Obtiene los detalles completos de un ticket específico. Protegido por clave de API.
    """
    ticket_path = os.path.join(TICKETS_DIR, f"{ticket_id}.json")
    if not os.path.exists(ticket_path):
        raise HTTPException(status_code=404, detail="Ticket no encontrado")

    with open(ticket_path, "r") as f:
        ticket_data = json.load(f)

    return ticket_data


@app.delete("/tickets/{ticket_id}", status_code=status.HTTP_200_OK, tags=["Tickets (Protegido)"])
def delete_ticket(ticket_id: str, api_key: str = Depends(get_api_key)):
    """
    Elimina un ticket de soporte y todos sus archivos adjuntos. Protegido por clave de API.
    """
    ticket_path = os.path.join(TICKETS_DIR, f"{ticket_id}.json")
    if not os.path.exists(ticket_path):
        raise HTTPException(status_code=404, detail="Ticket no encontrado")

    try:
        # Primero, lee los datos del ticket para encontrar los archivos adjuntos
        with open(ticket_path, "r") as f:
            ticket_data = json.load(f)

        # Elimina los archivos adjuntos de la carpeta 'uploads'
        if "attachments" in ticket_data and ticket_data["attachments"]:
            for attachment in ticket_data["attachments"]:
                stored_filename = attachment.get("stored_filename")
                if stored_filename:
                    file_to_delete_path = os.path.join(UPLOADS_DIR, stored_filename)
                    if os.path.exists(file_to_delete_path):
                        os.remove(file_to_delete_path)

        # Finalmente, elimina el archivo JSON del ticket
        os.remove(ticket_path)

        return {"status": "success", "message": f"Ticket {ticket_id} y sus adjuntos han sido eliminados."}

    except Exception as e:
        # Captura cualquier error inesperado durante el proceso
        raise HTTPException(status_code=500, detail=f"Error al eliminar el ticket: {str(e)}")
