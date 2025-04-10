import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyPolicy from './footer/Política de Privacidad';
import TermsOfUse from './footer/Términos de Uso';
import AboutUs from './footer/Sobre mi';
const fuchsiaColor = "#D100D1"; // Código de color fucsia

const FooterResponsive = () => {
  const [openDialog, setOpenDialog] = useState(null);

  const handleOpenDialog = (dialog) => {
    setOpenDialog(dialog);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div>
      {/* Diálogos de footer */}
      <Dialog open={openDialog === 'terms'} onClose={handleCloseDialog}>
        <DialogTitle>Términos de Uso</DialogTitle>
        <DialogContent>
          <TermsOfUse />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'privacy'} onClose={handleCloseDialog}>
        <DialogTitle>Política de Privacidad</DialogTitle>
        <DialogContent>
          <PrivacyPolicy />
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'about'} onClose={handleCloseDialog}>
        <DialogTitle>Sobre mi</DialogTitle>
        <DialogContent>
          <AboutUs />
        </DialogContent>
      </Dialog>

      {/* Footer con BottomNavigation */}
      <BottomNavigation 
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        height: 55,
        bgcolor: 'rgba(255, 255, 255, 0.0)',
        // backdropFilter: 'blur(5px)' // Desenfoque del fondo
    }}

    



      >
        <Tooltip title="Términos de Uso">
          <BottomNavigationAction
            label="Términos"
            icon={<GavelIcon fontSize="small" />}
            onClick={() => handleOpenDialog('terms')}
            // sx={{ color: 'primary.main' }}
            sx={{ color: fuchsiaColor }}
          />
        </Tooltip>

        <Tooltip title="Política de Privacidad">
          <BottomNavigationAction
            label="Privacidad"
            icon={<PolicyIcon fontSize="small" />}
            onClick={() => handleOpenDialog('privacy')}
            sx={{ color: fuchsiaColor}}
          />
        </Tooltip>

        <Tooltip title="Sobre mi">
          <BottomNavigationAction
            label="Sobre mi"
            icon={<InfoIcon fontSize="small" />}
            onClick={() => handleOpenDialog('about')}
            sx={{ color:fuchsiaColor }}
          />
        </Tooltip>

      </BottomNavigation>

    </div >
  );
};

export default FooterResponsive;
