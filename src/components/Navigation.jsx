import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoIcon from '@mui/icons-material/Info';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import GrassIcon from '@mui/icons-material/Grass';
import MapIcon from '@mui/icons-material/Map';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navigation = ({
  activeTab,
  setActiveTab,
  onOpenAccessibility
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { user, loginWithGoogle, logout } = useAuth();
  const { t } = useLanguage();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'dashboard', label: t('Dashboard'), icon: <DashboardIcon aria-hidden="true" /> },
    { id: 'analyzer', label: t('Carbon Analyzer'), icon: <AssessmentIcon aria-hidden="true" /> },
    { id: 'assistant', label: t('AI Coach Chat'), icon: <ChatIcon aria-hidden="true" /> },
    { id: 'routecalc', label: t('Route Calculator'), icon: <MapIcon aria-hidden="true" /> },
    { id: 'receipt', label: t('Receipt Scanner'), icon: <ReceiptIcon aria-hidden="true" /> },
    { id: 'actions', label: t('Action Engine'), icon: <AssignmentTurnedInIcon aria-hidden="true" /> },
    { id: 'google', label: t('Google Services'), icon: <InfoIcon aria-hidden="true" /> }
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <GrassIcon color="primary" sx={{ fontSize: '32px' }} aria-hidden="true" />
        <Box>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {t('EcoGuide AI')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('Your Sustainability Coach')}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List component="nav" aria-label="Main navigation menu" sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setMobileOpen(false);
                }}
                aria-label={`${t('Go to')} ${item.label}`}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(0, 230, 118, 0.15)' 
                      : 'rgba(15, 81, 50, 0.08)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(0, 230, 118, 0.25)' 
                        : 'rgba(15, 81, 50, 0.12)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Login Section at the bottom of the Drawer */}
      <Box sx={{ p: 2 }}>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || 'User profile'}
              sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: '2px solid', borderColor: 'primary.light' }}
            >
              {user.displayName ? user.displayName[0] : 'U'}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: '600' }}>
                {user.displayName || 'Guest User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user.email || 'Anonymous Session'}
              </Typography>
            </Box>
            <Tooltip title={t('Log out')}>
              <IconButton
                onClick={logout}
                color="error"
                size="small"
                aria-label={t('Logout user session')}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={loginWithGoogle}
            aria-label={t('Sign in with Google Account')}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: '600',
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {t('Google Sign-In')}
          </Button>
        )}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AccessibilityNewIcon />}
          onClick={onOpenAccessibility}
          aria-label={t('Open Accessibility Panel')}
          sx={{
            mt: 1,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: '500'
          }}
        >
          {t('Accessibility Settings')}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Top Navbar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open navigation drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <GrassIcon color="primary" sx={{ mr: 1 }} aria-hidden="true" />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
              {t('EcoGuide AI')}
            </Typography>
            <LanguageSwitcher />
            {user && (
              <Avatar
                src={user.photoURL || undefined}
                alt={user.displayName || 'User Profile'}
                sx={{ width: 32, height: 32, ml: 1 }}
              />
            )}
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Navigation for Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 280, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' },
          }}
          aria-label="Sidebar desktop navigation"
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer Navigation for Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            [`& .MuiDrawer-paper`]: { width: 280, boxSizing: 'border-box' },
          }}
          aria-label="Sidebar mobile navigation drawer"
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Navigation;
