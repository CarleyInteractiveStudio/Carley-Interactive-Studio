# Usa una imagen oficial de Python como imagen base
FROM python:3.9-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /code

# Copia el archivo de dependencias al directorio de trabajo
COPY ./requirements.txt /code/requirements.txt

# Instala las dependencias
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copia el resto del código de la aplicación
COPY ./ /code/

# Expone el puerto en el que se ejecutará la aplicación (el estándar de FastAPI es 8000)
EXPOSE 8000

# Comando para ejecutar la aplicación con Uvicorn
# Se usa 0.0.0.0 para que sea accesible desde fuera del contenedor
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
