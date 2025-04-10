#!/usr/bin/env python3

import os
import json
import re

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Ruta del directorio base donde buscar los archivos JSX
base_dir = "../src/docs"
# Ruta del archivo de salida
output_file = "../src/components/Catalogo.json"

def separar_y_mayusculizar(texto):
    # Usamos una expresión regular para separar las mayúsculas
    partes = re.findall(r'[A-Z][^A-Z]*', texto)
    # Separar la primera parte (mantenerla como está)
    primera_parte = partes[0].upper()
    # El resto de las partes lo convertimos a mayúsculas y las unimos con espacios
    resto = ' '.join([parte.upper() for parte in partes[1:]])
    return primera_parte, resto

# Lista para almacenar la estructura
catalogo = []

# Recorrer los directorios
for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".jsx") and "Anexo" not in file:  # Filtrar solo archivos JSX que contengan 'Anexo'
            # Obtener rutas relativas al directorio base
            rel_path = os.path.relpath(root, base_dir)
            partes = rel_path.split(os.sep)
            
            if len(partes) >= 2:
                directorio = partes[0]
                subdirectorio = partes[1]
                nombre = os.path.splitext(file)[0]  # Nombre sin extensión
                cod, codigo = separar_y_mayusculizar(nombre)
                
                catalogo.append({
                    "categoria": "libre",
                    "codigo": f"{cod} {codigo}",
                    "sector": subdirectorio,
                    "grupo": directorio,
                    "cod": nombre,
                    "co": cod
                })

# Ordenar la lista por grupo, luego por sector y finalmente por cod
catalogo.sort(key=lambda x: (x["grupo"], x["sector"], x["cod"]))
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ojo a los filtros
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ojo a los filtros
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ojo a los filtros
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ojo a los filtros
# Eliminar entradas cuyo sector contenga 'AAA' o 'EFICIENCIA' (sin distinguir mayúsculas)
# Eliminar entradas cuyo sector contenga 'AAA' (sin distinguir mayúsculas)
catalogo = [
    item for item in catalogo
    if "AAA" not in item["grupo"].upper()
]

# Eliminar entradas cuyo sector contenga 'EFICIENCIA' (sin distinguir mayúsculas)
catalogo = [
    item for item in catalogo
    if "EFICIENCIA" not in item["grupo"].upper()
]

# Guardar la información en un archivo JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(catalogo, f, indent=4, ensure_ascii=False)

print(f"Archivo guardado en {output_file}")
