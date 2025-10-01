import customtkinter as ctk
from tkinter import filedialog
import os
import main as backend # Import our backend logic

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Carley Studio - Gestor de Contenido")
        self.geometry("600x800") # Increased height for the new tab
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # Create Tab View
        self.tab_view = ctk.CTkTabview(self)
        self.tab_view.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        self.tab_view.add("Crear Publicación")
        self.tab_view.add("Crear Sección")
        self.tab_view.add("Añadir Colaborador") # New tab

        # --- Setup Tabs ---
        self.setup_publication_tab()
        self.setup_section_tab()
        self.setup_collaborator_tab() # Setup for the new tab

        # --- Status Label ---
        self.status_label = ctk.CTkLabel(self, text="¡Bienvenido! Crea tu .env y luego reinicia la app.", text_color="gray")
        self.status_label.grid(row=1, column=0, padx=20, pady=(0, 10), sticky="w")

        # Initial load
        if backend.supabase:
            self.refresh_sections()
        else:
            self.update_status("Error: No se pudo conectar a Supabase. Revisa tu .env.", clear_after=0)


    def setup_publication_tab(self):
        tab = self.tab_view.tab("Crear Publicación")
        tab.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(tab, text="Sección:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.section_menu = ctk.CTkOptionMenu(tab, values=["Cargando..."])
        self.section_menu.grid(row=0, column=1, padx=10, pady=10, sticky="ew")

        ctk.CTkLabel(tab, text="Título:").grid(row=1, column=0, padx=10, pady=10, sticky="w")
        self.title_entry = ctk.CTkEntry(tab, placeholder_text="Título de la publicación")
        self.title_entry.grid(row=1, column=1, padx=10, pady=10, sticky="ew")

        ctk.CTkLabel(tab, text="Descripción:").grid(row=2, column=0, padx=10, pady=10, sticky="w")
        self.description_textbox = ctk.CTkTextbox(tab, height=100)
        self.description_textbox.grid(row=2, column=1, padx=10, pady=10, sticky="ew")

        ctk.CTkLabel(tab, text="Imágenes:").grid(row=3, column=0, padx=10, pady=10, sticky="w")
        self.image_button = ctk.CTkButton(tab, text="Seleccionar Imágenes", command=self.select_images)
        self.image_button.grid(row=3, column=1, padx=10, pady=10, sticky="w")
        self.image_label = ctk.CTkLabel(tab, text="No hay imágenes seleccionadas", text_color="gray", wraplength=350)
        self.image_label.grid(row=4, column=1, padx=10, pady=(0,10), sticky="w")
        self.selected_images = []

        ctk.CTkLabel(tab, text="Video (Opcional):").grid(row=5, column=0, padx=10, pady=10, sticky="w")
        self.video_button = ctk.CTkButton(tab, text="Seleccionar Video", command=self.select_video)
        self.video_button.grid(row=5, column=1, padx=10, pady=10, sticky="w")
        self.video_label = ctk.CTkLabel(tab, text="No hay video seleccionado", text_color="gray")
        self.video_label.grid(row=6, column=1, padx=10, pady=(0,10), sticky="w")
        self.selected_video = None

        ctk.CTkLabel(tab, text="YouTube (Opcional):").grid(row=7, column=0, padx=10, pady=10, sticky="w")
        self.youtube_entry = ctk.CTkEntry(tab, placeholder_text="Enlace de YouTube")
        self.youtube_entry.grid(row=7, column=1, padx=10, pady=10, sticky="ew")

        self.submit_pub_button = ctk.CTkButton(tab, text="Crear Publicación", command=self.create_publication)
        self.submit_pub_button.grid(row=8, column=1, padx=10, pady=20, sticky="e")

    def setup_section_tab(self):
        tab = self.tab_view.tab("Crear Sección")
        tab.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(tab, text="Nombre de la Sección:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.section_name_entry = ctk.CTkEntry(tab, placeholder_text="Ej: Arte 2D")
        self.section_name_entry.grid(row=0, column=1, padx=10, pady=10, sticky="ew")

        self.submit_sec_button = ctk.CTkButton(tab, text="Crear Sección", command=self.create_section)
        self.submit_sec_button.grid(row=1, column=1, padx=10, pady=20, sticky="e")

    def setup_collaborator_tab(self):
        tab = self.tab_view.tab("Añadir Colaborador")
        tab.grid_columnconfigure(1, weight=1)

        # Name
        ctk.CTkLabel(tab, text="Nombre:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.collab_name_entry = ctk.CTkEntry(tab, placeholder_text="Nombre del colaborador")
        self.collab_name_entry.grid(row=0, column=1, padx=10, pady=10, sticky="ew")

        # Description
        ctk.CTkLabel(tab, text="Descripción:").grid(row=1, column=0, padx=10, pady=10, sticky="w")
        self.collab_desc_textbox = ctk.CTkTextbox(tab, height=80)
        self.collab_desc_textbox.grid(row=1, column=1, padx=10, pady=10, sticky="ew")

        # Photo
        ctk.CTkLabel(tab, text="Foto:").grid(row=2, column=0, padx=10, pady=10, sticky="w")
        self.collab_photo_button = ctk.CTkButton(tab, text="Seleccionar Foto", command=self.select_collab_photo)
        self.collab_photo_button.grid(row=2, column=1, padx=10, pady=10, sticky="w")
        self.collab_photo_label = ctk.CTkLabel(tab, text="No hay foto seleccionada", text_color="gray")
        self.collab_photo_label.grid(row=3, column=1, padx=10, pady=(0,10), sticky="w")
        self.selected_collab_photo = None

        # Submit Button
        self.submit_collab_button = ctk.CTkButton(tab, text="Añadir Colaborador", command=self.create_collaborator)
        self.submit_collab_button.grid(row=4, column=1, padx=10, pady=20, sticky="e")

    def refresh_sections(self):
        self.update_status("Cargando secciones...")
        sections = backend.get_sections()
        self.sections_data = {s['name']: s['id'] for s in sections}
        section_names = list(self.sections_data.keys())
        if section_names:
            self.section_menu.configure(values=section_names)
            self.section_menu.set(section_names[0])
        else:
            self.section_menu.configure(values=["No hay secciones"])
            self.section_menu.set("Crea una sección primero")
        self.update_status("Secciones cargadas.", clear_after=3000)

    def select_images(self):
        files = filedialog.askopenfilenames(title="Seleccionar Imágenes")
        if files:
            self.selected_images = list(files)
            self.image_label.configure(text=f"{len(files)} imágenes seleccionadas:\n" + "\n".join(os.path.basename(f) for f in files))
        else:
            self.selected_images = []
            self.image_label.configure(text="No hay imágenes seleccionadas")

    def select_video(self):
        file = filedialog.askopenfilename(title="Seleccionar Video")
        if file:
            self.selected_video = file
            self.video_label.configure(text=f"Video seleccionado: {os.path.basename(file)}")
        else:
            self.selected_video = None
            self.video_label.configure(text="No hay video seleccionado")

    def select_collab_photo(self):
        file = filedialog.askopenfilename(title="Seleccionar Foto del Colaborador")
        if file:
            self.selected_collab_photo = file
            self.collab_photo_label.configure(text=f"Foto seleccionada: {os.path.basename(file)}")
        else:
            self.selected_collab_photo = None
            self.collab_photo_label.configure(text="No hay foto seleccionada")

    def create_publication(self):
        self.update_status("Creando publicación...", clear_after=0)

        section_name = self.section_menu.get()
        section_id = self.sections_data.get(section_name)
        title = self.title_entry.get()
        description = self.description_textbox.get("1.0", "end-1c")
        youtube = self.youtube_entry.get() or None

        if not section_id or not title:
            self.update_status("Error: La sección y el título son obligatorios.", clear_after=5000)
            return

        uploaded_image_names = []
        if self.selected_images:
            for img_path in self.selected_images:
                self.update_status(f"Subiendo {os.path.basename(img_path)}...")
                file_name = backend.upload_file(img_path)
                if file_name:
                    uploaded_image_names.append(file_name)
                else:
                    self.update_status(f"Error al subir {os.path.basename(img_path)}", clear_after=5000)
                    return

        uploaded_video_name = None
        if self.selected_video:
            self.update_status(f"Subiendo {os.path.basename(self.selected_video)}...")
            uploaded_video_name = backend.upload_file(self.selected_video)
            if not uploaded_video_name:
                self.update_status(f"Error al subir el video.", clear_after=5000)
                return

        self.update_status("Creando registro en la base de datos...")
        result = backend.create_publication(
            section_id=section_id,
            title=title,
            description=description,
            images=uploaded_image_names or None,
            video=uploaded_video_name,
            youtube=youtube
        )

        if result:
            self.update_status("¡Publicación creada con éxito!", clear_after=5000)
            self.reset_publication_form()
        else:
            self.update_status("Error al crear la publicación en la base de datos.", clear_after=5000)

    def reset_publication_form(self):
        self.title_entry.delete(0, 'end')
        self.description_textbox.delete("1.0", "end")
        self.youtube_entry.delete(0, 'end')
        self.selected_images = []
        self.image_label.configure(text="No hay imágenes seleccionadas")
        self.selected_video = None
        self.video_label.configure(text="No hay video seleccionado")

    def create_section(self):
        name = self.section_name_entry.get()
        if not name:
            self.update_status("Error: El nombre de la sección no puede estar vacío.", clear_after=5000)
            return

        self.update_status(f"Creando sección '{name}'...")
        result = backend.create_section(name)
        if result:
            self.update_status(f"¡Sección '{name}' creada con éxito!", clear_after=5000)
            self.section_name_entry.delete(0, 'end')
            self.refresh_sections()
        else:
            self.update_status(f"Error al crear la sección.", clear_after=5000)

    def create_collaborator(self):
        name = self.collab_name_entry.get()
        description = self.collab_desc_textbox.get("1.0", "end-1c")
        photo_path = self.selected_collab_photo

        if not name or not description or not photo_path:
            self.update_status("Error: Nombre, descripción y foto son obligatorios.", clear_after=5000)
            return

        self.update_status(f"Añadiendo a {name}...")
        result = backend.create_collaborator(name, description, photo_path)

        if result:
            self.update_status(f"¡Colaborador {name} añadido con éxito!", clear_after=5000)
            self.collab_name_entry.delete(0, 'end')
            self.collab_desc_textbox.delete("1.0", "end")
            self.selected_collab_photo = None
            self.collab_photo_label.configure(text="No hay foto seleccionada")
        else:
            self.update_status(f"Error al añadir al colaborador.", clear_after=5000)

    def update_status(self, message, clear_after=0):
        self.status_label.configure(text=message)
        if clear_after > 0:
            self.after(clear_after, lambda: self.status_label.configure(text=""))


if __name__ == "__main__":
    app = App()
    app.mainloop()