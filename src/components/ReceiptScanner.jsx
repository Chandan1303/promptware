import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NatureIcon from '@mui/icons-material/Nature';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { analyzeReceipt } from '../services/googleVision';

export const ReceiptScanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeReceipt(file);
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Failed to analyze receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Receipt Carbon Scanner
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload shopping receipts to automatically calculate carbon footprint using Google Vision AI.
      </Typography>

      <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {!previewUrl ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <CameraAltIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.5 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Upload Receipt Image
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Take a photo or upload an existing receipt image. Our AI will extract items and estimate carbon emissions.
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                size="large"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold'
                }}
              >
                Choose Receipt Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          ) : (
            <Box>
              <img
                src={previewUrl}
                alt="Receipt preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              {!loading && !result && (
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ borderRadius: '10px' }}
                >
                  Choose Different Image
                </Button>
              )}
            </Box>
          )}

          {loading && (
            <Box sx={{ mt: 3 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Analyzing receipt with Google Vision AI...
              </Typography>
            </Box>
          )}
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
            borderColor: 'success.main',
            backgroundColor: 'success.50'
          }}
        >
          {result.demo && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Demo Mode - Estimated Results
              </Typography>
              <Typography variant="body2">
                This feature is running in offline simulation mode because the Google Vision API key is not configured.
              </Typography>
            </Alert>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ReceiptIcon sx={{ fontSize: 48, color: 'success.main' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Analysis Complete
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Google Vision AI extracted {result.items.length} items
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Total Items
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {result.items.length}
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Total Cost
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${result.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  Carbon Footprint
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {result.totalCarbon} kg
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CO2 equivalent
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBagIcon /> Detected Items
          </Typography>

          {result.items.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: '12px' }}>
              {result.items.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px',
                    mb: 1,
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.description}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Chip
                          label={`$${item.price.toFixed(2)}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${item.carbonKg.toFixed(3)} kg CO2`}
                          size="small"
                          color="warning"
                          icon={<NatureIcon />}
                        />
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              No items detected. Try uploading a clearer image of the receipt.
            </Alert>
          )}

          {result.labels && result.labels.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Detected Categories:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {result.labels.slice(0, 5).map((label, idx) => (
                  <Chip key={idx} label={label} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ borderRadius: '10px', mr: 2 }}
            >
              Scan Another Receipt
            </Button>
          </Box>
        </Paper>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mt: 4,
          borderRadius: '16px',
          backgroundColor: 'info.50'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          💡 How It Works
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              1. Upload Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Take a clear photo of your shopping receipt
            </Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              2. AI Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Google Vision extracts items and prices using OCR
            </Typography>
          </Grid>
          <Grid xs={12} sm={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              3. Carbon Estimate
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calculate emissions based on product categories
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ReceiptScanner;
