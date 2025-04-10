import React, { useMemo, useState, useEffect } from 'react';
import { TextField, AppBar, Box, Toolbar, List, ListItem, ListItemText, Typography, Divider, InputAdornment, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import Catalogo from './Catalogo.json'; // Importar catálogo
import ScrollToTop from './ScrollToTop';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'; // Importar el icono de la lupa
import { auth } from './firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { alpha, useTheme } from '@mui/material/styles';

const Fichas = () => {
    const theme = useTheme();

    // import { auth } from './firebase/firebaseConfig';
    // import { useAuthState } from 'react-firebase-hooks/auth';
    const [user] = useAuthState(auth);

    const navigate = useNavigate();

    const DynamicFichaComponent = ({ selectedGroup, selectedSector, selectedCode }) => {
        if (selectedGroup && selectedSector && selectedCode) {
            navigate(`../docs/${selectedGroup.toLowerCase()}/${selectedSector.toLowerCase()}/${selectedCode.toLowerCase()}`);
        }
    };

    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState(sessionStorage.getItem('searchText') || '');
    const [selectedFicha, setSelectedFicha] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(sessionStorage.getItem('selectedGroup') || '');
    const [selectedSector, setSelectedSector] = useState(sessionStorage.getItem('selectedSector') || '');

    const availableGroups = useMemo(() => {
        const groups = [...new Set(Catalogo.map(item => item.grupo))];
        return [''].concat(groups);
    }, []);

    useEffect(() => {
        setData(Catalogo);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('selectedGroup', selectedGroup);
    }, [selectedGroup]);

    useEffect(() => {
        sessionStorage.setItem('selectedSector', selectedSector);
    }, [selectedSector]);

    useEffect(() => {
        sessionStorage.setItem('searchText', searchText);
    }, [searchText]);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value);
        setSelectedSector(''); // Limpiar sector al cambiar grupo
    };

    const handleSectorChange = (event) => {
        setSelectedSector(event.target.value);
    };

    const availableSectors = useMemo(() => {
        return selectedGroup ? ['', ...new Set(Catalogo.filter(item => item.grupo === selectedGroup).map(item => item.sector))] : [];
    }, [selectedGroup]);

    const filteredData = useMemo(() => {
        return Catalogo.filter(item =>
            // Excluir los que contengan 'ANEXO' en el campo código
            // !item.codigo.includes('ANEXO')
            !item.codigo.includes('jlkjldsakjflkjlkjlkjlkj987978')
        ).filter(item =>
            // Aplicar filtros adicionales si existen
            (!selectedGroup || item.grupo === selectedGroup) &&
            (!selectedSector || item.sector === selectedSector) &&
            (!searchText ||
                item.codigo.toLowerCase().includes(searchText) ||
                item.sector.toLowerCase().includes(searchText) ||
                item.grupo.toLowerCase().includes(searchText)
            )
        );
    }, [Catalogo, searchText, selectedGroup, selectedSector]);

    // const handleFichaClick = (ficha) => {
    //     setSelectedFicha(ficha);
    // };

    const handleFichaClick = (ficha) => {
        if (!user && ficha.categoria != "libre") {
            toast.warning("Debes iniciar sesión para acceder a documentos premium.");
            return;
        }

        if (user && ficha.categoria == "extra") {
            toast.error("Documento no disponible para su usuario.");
            return;
        }


        setSelectedFicha(ficha);
        sessionStorage.setItem('selectedFicha', JSON.stringify(ficha)); // Guardar en sessionStorage
    };

    const categoriaColores = {
        libre: alpha(theme.palette.primary.main, 0.2),  // Color primary con 20% de opacidad
        premium: "rgba(255, 215, 0, 0.2)",  // Dorado con 20% de opacidad
        extra: "rgba(255, 99, 71, 0.2)"     // Rojo tomate con 20% de opacidad
    };

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: "transparent", color: "black", width: "100%", mt: "55px" }}>
                <Toolbar >
                    <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        {/* Selector de grupo */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth variant="outlined" >
                                <InputLabel shrink={!!selectedGroup}>Grupo</InputLabel>
                                <Select
                                    value={selectedGroup}
                                    onChange={handleGroupChange}
                                    // displayEmpty
                                    label="Grupo"
                                >
                                    <MenuItem value="">*</MenuItem>
                                    {availableGroups.slice(1).map(group => (
                                        <MenuItem key={group} value={group}>{group.replaceAll('_', ' ')}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Selector de sector */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth disabled={!selectedGroup}>
                                <InputLabel>Subgrupo</InputLabel>
                                <Select
                                    value={selectedSector}
                                    onChange={handleSectorChange}
                                    label="Subgrupo"
                                >
                                    <MenuItem value="">*</MenuItem>
                                    {availableSectors.slice(1).map(sector => (
                                        <MenuItem key={sector} value={sector}>{sector.replaceAll('_', ' ')}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Campo de búsqueda con icono de lupa */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={searchText}
                                onChange={handleSearchChange}
                                placeholder="Buscar"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {/* Listado de fichas */}
            <Box sx={{ padding: 2 }}>
                <List>
                    {filteredData.map((item) => (
                        <React.Fragment key={item.codigo}>
                            <ListItem
                                button
                                onClick={() => handleFichaClick(item)}
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: categoriaColores[item.categoria] || "white", // Color según categoría
                                    "&:hover": { bgcolor: categoriaColores[item.categoria] ? `${categoriaColores[item.categoria]}AA` : "#f0f0f0" } // Versión más clara al pasar el mouse
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <>

                                            <Typography variant="body1" component="span">
                                                {item.codigo.split(" ").slice(1).join(" ")}
                                            </Typography>
                                        </>
                                    }
                                    secondary={`${item.codigo.split(" ")[0]} / ${item.grupo.replaceAll('_', ' ')} / ${item.sector.replaceAll('_', ' ')}`}

                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* Componente dinámico */}
            {selectedFicha && (
                <Box>
                    <DynamicFichaComponent
                        selectedGroup={selectedFicha.grupo}
                        selectedSector={selectedFicha.sector}
                        selectedCode={selectedFicha.cod}
                    />
                </Box>
            )}

            <ScrollToTop />
            <ToastContainer />

        </>
    );
};

export default Fichas;
