import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
// Ruta al archivo Excel en la carpeta public
const HOJAEXCEL = 'excel/caes/agrario/agr010.xlsx'; // Ruta relativa desde la carpeta public
const doc = HOJAEXCEL.split('/').pop().split('.').shift();

const PepitoComponent = () => {

    useEffect(() => {
        const loadDataFromExcel = async () => {
            try {

                // Obtener el archivo Excel
                const response = await fetch(`/${HOJAEXCEL}`);
                const arrayBuffer = await response.arrayBuffer();

                // Leer el archivo Excel
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
                const worksheet = workbook.Sheets[sheetName];

                // Convertir la hoja de Excel a JSON
                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Guardar los datos en sessionStorage
                sessionStorage.setItem(doc, JSON.stringify(data));
                setPepitoList(data);
            } catch (error) {
                console.error('Error al leer el archivo Excel:', error);
            }
        };

        // Verificar si la variable doc existe en sessionStorage

        if (!sessionStorage.getItem(doc)) {
            // Si no existe, cargar los datos desde el archivo Excel

            loadDataFromExcel();
        } 
    }, []);

    return (
        <div>
            <h1>Lista de Pepito</h1>
            <ul>

            </ul>
        </div>
    );
};

export default PepitoComponent;