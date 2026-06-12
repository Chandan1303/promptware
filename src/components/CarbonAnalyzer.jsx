import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Slider,
  TextField,
  Alert,
  Grid,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCarbon } from '../context/CarbonContext';

const steps = [
  'Transportation',
  'Dietary Choices',
  'Home Utilities',
  'Shopping & Waste'
];

export const CarbonAnalyzer = () => {
  const { answers, updateAnswers } = useCarbon();
  const [activeStep, setActiveStep] = useState(0);
  
  const [formData, setFormData] = useState({ ...answers });
  const [validationError, setValidationError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleNext = () => {
    if (activeStep === 0 && (isNaN(formData.transportKm) || formData.transportKm < 0)) {
      setValidationError('Please enter a valid transportation distance.');
      return;
    }
    setValidationError(null);
    if (activeStep === steps.length - 1) {
      handleCalculate();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setIsSaved(false);
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setIsSaved(false);
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    updateAnswers(formData);
    setIsSaved(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Smart Carbon Analyzer
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Answer these lifestyle questions to calculate your daily, monthly, and annual greenhouse gas emissions.
      </Typography>

      <Box sx={{ display: 'none' }}>
        <Typography component="div" role="status" aria-live="polite">
          Step {activeStep + 1} of 4: {steps[activeStep]}.
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, display: { xs: 'none', sm: 'flex' } }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {validationError && (
        <Alert severity="error" sx={{ mb: 3 }} role="alert">
          {validationError}
        </Alert>
      )}

      {isSaved && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setIsSaved(false)}>
              Dismiss
            </Button>
          }
        >
          Your carbon footprint has been recalculated! Check the **Dashboard** to view updated charts and projections.
        </Alert>
      )}

      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 4 }}>
          {/* STEP 1: TRANSPORTATION */}
          {activeStep === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <DirectionsCarIcon color="primary" sx={{ fontSize: '32px' }} aria-hidden="true" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Transportation Footprint
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel id="transport-type-label" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>
                      Primary Mode of Transit
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="transport-type-label"
                      name="transportType"
                      value={formData.transportType}
                      onChange={(e) => handleInputChange('transportType', e.target.value)}
                      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
                    >
                      {[
                        { value: 'walk', label: 'Walk (Zero Emissions)' },
                        { value: 'bike', label: 'Bicycle (Zero Emissions)' },
                        { value: 'bus', label: 'Public Bus' },
                        { value: 'train', label: 'Commuter Train' },
                        { value: 'car', label: 'Personal Gasoline Car' },
                        { value: 'flight', label: 'Airplane Commutes / Flights' }
                      ].map((item) => (
                        <Paper
                          key={item.value}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            borderColor: formData.transportType === item.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.transportType === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' }
                          }}
                          onClick={() => handleInputChange('transportType', item.value)}
                        >
                          <FormControlLabel
                            value={item.value}
                            control={<Radio />}
                            label={item.label}
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormLabel id="transport-km-label" sx={{ fontWeight: 'bold', display: 'block', mb: 2, color: 'text.primary' }}>
                    Average Daily Distance
                  </FormLabel>
                  <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                    <Grid sx={{ flexGrow: 1 }}>
                      <Slider
                        value={formData.transportKm}
                        min={0}
                        max={150}
                        onChange={(_, value) => handleInputChange('transportKm', value)}
                        aria-labelledby="transport-km-label"
                        valueLabelDisplay="auto"
                        sx={{ py: 2 }}
                      />
                    </Grid>
                    <Grid xs={4} sm={3}>
                      <TextField
                        type="number"
                        label="Daily km"
                        value={formData.transportKm}
                        onChange={(e) => handleInputChange('transportKm', parseInt(e.target.value) || 0)}
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            max: 1000,
                            'aria-label': 'Daily transit distance in kilometers'
                          },
                          input: {
                            endAdornment: <InputAdornment position="end">km</InputAdornment>
                          }
                        }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* STEP 2: DIETARY CHOICES */}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <RestaurantIcon color="primary" sx={{ fontSize: '32px' }} aria-hidden="true" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Dietary Habits
                </Typography>
              </Box>

              <FormControl component="fieldset" fullWidth>
                <FormLabel id="diet-label" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                  Choose the category that best describes your eating habits:
                </FormLabel>
                <RadioGroup
                  aria-labelledby="diet-label"
                  name="diet"
                  value={formData.diet}
                  onChange={(e) => handleInputChange('diet', e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  {[
                    { value: 'vegan', title: 'Vegan', desc: 'Strictly plant-based diet. Excludes meat, dairy, eggs, and all animal derivatives. (Lowest CO2 impact)' },
                    { value: 'vegetarian', title: 'Vegetarian', desc: 'No meat, but eats dairy and eggs. (Low CO2 impact)' },
                    { value: 'mixed', title: 'Mixed Diet', desc: 'Balanced diet. Moderate consumption of poultry, fish, meat, and vegetables. (Average CO2 impact)' },
                    { value: 'meat', title: 'Heavy Meat Consumption', desc: 'Frequent beef, pork, and lamb dishes. (High CO2 impact)' }
                  ].map((item) => (
                    <Paper
                      key={item.value}
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        borderColor: formData.diet === item.value ? 'primary.main' : 'divider',
                        backgroundColor: formData.diet === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                        '&:hover': { borderColor: 'primary.light' }
                      }}
                      onClick={() => handleInputChange('diet', item.value)}
                    >
                      <FormControlLabel
                        value={item.value}
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {/* STEP 3: HOME UTILITIES */}
          {activeStep === 2 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <FlashOnIcon color="primary" sx={{ fontSize: '32px' }} aria-hidden="true" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Home Utilities
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel id="electricity-label" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                      Electricity Usage Level
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="electricity-label"
                      name="electricity"
                      value={formData.electricity}
                      onChange={(e) => handleInputChange('electricity', e.target.value)}
                      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
                    >
                      {[
                        { value: 'low', title: 'Low', desc: 'Minimal heating/cooling, energy-saver lightbulbs' },
                        { value: 'medium', title: 'Medium', desc: 'Standard usage, typical household appliances' },
                        { value: 'high', title: 'High', desc: 'Central cooling/heating on always, multiple computers/televisions' }
                      ].map((item) => (
                        <Paper
                          key={item.value}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderColor: formData.electricity === item.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.electricity === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' }
                          }}
                          onClick={() => handleInputChange('electricity', item.value)}
                        >
                          <FormControlLabel
                            value={item.value}
                            control={<Radio sx={{ alignSelf: 'center' }} />}
                            label=""
                            sx={{ m: 0 }}
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{item.desc}</Typography>
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel id="water-label" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                      Water Usage Level
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="water-label"
                      name="water"
                      value={formData.water}
                      onChange={(e) => handleInputChange('water', e.target.value)}
                      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
                    >
                      {[
                        { value: 'low', title: 'Low', desc: 'Quick 5m showers, dual-flush toilets, no yard irrigation' },
                        { value: 'medium', title: 'Medium', desc: 'Standard showers, running laundry regularly' },
                        { value: 'high', title: 'High', desc: 'Long baths, regular garden sprinklers, frequent car washing' }
                      ].map((item) => (
                        <Paper
                          key={item.value}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderColor: formData.water === item.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.water === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' }
                          }}
                          onClick={() => handleInputChange('water', item.value)}
                        >
                          <FormControlLabel
                            value={item.value}
                            control={<Radio sx={{ alignSelf: 'center' }} />}
                            label=""
                            sx={{ m: 0 }}
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{item.desc}</Typography>
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* STEP 4: SHOPPING & WASTE */}
          {activeStep === 3 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <ShoppingBagIcon color="primary" sx={{ fontSize: '32px' }} aria-hidden="true" />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Shopping & Waste Habits
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel id="shopping-label" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                      Shopping Habits (Consumer Goods)
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="shopping-label"
                      name="shopping"
                      value={formData.shopping}
                      onChange={(e) => handleInputChange('shopping', e.target.value)}
                      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
                    >
                      {[
                        { value: 'low', title: 'Low', desc: 'Secondhand items mostly, purchases are only essentials' },
                        { value: 'medium', title: 'Medium', desc: 'Frequent consumer purchases, electronics every 2 years' },
                        { value: 'high', title: 'High', desc: 'Regular brand-new shopping, fast fashion clothing, yearly tech upgrades' }
                      ].map((item) => (
                        <Paper
                          key={item.value}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderColor: formData.shopping === item.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.shopping === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' }
                          }}
                          onClick={() => handleInputChange('shopping', item.value)}
                        >
                          <FormControlLabel
                            value={item.value}
                            control={<Radio sx={{ alignSelf: 'center' }} />}
                            label=""
                            sx={{ m: 0 }}
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{item.desc}</Typography>
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel id="waste-label" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                      Waste Generation Level
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="waste-label"
                      name="waste"
                      value={formData.waste}
                      onChange={(e) => handleInputChange('waste', e.target.value)}
                      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
                    >
                      {[
                        { value: 'low', title: 'Low', desc: 'Composts, recycles everything, minimal plastic packaging usage' },
                        { value: 'medium', title: 'Medium', desc: 'Typical garbage bin output, basic recycling' },
                        { value: 'high', title: 'High', desc: 'Frequent trash, high levels of food waste, zero composting' }
                      ].map((item) => (
                        <Paper
                          key={item.value}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderColor: formData.waste === item.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.waste === item.value ? 'rgba(0, 230, 118, 0.04)' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' }
                          }}
                          onClick={() => handleInputChange('waste', item.value)}
                        >
                          <FormControlLabel
                            value={item.value}
                            control={<Radio sx={{ alignSelf: 'center' }} />}
                            label=""
                            sx={{ m: 0 }}
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>{item.desc}</Typography>
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
              aria-label="Go back to the previous step"
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
              aria-label={activeStep === steps.length - 1 ? 'Calculate Carbon Footprint' : 'Go to next step'}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: '600',
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              {activeStep === steps.length - 1 ? 'Calculate Footprint' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default CarbonAnalyzer;
