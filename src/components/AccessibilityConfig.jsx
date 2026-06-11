import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  Divider,
  Button
} from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ContrastIcon from '@mui/icons-material/Contrast';

export const AccessibilityConfig = () => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('eco_font_size') || 'medium';
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('eco_high_contrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('eco_reduced_motion') === 'true';
  });

  const [screenReaderHints, setScreenReaderHints] = useState(() => {
    return localStorage.getItem('eco_sr_hints') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'medium') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    }
    localStorage.setItem('eco_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('eco_high_contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    localStorage.setItem('eco_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('eco_sr_hints', String(screenReaderHints));
    window.dispatchEvent(new Event('accessibility-settings-changed'));
  }, [screenReaderHints]);

  const handleReset = () => {
    setFontSize('medium');
    setHighContrast(false);
    setReducedMotion(false);
    setScreenReaderHints(false);
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: highContrast ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
        mb: 3
      }}
      aria-label="Accessibility Settings Panel"
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessibilityIcon color="primary" aria-hidden="true" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Accessibility Options (WCAG 2.1 AA)
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize the reading and interface configurations to align with your personal needs.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Font Size Configuration */}
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ZoomInIcon fontSize="small" color="action" aria-hidden="true" />
            <Typography id="font-size-label" variant="subtitle2" sx={{ fontWeight: '600' }}>
              Base Text Size
            </Typography>
          </Box>
          <FormControl component="fieldset" aria-labelledby="font-size-label">
            <RadioGroup
              row
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              name="font-size-options"
            >
              <FormControlLabel
                value="small"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '0.875rem' }}>Small</Typography>}
              />
              <FormControlLabel
                value="medium"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '1rem' }}>Medium (Default)</Typography>}
              />
              <FormControlLabel
                value="large"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Large</Typography>}
              />
              <FormControlLabel
                value="xlarge"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Extra Large</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Display Settings */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ContrastIcon fontSize="small" color="action" aria-hidden="true" />
            <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
              Visual Adjustments
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                inputProps={{ 'aria-label': 'Toggle High Contrast Mode' }}
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>High Contrast Theme</Typography>
                <Typography variant="caption" color="text.secondary">Increases visibility ratio for text labels</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                inputProps={{ 'aria-label': 'Toggle Reduced Motion Mode' }}
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>Reduce Animations</Typography>
                <Typography variant="caption" color="text.secondary">Halts screen flashes and sliding transitions</Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={screenReaderHints}
                onChange={(e) => setScreenReaderHints(e.target.checked)}
                inputProps={{ 'aria-label': 'Toggle Screen Reader Explanatory Guides' }}
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>Extended Screen Reader Text</Typography>
                <Typography variant="caption" color="text.secondary">Adds detailed ARIA logs for charts and visual graphs</Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={handleReset}
            aria-label="Reset accessibility options to default settings"
            sx={{ borderRadius: '8px' }}
          >
            Reset Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
export default AccessibilityConfig;
