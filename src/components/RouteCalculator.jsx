import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import NavigationIcon from '@mui/icons-material/Navigation';
import NatureIcon from '@mui/icons-material/Nature';
import { useLanguage } from '../context/LanguageContext';
import { calculateRouteCarbonFootprint } from '../services/googleMaps';

export const RouteCalculator = () => {
  const { t } = useLanguage();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('driving');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError(t('Please enter both origin and destination'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await calculateRouteCarbonFootprint(origin, destination, mode);
      
      if (data.error) {
        if (data.error.includes('not available')) {
          setError('Google Maps API key is not configured or invalid. Please check your .env file and ensure the Maps JavaScript API is enabled in Google Cloud Console with proper referrer restrictions.');
        } else {
          setError(data.error);
        }
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
      setError('Failed to calculate route. This could be due to: 1) Invalid API key, 2) API key restrictions (check HTTP referrers), 3) APIs not enabled (Maps JavaScript API, Directions API, Places API). Please check Google Cloud Console settings.');
    } finally {
      setLoading(false);
    }
  };

  const transportModes = [
    { value: 'driving', label: 'Driving', icon: <DirectionsCarIcon />, color: '#EA4335' },
    { value: 'transit', label: 'Transit', icon: <DirectionsBusIcon />, color: '#FBBC04' },
    { value: 'bicycling', label: 'Biking', icon: <DirectionsBikeIcon />, color: '#34A853' },
    { value: 'walking', label: 'Walking', icon: <DirectionsWalkIcon />, color: '#4285F4' }
  ];

  const selectedMode = transportModes.find(m => m.value === mode);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        {t('Route Carbon Calculator')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Compare carbon emissions across different transportation modes using Google Maps API.
      </Typography>

      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your_maps_api_key_here' ? (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Maps API Not Configured
          </Typography>
          <Typography variant="body2">
            Add your Google Maps API key to the .env file to enable route calculations.
          </Typography>
        </Alert>
      ) : null}

      <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Starting Location"
                placeholder="e.g., San Francisco, CA"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                InputProps={{
                  startAdornment: <NavigationIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                fullWidth
                label="Destination"
                placeholder="e.g., Los Angeles, CA"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                InputProps={{
                  startAdornment: <NavigationIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>

            <Grid xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Transportation Mode
              </Typography>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={(e, newMode) => newMode && setMode(newMode)}
                fullWidth
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
                  gap: 2 
                }}
              >
                {transportModes.map((transport) => (
                  <ToggleButton
                    key={transport.value}
                    value={transport.value}
                    sx={{
                      borderRadius: '12px !important',
                      border: '2px solid',
                      borderColor: mode === transport.value ? transport.color : 'divider',
                      backgroundColor: mode === transport.value ? `${transport.color}15` : 'transparent',
                      py: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: `${transport.color}10`,
                        borderColor: transport.color
                      }
                    }}
                  >
                    <Box sx={{ color: transport.color, fontSize: '32px' }}>
                      {transport.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {transport.label}
                    </Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCalculate}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CompareArrowsIcon />}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 'bold',
                  backgroundColor: selectedMode.color,
                  '&:hover': {
                    backgroundColor: selectedMode.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                {loading ? 'Calculating Route...' : 'Calculate Carbon Footprint'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: '16px',
            border: '2px solid',
            borderColor: selectedMode.color,
            backgroundColor: `${selectedMode.color}05`
          }}
        >
          {result.demo && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Demo Mode - Estimated Results
              </Typography>
              <Typography variant="body2">
                These are estimated calculations. Enable Google Maps API for accurate route data.
              </Typography>
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ fontSize: '48px', color: selectedMode.color }}>
              {selectedMode.icon}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {selectedMode.label} Route Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {origin} → {destination}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Distance
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: selectedMode.color }}>
                  {result.distance}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {result.distanceKm} kilometers
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Duration
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: selectedMode.color }}>
                  {result.duration}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  estimated travel time
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Carbon Emissions
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: selectedMode.color }}>
                  {result.carbonKg} kg
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CO2 equivalent
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {parseFloat(result.carbonKg) === 0 ? (
            <Alert severity="success" icon={<NatureIcon />} sx={{ borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Zero Emissions! 🌱
              </Typography>
              <Typography variant="body2">
                {selectedMode.label} is an eco-friendly transportation choice with no carbon footprint.
              </Typography>
            </Alert>
          ) : (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                💡 Eco-Friendly Alternatives:
              </Typography>
              <Stack spacing={1}>
                {mode !== 'walking' && (
                  <Chip
                    label="Walking would produce 0 kg CO2 (if distance allows)"
                    icon={<DirectionsWalkIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                )}
                {mode !== 'bicycling' && (
                  <Chip
                    label="Biking would produce 0 kg CO2"
                    icon={<DirectionsBikeIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                )}
                {mode !== 'transit' && (
                  <Chip
                    label={`Public transit would produce ${(parseFloat(result.distanceKm) * 0.089).toFixed(2)} kg CO2 (${Math.round(((parseFloat(result.carbonKg) - parseFloat(result.distanceKm) * 0.089) / parseFloat(result.carbonKg)) * 100)}% reduction)`}
                    icon={<DirectionsBusIcon />}
                    color="warning"
                    sx={{ justifyContent: 'flex-start' }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default RouteCalculator;
