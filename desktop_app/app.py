import customtkinter as ctk
from tkinter import messagebox
import requests
import datetime
import webbrowser
import json
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# --- Configuración ---
API_BASE_URL = "https://carley1234-servidor.hf.space"
CONFIG_FILE = "config.json"

# URLs de los logos
APP_LOGOS = {
    "carl_ia": "https://github.com/CarleyInteractiveStudio/Carl-IA/blob/main/Carl%20IA.png?raw=true",
    "creative_engine": "https://github.com/CarleyInteractiveStudio/Creative-Engine-Beta/blob/main/image/Logo%20Creative%20sin%20fondo.png?raw=true",
    "vidspri": "https://carleyinteractivestudio.github.io/VidSpri/VidSpri.png",
    "asset_store": "https://carleyinteractivestudio.github.io/Creative-Engine-Asset-Store/assets/images/logo.png",
    "orion": "https://github.com/CarleyInteractiveStudio/Orion/blob/main/Images/Orion.png?raw=true",
    "chatway": "https://github.com/CarleyInteractiveStudio/ChatWay/blob/main/img/Chatwey.png?raw=true",
    "default": "https://carleyinteractivestudio.github.io/Carley-Interactive-Studio/carley_foto_web/Logo%20C.png"
}
CARLEY_LOGO_URL = "https://carleyinteractivestudio.github.io/Carley-Interactive-Studio/carley_foto_web/Logo%20C.png"


class SupportTicketApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.tickets_data = {}
        self.selected_ticket_id = None
        self.config = self.load_config()
        self.backend_api_key = self.config.get("BACKEND_API_KEY", "")
        self.sendgrid_api_key = self.config.get("SENDGRID_API_KEY", "")

        self.title("Visor de Tickets de Soporte - Carley Interactive")
        self.geometry("1100x700")
        self.minsize(800, 500)
        ctk.set_appearance_mode("Dark")
        ctk.set_default_color_theme("blue")
        self.grid_columnconfigure(1, weight=3)
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.create_widgets()
        self.refresh_tickets()

    def load_config(self):
        try:
            with open(CONFIG_FILE, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"BACKEND_API_KEY": "", "SENDGRID_API_KEY": ""}

    def save_config(self):
        self.config["BACKEND_API_KEY"] = self.backend_api_key
        self.config["SENDGRID_API_KEY"] = self.sendgrid_api_key
        with open(CONFIG_FILE, "w") as f:
            json.dump(self.config, f, indent=4)

    def create_widgets(self):
        self.ticket_list_frame = ctk.CTkFrame(self, corner_radius=10)
        self.ticket_list_frame.grid(row=0, column=0, rowspan=3, padx=10, pady=10, sticky="nsew")
        self.ticket_list_frame.grid_rowconfigure(1, weight=1)
        ctk.CTkLabel(self.ticket_list_frame, text="Solicitudes", font=ctk.CTkFont(size=16, weight="bold")).grid(row=0, column=0, padx=10, pady=10)
        self.ticket_list = ctk.CTkScrollableFrame(self.ticket_list_frame, label_text="")
        self.ticket_list.grid(row=1, column=0, padx=10, pady=10, sticky="nsew")
        ctk.CTkButton(self.ticket_list_frame, text="Refrescar", command=self.refresh_tickets).grid(row=2, column=0, padx=10, pady=10)

        self.ticket_details_frame = ctk.CTkFrame(self, corner_radius=10)
        self.ticket_details_frame.grid(row=0, column=1, padx=10, pady=10, sticky="nsew")
        self.ticket_details_frame.grid_columnconfigure(1, weight=1)

        self.actions_frame = ctk.CTkFrame(self)
        self.actions_frame.grid(row=2, column=1, padx=10, pady=10, sticky="sew")
        self.actions_frame.grid_columnconfigure((0, 1, 2), weight=1)
        self.reply_button = ctk.CTkButton(self.actions_frame, text="Responder", command=self.reply_to_ticket)
        self.reply_button.grid(row=0, column=0, padx=10, pady=10, sticky="ew")
        self.delete_button = ctk.CTkButton(self.actions_frame, text="Cerrar Solicitud", fg_color="#D32F2F", hover_color="#B71C1C", command=self.delete_ticket)
        self.delete_button.grid(row=0, column=1, padx=10, pady=10, sticky="ew")
        self.config_button = ctk.CTkButton(self.actions_frame, text="Configuración", command=self.open_settings)
        self.config_button.grid(row=0, column=2, padx=10, pady=10, sticky="ew")
        self.show_initial_details_message()

    def show_initial_details_message(self):
        for widget in self.ticket_details_frame.winfo_children(): widget.destroy()
        ctk.CTkLabel(self.ticket_details_frame, text="Selecciona un ticket para ver sus detalles", font=ctk.CTkFont(size=16)).pack(expand=True)

    def refresh_tickets(self):
        self.show_initial_details_message()
        self.selected_ticket_id = None
        if not self.backend_api_key:
            messagebox.showerror("Configuración Requerida", "La clave de API del Backend no está configurada.")
            return
        try:
            headers = {"X-API-Key": self.backend_api_key}
            response_list = requests.get(f"{API_BASE_URL}/tickets", headers=headers)
            response_list.raise_for_status()
            ticket_ids = response_list.json().get("tickets", [])
            for widget in self.ticket_list.winfo_children(): widget.destroy()
            if not ticket_ids:
                ctk.CTkLabel(self.ticket_list, text="No hay tickets.").pack()
                return
            self.tickets_data.clear()
            all_tickets = [requests.get(f"{API_BASE_URL}/tickets/{tid}", headers=headers).json() for tid in ticket_ids]
            all_tickets.sort(key=lambda t: t.get('timestamp', ''), reverse=True)
            for ticket in all_tickets:
                self.tickets_data[ticket['id']] = ticket
                display_time = datetime.datetime.fromisoformat(ticket['timestamp']).strftime("%d %b %Y, %H:%M") if 'timestamp' in ticket else "Fecha desconocida"
                ctk.CTkButton(self.ticket_list, text=f"{display_time}\n{ticket.get('app', 'N/A')}", anchor="w", command=lambda t_id=ticket['id']: self.show_ticket_details(t_id)).pack(fill="x", padx=5, pady=5)
        except requests.RequestException as e:
            messagebox.showerror("Error de Red", f"No se pudo conectar al servidor: {e}")

    def show_ticket_details(self, ticket_id):
        self.selected_ticket_id = ticket_id
        ticket = self.tickets_data.get(ticket_id)
        if not ticket: return
        for widget in self.ticket_details_frame.winfo_children(): widget.destroy()
        details_content_frame = ctk.CTkFrame(self.ticket_details_frame, fg_color="transparent")
        details_content_frame.pack(fill="both", expand=True, padx=15, pady=10)
        details_content_frame.grid_columnconfigure(1, weight=1)

        info = {"De:": "email", "App:": "app", "Razón:": "reason"}
        for i, (label, key) in enumerate(info.items()):
            ctk.CTkLabel(details_content_frame, text=label, font=ctk.CTkFont(weight="bold")).grid(row=i, column=0, sticky="w", pady=2)
            ctk.CTkLabel(details_content_frame, text=ticket.get(key, "N/A")).grid(row=i, column=1, sticky="w", pady=2)

        ctk.CTkLabel(details_content_frame, text="Descripción:", font=ctk.CTkFont(weight="bold")).grid(row=3, column=0, columnspan=2, sticky="w", pady=(10, 2))
        desc_box = ctk.CTkTextbox(details_content_frame, height=200)
        desc_box.grid(row=4, column=0, columnspan=2, sticky="nsew", pady=5)
        desc_box.insert("1.0", ticket.get("description", "No hay descripción."))
        desc_box.configure(state="disabled")

        attachments = ticket.get("attachments", [])
        if attachments:
            ctk.CTkLabel(details_content_frame, text="Archivos Adjuntos:", font=ctk.CTkFont(weight="bold")).grid(row=5, column=0, columnspan=2, sticky="w", pady=(10, 5))
            attachments_frame = ctk.CTkFrame(details_content_frame, fg_color="transparent")
            attachments_frame.grid(row=6, column=0, columnspan=2, sticky="w")
            for i, attachment in enumerate(attachments):
                btn = ctk.CTkButton(attachments_frame, text=attachment.get("original_filename", "Adjunto"), command=lambda url=f"{API_BASE_URL}{attachment.get('url')}": webbrowser.open(url))
                btn.grid(row=i, column=0, sticky="w", pady=3)
        details_content_frame.grid_rowconfigure(4, weight=1)

    def reply_to_ticket(self):
        if not self.selected_ticket_id:
            return messagebox.showwarning("Sin Selección", "Por favor, selecciona un ticket para responder.")
        if not self.sendgrid_api_key or "TU_CLAVE" in self.sendgrid_api_key:
            return messagebox.showerror("Configuración Requerida", "Por favor, introduce tu clave de API de SendGrid en la Configuración.")
        ReplyWindow(self, self.tickets_data[self.selected_ticket_id], self.send_email)

    def send_email(self, to_email, subject, body, app_name):
        app_logo_url = APP_LOGOS.get(app_name, APP_LOGOS["default"])

        # Reemplazar saltos de línea por <br> para el HTML
        body_html = body.replace('\n', '<br>')

        html_content = f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#1a1a1a">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #2a2a2a; border-radius: 10px; overflow: hidden;">
                            <!-- Encabezado con Logos -->
                            <tr>
                                <td align="center" style="padding: 20px; border-bottom: 1px solid #444;">
                                    <img src="{CARLEY_LOGO_URL}" alt="Carley Interactive Studio Logo" width="60" style="display: inline-block; vertical-align: middle; margin-right: 20px;">
                                    <img src="{app_logo_url}" alt="App Logo" width="60" style="display: inline-block; vertical-align: middle;">
                                </td>
                            </tr>
                            <!-- Cuerpo del Mensaje -->
                            <tr>
                                <td style="padding: 30px 25px; font-size: 16px; line-height: 1.6;">
                                    {body_html}
                                </td>
                            </tr>
                            <!-- Pie de Página -->
                            <tr>
                                <td align="center" style="padding: 20px; font-size: 12px; color: #888; border-top: 1px solid #444;">
                                    <p style="margin: 0;">&copy; 2025 Carley Interactive Studio. Todos los derechos reservados.</p>
                                    <p style="margin: 10px 0 0;">Si no esperabas este correo, por favor, ignóralo.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        message = Mail(
            from_email=('soporte@carley.studio', 'Soporte - Carley Interactive'),
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        try:
            sg = SendGridAPIClient(self.sendgrid_api_key)
            response = sg.send(message)
            if response.status_code in [200, 202]:
                messagebox.showinfo("Éxito", f"Correo enviado a {to_email}")
            else:
                messagebox.showerror("Error de Envío", f"No se pudo enviar el correo: Código {response.status_code} - {response.body}")
        except Exception as e:
            messagebox.showerror("Error de SendGrid", f"Ocurrió un error: {e}")

    def delete_ticket(self):
        if not self.selected_ticket_id:
            return messagebox.showwarning("Sin Selección", "Por favor, selecciona un ticket para eliminar.")
        ticket_app = self.tickets_data[self.selected_ticket_id].get('app', 'N/A')
        if messagebox.askyesno("Confirmar", f"¿Eliminar permanentemente el ticket para '{ticket_app}'?"):
            try:
                requests.delete(f"{API_BASE_URL}/tickets/{self.selected_ticket_id}", headers={"X-API-Key": self.backend_api_key}).raise_for_status()
                messagebox.showinfo("Éxito", "El ticket ha sido eliminado.")
                self.refresh_tickets()
            except requests.RequestException as e:
                messagebox.showerror("Error de Red", f"No se pudo eliminar: {e}")

    def open_settings(self):
        SettingsWindow(self)

class SettingsWindow(ctk.CTkToplevel):
    def __init__(self, master):
        super().__init__(master)
        self.transient(master)
        self.title("Configuración")
        self.geometry("500x250")

        ctk.CTkLabel(self, text="Clave de API del Backend:").pack(padx=20, pady=(20, 5))
        self.backend_key_entry = ctk.CTkEntry(self, width=400, show="*")
        self.backend_key_entry.pack(padx=20, pady=5)
        self.backend_key_entry.insert(0, master.backend_api_key)

        ctk.CTkLabel(self, text="Clave de API de SendGrid:").pack(padx=20, pady=(10, 5))
        self.sendgrid_key_entry = ctk.CTkEntry(self, width=400, show="*")
        self.sendgrid_key_entry.pack(padx=20, pady=5)
        self.sendgrid_key_entry.insert(0, master.sendgrid_api_key)

        ctk.CTkButton(self, text="Guardar", command=self.save_and_close).pack(pady=20)

    def save_and_close(self):
        self.master.backend_api_key = self.backend_key_entry.get()
        self.master.sendgrid_api_key = self.sendgrid_key_entry.get()
        self.master.save_config()
        messagebox.showinfo("Guardado", "La configuración ha sido guardada.", parent=self)
        self.destroy()
        self.master.refresh_tickets()


class ReplyWindow(ctk.CTkToplevel):
    def __init__(self, master, ticket, send_callback):
        super().__init__(master)
        self.transient(master)
        self.title(f"Responder a: {ticket.get('email')}")
        self.geometry("600x500")
        self.ticket = ticket
        self.send_callback = send_callback

        ctk.CTkLabel(self, text="Asunto:").pack(padx=20, pady=(10, 0), anchor="w")
        self.subject_entry = ctk.CTkEntry(self, width=560)
        self.subject_entry.pack(padx=20, pady=5, fill="x")
        self.subject_entry.insert(0, f"Re: Soporte para {ticket.get('app', 'tu consulta')}")

        ctk.CTkLabel(self, text="Mensaje:").pack(padx=20, pady=(10, 0), anchor="w")
        self.body_textbox = ctk.CTkTextbox(self, height=300)
        self.body_textbox.pack(padx=20, pady=5, fill="both", expand=True)

        ctk.CTkButton(self, text="Enviar Correo", command=self.send).pack(pady=20)

    def send(self):
        subject = self.subject_entry.get()
        body = self.body_textbox.get("1.0", "end-1c")
        if not subject or not body:
            return messagebox.showwarning("Campos Vacíos", "El asunto y el mensaje no pueden estar vacíos.", parent=self)
        self.send_callback(self.ticket['email'], subject, body, self.ticket['app'])
        self.destroy()

if __name__ == "__main__":
    app = SupportTicketApp()
    app.mainloop()
