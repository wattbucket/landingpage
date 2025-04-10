import React, { useState, useEffect } from "react";
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    IconButton,
    Tooltip,
    Tabs,
    Tab,
    Backdrop,
    Select,
    AppBar,
    Toolbar,
    Container,
    Menu,
    MenuItem,
    useMediaQuery,

} from "@mui/material";

import * as XLSX from "xlsx";
import { Calculate as CalculateIcon, Menu as MenuIcon, Close as CloseIcon, CloudDownload as CloudDownloadIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import MapaModal from "./MapaModal";
import MapIcon from '@mui/icons-material/Map';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentIcon from '@mui/icons-material/Description';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReplyIcon from '@mui/icons-material/Reply';

const ExcelUploaderStorage = ({ openx, cerrarModalx, filePath, handleRecalculate, handleDownloadPdf }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery("(max-width: 600px)");

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };





    const fuchsiaColor = '#FF00FF'; // Color fucsia
    const primaryColor = '#000000'; // Color primario (negro)

    const sheetName = filePath.split('/').pop().split('.').shift();

    const [sheets, setSheets] = useState(null);
    const [tempSheets, setTempSheets] = useState(null);
    const [openMapaModal, setOpenMapaModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[-T:]/g, ""); // Formato: YYYYMMDDHHMMSS

    const handleOpenMapaModal = () => setOpenMapaModal(true);
    const handleCloseMapaModal = () => {
        setOpenMapaModal(false);
        updateDataFromSessionStorage();
    };

    const updateDataFromSessionStorage = () => {
        const storedData = sessionStorage.getItem("excelData");
        if (storedData) {
            const excelData = JSON.parse(storedData);
            setTempSheets(excelData);
        }
    };

    const handleTabChange = (event, newValue) => setActiveTab(newValue);

    const loadDataFromSessionStorage = async () => {
        const storedData = sessionStorage.getItem("excelData");
        const originalData = localStorage.getItem("originalExcelData");

        if (storedData && originalData) {
            const excelData = JSON.parse(storedData);
            const originalExcelData = JSON.parse(originalData);

            if (excelData && excelData.hasOwnProperty(sheetName)) {
                setTempSheets(excelData);
                return;
            }
        }

        try {
            const response = await fetch(`/${filePath}`);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetsData = {};

            workbook.SheetNames.forEach((sheetName) => {
                const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                const filteredSheet = sheet.filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
                sheetsData[sheetName] = filteredSheet;
            });

            localStorage.setItem("originalExcelData", JSON.stringify(sheetsData));
            const selectedValues = JSON.parse(JSON.stringify(sheetsData));
            Object.keys(selectedValues).forEach((sheetName) => {
                selectedValues[sheetName].forEach((row, rowIndex) => {
                    row.forEach((cell, cellIndex) => {
                        if (typeof cell === 'string' && cell.includes(';')) {
                            const firstValue = cell.split(';')[0].trim();
                            selectedValues[sheetName][rowIndex][cellIndex] = firstValue;
                        }
                    });
                });
            });

            sessionStorage.setItem("excelData", JSON.stringify(selectedValues));
            setTempSheets(selectedValues);
        } catch (err) {
            console.error("Error al cargar el archivo de la carpeta public", err);
        }
    };

    useEffect(() => {
        loadDataFromSessionStorage();
    }, []);

    const handleFileUpload = (file) => {
        if (!file) return;

        const fileName = file.name.toLowerCase();
        if (!fileName.includes(sheetName.toLowerCase())) {
            toast.error("Seleccione la plantilla adecuada, puede descargarla y modificarla en su ordenador");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetsData = {};

            workbook.SheetNames.forEach((sheetName) => {
                const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                const filledSheet = sheet.map((row) => row.map((cell) => (cell === null || cell === undefined ? " " : cell)));
                const filteredSheet = filledSheet.filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
                sheetsData[sheetName] = filteredSheet;
            });

            localStorage.setItem("originalExcelData", JSON.stringify(sheetsData));
            const selectedValues = JSON.parse(JSON.stringify(sheetsData));
            Object.keys(selectedValues).forEach((sheetName) => {
                selectedValues[sheetName].forEach((row, rowIndex) => {
                    row.forEach((cell, cellIndex) => {
                        if (typeof cell === 'string' && cell.includes(';')) {
                            const firstValue = cell.split(';')[0].trim();
                            selectedValues[sheetName][rowIndex][cellIndex] = firstValue;
                        }
                    });
                });
            });

            sessionStorage.setItem("excelData", JSON.stringify(selectedValues));
            setTempSheets(selectedValues);
            toast.success("¡Archivo cargado correctamente!");
        };

        reader.readAsArrayBuffer(file);
    };

    const handleInputChange = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    };

    const handleCellEdit = (rowIndex, columnIndex, value, activeSheet) => {
        if (value.trim() === "") {
            // toast.error("No se puede ingresar una celda vacía.");
            return;
        }

        const updatedData = [...(tempSheets || sheets)[activeSheet]];
        updatedData[rowIndex + 1][columnIndex] = value;

        const updatedSheets = { ...(tempSheets || sheets), [activeSheet]: updatedData };
        setTempSheets(updatedSheets);
        sessionStorage.setItem("excelData", JSON.stringify(updatedSheets));
    };

    const activeSheet = (tempSheets || sheets) ? Object.keys(tempSheets || sheets)[activeTab] : null;

    const columns = React.useMemo(() => {
        const data = tempSheets || sheets;
        if (data && activeSheet && data[activeSheet]?.length > 0) {
            return data[activeSheet][0].map((_, index) => ({
                Header: data[activeSheet][0][index],
                accessor: index.toString(),
            }));
        }
        return [];
    }, [activeSheet, tempSheets, sheets]);

    const data = React.useMemo(() => {
        const data = tempSheets || sheets;
        if (data && activeSheet) {
            return data[activeSheet]?.slice(1) || [];
        }
        return [];
    }, [activeSheet, tempSheets, sheets]);

    const handleExport = () => {
        const storedData = JSON.parse(sessionStorage.getItem("excelData"));
        const wb = XLSX.utils.book_new();

        Object.keys(storedData).forEach((sheetName) => {
            const sheetData = storedData[sheetName];
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });
        const fileName = `DocTec_${sheetName}_${formattedDate}.xlsx`;

        XLSX.writeFile(wb, fileName);
    };
    const handleImportar = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".xlsx, .xls";
        fileInput.style.display = "none"; // Ocultarlo visualmente
        fileInput.addEventListener("change", handleInputChange);

        document.body.appendChild(fileInput);
        fileInput.click();

        // Eliminar el input después de seleccionar el archivo
        fileInput.addEventListener("change", () => {
            document.body.removeChild(fileInput);
        });
    };
    if (!data.length || !columns) return null;

    const menuOptions = [
        { label: "Cancelar", icon: <CloseIcon />, onClick: cerrarModalx, isButton: true },
        { label: "Calcular", icon: <CalculateIcon />, onClick: handleRecalculate },
        { label: "Importar", icon: <CloudUploadIcon />, onClick: handleImportar },
        { label: "Exportar", icon: <CloudDownloadIcon />, onClick: handleExport },
        { label: "Ubicación", icon: <MapIcon />, onClick: handleOpenMapaModal },
    ];


    return (
        <>
            <Modal
                open={openx}
                onClose={cerrarModalx}
                BackdropComponent={Backdrop}
                BackdropProps={{ onClick: cerrarModalx }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        flexDirection: "column",
                        gap: 2,
                        overflowY: "auto",
                    }}
                >
                    <AppBar position="static" sx={{ mb: 2, bgcolor: "white", borderBottom: "1px solid #e0e0e0" }}>
                        <Container maxWidth="xl">
                            <Toolbar disableGutters>
                                {isMobile ? (
                                    <>
                                        <IconButton edge="start" color="black" onClick={handleMenuOpen}>
                                            <MenuIcon />
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                            {menuOptions.map((option, index) => (
                                                <MenuItem key={index} onClick={option.onClick}>
                                                    {option.icon}
                                                    <span style={{ marginLeft: "8px" }}>{option.label}</span>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                ) : (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {menuOptions.map((option, index) => (
                                            <Button key={index} onClick={option.onClick} sx={{ color: "black", display: "flex", alignItems: "center" }}>
                                                {option.icon}
                                                <span style={{ marginLeft: "8px" }}>{option.label}</span>
                                            </Button>
                                        ))}
                                    </Box>
                                )}
                                <Box sx={{ flexGrow: 1 }} />
                                {/* <Tooltip title="Cerrar">
                                    <IconButton aria-label="close" onClick={cerrarModalx} sx={{ color: "black" }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip> */}
                            </Toolbar>
                        </Container>
                    </AppBar>

                    {(tempSheets || sheets) && (
                        <>
                            <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
                                    {Object.keys(tempSheets || sheets).map((sheet, index) => (
                                        <Tab key={index} label={sheet} />
                                    ))}
                                </Tabs>
                            </Box>

                            <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column, index) => (
                                                <TableCell
                                                    key={column.accessor}
                                                    sx={{
                                                        backgroundColor: "grey.200",
                                                        fontWeight: "bold",
                                                        width: `${100 / columns.length}%`,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {column.Header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((cell, cellIndex) => {
                                                    const originalData = JSON.parse(localStorage.getItem("originalExcelData"));
                                                    const originalCell = originalData[activeSheet][rowIndex + 1][cellIndex];
                                                    const isCommaSeparated = typeof originalCell === 'string' && originalCell.includes(';');
                                                    const options = isCommaSeparated ? originalCell.split(';') : [];

                                                    return (
                                                        <TableCell
                                                            key={cellIndex}
                                                            sx={{
                                                                width: cellIndex === 0
                                                                    ? `${(2 / (columns.length + 1)) * 100}%`
                                                                    : `${(1 / (columns.length + 1)) * 100}%`,
                                                                textAlign: "left",
                                                                ...(cellIndex === 0
                                                                    ? {
                                                                        backgroundColor: "grey.100",
                                                                        fontWeight: "bold",
                                                                    }
                                                                    : {
                                                                        border: '1px solid rgba(0, 0, 0, 0.23)',
                                                                        '&:hover': {
                                                                            border: '1px solid rgba(0, 0, 0, 0.5)',
                                                                        },
                                                                    }),
                                                            }}
                                                        >
                                                            {isCommaSeparated ? (
                                                                <Select
                                                                    value={cell}
                                                                    onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value, activeSheet)}
                                                                    size="small"
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '30px',
                                                                        fontSize: '0.875rem',
                                                                        padding: '4px 8px',
                                                                    }}
                                                                >
                                                                    {options.map((option, index) => (
                                                                        <MenuItem key={index} value={option.trim()}>
                                                                            {option.trim()}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            ) : (
                                                                <div
                                                                    contentEditable={cellIndex !== 0}
                                                                    suppressContentEditableWarning
                                                                    onBlur={(e) => {
                                                                        if (cellIndex !== 0) {
                                                                            const value = e.target.innerText;
                                                                            handleCellEdit(rowIndex, cellIndex, value, activeSheet);
                                                                        }
                                                                    }}
                                                                >
                                                                    {cell}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
            </Modal>

            <MapaModal open={openMapaModal} cerrarModal={handleCloseMapaModal} />
            <ToastContainer />
        </>
    );
};

export default ExcelUploaderStorage;