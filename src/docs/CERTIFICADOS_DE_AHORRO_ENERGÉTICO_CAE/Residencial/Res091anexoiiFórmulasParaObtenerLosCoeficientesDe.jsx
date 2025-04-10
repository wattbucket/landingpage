
import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../components/firebase/firebaseConfig";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";
import AppBarComponent from "../../../components/NavigationBarDocumento";
import XLSXUploaderStoragePrecargaxDefectoHojaModal from "../../../components/XLSXUploaderStoragePrecargaxDefectoHojaModal";
import MapaModal from "../../../components/MapaModal";
import { Box, Backdrop, CircularProgress, Typography } from "@mui/material";
import config from "../../../components/configURL";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/workers/3.11.174/pdf.worker.min.js`;


const ENDPOINT = "CERTIFICADOS_DE_AHORRO_ENERGÉTICO_CAE/Residencial/Res091anexoiiFórmulasParaObtenerLosCoeficientesDe/Res091anexoii"
const HOJAEXCEL = "excel/CERTIFICADOS_DE_AHORRO_ENERGÉTICO_CAE/Residencial/Res091anexoii.xlsx"

const PDF_API_URL = `${config.API_URL}/${ENDPOINT}?timestamp=${new Date().getTime()}`;

const PDFRenderer = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [tempSheets, setTempSheets] = useState(null);
    const [open, setOpen] = useState(false);
    const [openx, setOpenx] = useState(false);

    const abrirModal = useCallback(() => setOpen(true), []);
    const cerrarModal = useCallback(() => setOpen(false), []);
    const abrirModalx = useCallback(() => setOpenx(true), []);
    const cerrarModalx = useCallback(() => setOpenx(false), []);

    const renderPdfFromUrl = useCallback(async () => {
        if (!tempSheets) return;
        setLoading(true);
        try {
            const response = await axios.post(PDF_API_URL, tempSheets, { responseType: "arraybuffer" });
            if (response.status !== 200) throw new Error("Error al obtener el PDF");

            const pdf = await pdfjsLib.getDocument({ data: response.data }).promise;
            if (pdf.numPages === 0) throw new Error("No se pudo cargar el PDF o no tiene páginas");

            const pages = await Promise.all(
                Array.from({ length: pdf.numPages }, async (_, i) => {
                    const page = await pdf.getPage(i + 1);
                    const viewport = page.getViewport({ scale: 2.5 });
                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
                    return canvas.toDataURL("image/png");
                })
            );

            setImages(pages);
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [tempSheets]);

    useEffect(() => {
        const loadDataFromSessionStorage = async () => {
            const storedData = sessionStorage.getItem("excelData");
            if (storedData) {
                const excelData = JSON.parse(storedData);

                console.log('no recarga el excel si hay una hoja con el nombre')
                console.log(`Res091anexoii`)
                console.log(excelData)
                console.log('+++++==========================================================')
                if (excelData.Res091anexoii)

                {                    setTempSheets(excelData);
                    return;
                }
            }

            try {
                const response = await fetch(`/${HOJAEXCEL}`);
                const data = await response.arrayBuffer();
                const workbook = XLSX.read(data, { type: "array" });
                const sheetsData = workbook.SheetNames.reduce((acc, sheetName) => {
                    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                    acc[sheetName] = sheet.filter(row => row.some(cell => cell != null && cell !== ""));
                    return acc;
                }, {});

                sessionStorage.setItem("excelData", JSON.stringify(sheetsData));
                setTempSheets(sheetsData);
            } catch (err) {
                console.error("Error al cargar el archivo de la carpeta public", err);
            }
        };

        loadDataFromSessionStorage();
    }, []);

    useEffect(() => {
        if (tempSheets) renderPdfFromUrl();
    }, [tempSheets, renderPdfFromUrl]);

    const handleDownloadPdf = useCallback(async () => {
        setLoading(true);
        try {
            if (!tempSheets) throw new Error("No hay datos para descargar.");
            const response = await axios.post(PDF_API_URL, tempSheets, { responseType: "arraybuffer" });
            if (response.status !== 200) throw new Error("Error al obtener el PDF.");

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${ENDPOINT}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(`Error al descargar el PDF: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [tempSheets]);

    const handleRecalculate = () => {
        sessionStorage.setItem("modalOpen", "true");
        window.location.reload();
    };

    return (
        <div>
            <AppBarComponent
                filePath={HOJAEXCEL}
                abrirModal={abrirModal}
                abrirModalx={abrirModalx}
                handleRecalculate={handleRecalculate}
                handleDownloadPdf={handleDownloadPdf}
            />

            <Backdrop open={loading} style={{ zIndex: 1201, color: "#000" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CircularProgress color="inherit" sx={{ color: 'white' }} />
                    <Typography variant="h4" sx={{ color: 'white', marginTop: 2 }}>
                        Cargando...
                    </Typography>
                </div>
            </Backdrop>
            
            {error && <Typography align="center" color="error">{error}</Typography>}

            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`PDF Page ${index + 1}`} style={{ width: "100%", borderRadius: "8px" }} />
                ))}
            </Box>

            <XLSXUploaderStoragePrecargaxDefectoHojaModal openx={openx} cerrarModalx={cerrarModalx} filePath={HOJAEXCEL}  handleRecalculate={handleRecalculate}/>

            <MapaModal open={open} cerrarModal={cerrarModal} />
        </div>
    );
};

export default PDFRenderer;


