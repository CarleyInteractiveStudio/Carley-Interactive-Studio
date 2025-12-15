---
title: Servidor de Soporte - Carley Interactive
emoji:  FastAPI
colorFrom: blue
colorTo: green
sdk: docker
app_port: 8000
---

# Servidor de Soporte - Carley Interactive Studio

Este es el backend para el sistema de tickets de soporte.

## 🚀 Despliegue en Hugging Face Spaces

Este repositorio está configurado para ser desplegado como un "Space" en Hugging Face usando Docker.

### **⚠️ Configuración Requerida**

Para que el servidor funcione correctamente, es **esencial** que configures una "Secret" en la configuración de tu Space:

1.  **Nombre de la Secret:** `API_KEY`
2.  **Valor de la Secret:** `c4r13y-5up3r-53cr3t-4p1-k3y-f0r-d35kt0p-4pp` (o la clave que prefieras)

Esta clave es necesaria para proteger los endpoints que listan y obtienen los detalles de los tickets.
