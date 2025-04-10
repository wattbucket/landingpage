import React, { Suspense } from 'react';
// por el direccinamiento que hacer github pages tengo qeu cambiaarlo
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// 

import { Box } from '@mui/material';
import CookieConsent from './components/footer/CookieConsent';
import Home from './components/Home';
import Contact from './components/Contact';
import Ayuda from './components/Ayuda';
// import XLSXUploaderStoragePrecargaxDefecto from './components/XLSXUploaderStoragePrecargaxDefecto';
// import XLSXUploaderStoragePrecargaxDefectoHoja from "./components/XLSXUploaderStoragePrecargaxDefectoHoja";


import Docs from './components/NavigationBarDocs';
import NavigationBar from './components/NavigationBar';
import Catalogo from './components/Catalogo.json';



import Footer from './components/Footer';
import Terms from './components/footer/Términos de Uso';
import Privacy from './components/footer/Política de Privacidad';

// // ///////////////////////////////////////
// import Register from "./components/firebase/Register.jsx";
// import Register from "./components/firebase/Register.jsx";
// import Login from "./components/firebase/Login.jsx";

import SignIn from './components/firebase/SignIn';
import SignUp from './components/firebase/SignUp';
import ForgotPassword from './components/firebase/ForgotPassword';
import Redirect from './components/firebase/Redirect';
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import ExcelLoaderSiempreBorrandoSesion from "./components/ExcelLoaderSiempreBorrandoSesion.jsx"; // Asegúrate de que la ruta sea correcta
import MapaModal from "./components/MapaModal";

// // ///////////////////////////////////////
const App = () => {
    const lazyLoadComponent = (componentPath) =>
        React.lazy(() => import(/* @vite-ignore */ `.${componentPath}`));
    return (
        <>
            {/* <ExcelLoaderSiempreBorrandoSesion /> */}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >

                <Router>
                    <NavigationBar />
                    {/* Contenido principal */}
                    <Box>
                        <Routes>
                            {/*  */}
                            <Route path="/map/:lat/:lng" element={<MapaModal />} />
                            <Route path='/user/*' element={<Redirect url="/" />} />
                            <Route path='/login' element={<SignIn />} />
                            <Route path='/sign-up' element={<SignUp />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />
                            {/* <Route path='/XLSXUploaderStoragePrecargaxDefecto' element={<XLSXUploaderStoragePrecargaxDefecto />} />
                            <Route path="/XLSXUploaderStoragePrecargaxDefectoHoja/:sheetName" element={<XLSXUploaderStoragePrecargaxDefectoHoja />} /> */}

                            {/* <Route path='/XLSXUploaderStoragePrecargaxDefecto/:sheetName' element={<XLSXUploaderStoragePrecargaxDefecto />} /> */}

                            {/*  */}
                            <Route path='/terms' element={<Terms />} />
                            <Route path='/privacy' element={<Privacy />} />
                            {/*  */}
                            <Route path="/" element={<Home />} />
                            <Route path="/Docs" element={<Docs />} />
                            <Route path="/contacto" element={<Contact />} />
                            <Route path="/ayuda" element={<Ayuda />} />
                            {/* Rutas dinámicas para estudios no las estoy usando de momento */}
                            {Catalogo.map((documento) => {
                                const componentPath = `/docs/${documento.grupo}/${documento.sector}/${documento.cod}.jsx`;
                                return (
                                    <Route
                                        key={documento.codigo}
                                        path={`/docs/${documento.grupo}/` +
                                            `${documento.sector}/` +
                                            `${documento.cod}`}
                                        element={
                                            <Suspense fallback={<div>Importando sesión por defecto</div>}>
                                                {React.createElement(lazyLoadComponent(componentPath))}
                                            </Suspense>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </Box>
                    {/* <ImageCarousel /> */}
                    <Footer />
                </Router>
                {/* Consentimiento de Cookies */}
                <CookieConsent />
            </Box>
        </>
    );
};
export default App;

