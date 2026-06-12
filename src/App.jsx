import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CarbonProvider } from './context/CarbonContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CarbonAnalyzer from './components/CarbonAnalyzer';
import AIAssistant from './components/AIAssistant';
import ActionEngine from './components/ActionEngine';
import GoogleTech from './components/GoogleTech';
import RouteCalculator from './components/RouteCalculator';
import ReceiptScanner from './components/ReceiptScanner';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [themeMode, _setThemeMode] = useState(() => {
    const saved = localStorage.getItem('eco_theme_mode');
    return saved || 'dark';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('eco_high_contrast') === 'true';
  });

  useEffect(() => {
    const handleSettingsChange = () => {
      setHighContrast(localStorage.getItem('eco_high_contrast') === 'true');
    };
    window.addEventListener('accessibility-settings-changed', handleSettingsChange);
    return () => {
      window.removeEventListener('accessibility-settings-changed', handleSettingsChange);
    };
  }, []);

  const theme = useMemo(() => {
    const isDark = themeMode === 'dark';
    
    const primaryColor = highContrast 
      ? (isDark ? '#00E676' : '#0F5132')
      : (isDark ? '#00BFA5' : '#0F5132');
      
    const backgroundColor = isDark 
      ? (highContrast ? '#000000' : '#121212') 
      : (highContrast ? '#FFFFFF' : '#F8F9FA');

    const paperColor = isDark 
      ? (highContrast ? '#000000' : '#1E1E1E') 
      : '#FFFFFF';

    const textPrimary = isDark ? '#FFFFFF' : '#1C1B1F';
    const textSecondary = isDark ? '#BDBDBD' : '#49454F';

    return createTheme({
      palette: {
        mode: themeMode,
        primary: {
          main: primaryColor,
          contrastText: '#FFFFFF'
        },
        secondary: {
          main: isDark ? '#8FBC8F' : '#4CAF50'
        },
        background: {
          default: backgroundColor,
          paper: paperColor
        },
        text: {
          primary: textPrimary,
          secondary: textSecondary
        },
        divider: highContrast ? (isDark ? '#FFFFFF' : '#000000') : 'rgba(0,0,0,0.12)'
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800 },
        h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 550 },
        button: { textTransform: 'none', fontWeight: 600 }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '10px',
              padding: '10px 20px',
              outline: highContrast ? '2px solid transparent' : 'none',
              '&:focus-visible': {
                outline: '3px solid #00BFA5',
                outlineOffset: '2px'
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: '16px',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDark 
                  ? '0 8px 24px rgba(0,0,0,0.4)' 
                  : '0 8px 24px rgba(0,0,0,0.08)'
              }
            }
          }
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: '10px',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px'
              }
            }
          }
        }
      }
    });
  }, [themeMode, highContrast]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analyzer':
        return <CarbonAnalyzer />;
      case 'assistant':
        return <AIAssistant />;
      case 'routecalc':
        return <RouteCalculator />;
      case 'receipt':
        return <ReceiptScanner />;
      case 'actions':
        return <ActionEngine />;
      case 'google':
        return <GoogleTech />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <AuthProvider>
          <CarbonProvider>
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              {renderActiveTab()}
            </Layout>
          </CarbonProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
