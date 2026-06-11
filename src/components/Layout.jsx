import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Navigation from './Navigation';
import AccessibilityConfig from './AccessibilityConfig';

export const Layout = ({ children, activeTab, setActiveTab }) => {
  const [accessOpen, setAccessOpen] = useState(false);

  const handleOpenAccessibility = () => {
    setAccessOpen(true);
  };

  const handleCloseAccessibility = () => {
    setAccessOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '10px',
          background: '#0F5132',
          color: 'white',
          padding: '10px 15px',
          zIndex: 9999,
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'top 0.2s'
        }}
      >
        Skip to main content
      </a>

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAccessibility={handleOpenAccessibility}
      />

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          pt: { xs: 8, md: 3 },
          width: { md: 'calc(100% - 280px)' },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none'
        }}
      >
        {children}
      </Box>

      <Dialog
        open={accessOpen}
        onClose={handleCloseAccessibility}
        aria-labelledby="accessibility-settings-title"
        fullWidth
        maxWidth="sm"
        keepMounted={false}
        disablePortal={false}
        PaperProps={{
          sx: { borderRadius: '16px', p: 1 }
        }}
      >
        <DialogTitle id="accessibility-settings-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          Accessibility Configurations
          <IconButton onClick={handleCloseAccessibility} aria-label="Close accessibility panel" size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ border: 'none' }}>
          <AccessibilityConfig />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAccessibility} variant="contained" color="primary" sx={{ borderRadius: '8px', textTransform: 'none', color: '#fff' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Layout;
