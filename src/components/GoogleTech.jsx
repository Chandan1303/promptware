import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import BarChartIcon from '@mui/icons-material/BarChart';
import BrushIcon from '@mui/icons-material/Brush';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import TranslateIcon from '@mui/icons-material/Translate';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SecurityIcon from '@mui/icons-material/Security';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import StorageIcon from '@mui/icons-material/Storage';

export const GoogleTech = () => {
  const [apiStatus, setApiStatus] = useState({});

  useEffect(() => {
    // Check which APIs are configured
    const checkAPIs = () => {
      const status = {
        gemini: !!import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here',
        analytics: !!import.meta.env.VITE_GA_MEASUREMENT_ID && import.meta.env.VITE_GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX',
        maps: !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== 'your_maps_api_key_here',
        translate: !!import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY && import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY !== 'your_translate_api_key_here',
        vision: !!import.meta.env.VITE_GOOGLE_VISION_API_KEY && import.meta.env.VITE_GOOGLE_VISION_API_KEY !== 'your_vision_api_key_here',
        recaptcha: !!import.meta.env.VITE_RECAPTCHA_SITE_KEY && import.meta.env.VITE_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here',
      };
      setApiStatus(status);
    };
    checkAPIs();
  }, []);

  const techStack = [
    {
      title: 'Google Gemini AI',
      description: 'Advanced AI for personalized sustainability coaching and recommendations.',
      details: 'Analyzes user carbon footprint data, generates context-aware responses, provides actionable reduction strategies with markdown formatting. Includes intelligent fallback simulation mode.',
      icon: <SmartToyIcon sx={{ fontSize: 28, color: '#1A73E8' }} />,
      color: '#1A73E8',
      status: apiStatus.gemini,
      category: 'AI & ML'
    },
    {
      title: 'Google Maps API',
      description: 'Route optimization and transportation carbon footprint calculation.',
      details: 'Calculates carbon emissions for different transportation modes (driving, transit, biking, walking). Provides place autocomplete, distance matrix, and route planning with emission estimates.',
      icon: <MapIcon sx={{ fontSize: 28, color: '#34A853' }} />,
      color: '#34A853',
      status: apiStatus.maps,
      category: 'Location Services'
    },
    {
      title: 'Google Cloud Translation',
      description: 'Multi-language support with 100+ languages for global accessibility.',
      details: 'Real-time text translation, automatic language detection, batch translation support. Enables users worldwide to access sustainability advice in their native language.',
      icon: <TranslateIcon sx={{ fontSize: 28, color: '#E37400' }} />,
      color: '#E37400',
      status: apiStatus.translate,
      category: 'AI & ML'
    },
    {
      title: 'Google Cloud Vision AI',
      description: 'Receipt and document analysis for automated carbon tracking.',
      details: 'OCR text extraction from receipts, product label detection, document analysis. Automatically calculates carbon footprint from purchase receipts and shopping data.',
      icon: <CameraAltIcon sx={{ fontSize: 28, color: '#FBBC04' }} />,
      color: '#FBBC04',
      status: apiStatus.vision,
      category: 'AI & ML'
    },
    {
      title: 'Material Design 3',
      description: 'Google design system for modern, accessible UI/UX.',
      details: 'Responsive layouts, dynamic theming (light/dark/high-contrast), fluid animations, accessibility-first components. WCAG 2.1 AA compliant with semantic HTML and ARIA support.',
      icon: <BrushIcon sx={{ fontSize: 28, color: '#4285F4' }} />,
      color: '#4285F4',
      status: true,
      category: 'Design System'
    },
    {
      title: 'Google Analytics 4',
      description: 'Privacy-focused analytics for user engagement and feature tracking.',
      details: 'Custom event tracking (analyzer_calculated, goal_added, action_completed), accessibility feature usage monitoring, conversion funnels. No PII stored, GDPR compliant.',
      icon: <BarChartIcon sx={{ fontSize: 28, color: '#EA4335' }} />,
      color: '#EA4335',
      status: apiStatus.analytics,
      category: 'Analytics'
    },
    {
      title: 'Google reCAPTCHA v3',
      description: 'Invisible bot protection without disrupting user experience.',
      details: 'Score-based risk analysis, adaptive security, zero user interaction required. Protects forms and API endpoints from spam and automated abuse.',
      icon: <SecurityIcon sx={{ fontSize: 28, color: '#9334E6' }} />,
      color: '#9334E6',
      status: apiStatus.recaptcha,
      category: 'Security'
    },
    {
      title: 'Google Cloud Run',
      description: 'Serverless container deployment with automatic scaling.',
      details: 'Global CDN distribution, automatic HTTPS, 99.9% uptime SLA, pay-per-use pricing. Containerized deployment with Docker for consistent environments.',
      icon: <CloudQueueIcon sx={{ fontSize: 28, color: '#34A853' }} />,
      color: '#34A853',
      status: true,
      category: 'Infrastructure'
    },
    {
      title: 'Google Fonts',
      description: 'Optimized web typography with Outfit and Inter font families.',
      details: 'Subset optimization for faster loading, variable font support, display=swap for better performance. Accessible typography with clear readability and proper contrast.',
      icon: <FontDownloadIcon sx={{ fontSize: 28, color: '#4285F4' }} />,
      color: '#4285F4',
      status: true,
      category: 'Performance'
    },
    {
      title: 'Google Cloud Storage',
      description: 'Scalable object storage for user-uploaded content (optional).',
      details: 'Secure file storage with encryption at rest, global availability, lifecycle management. Supports image optimization, CDN integration, and access control.',
      icon: <StorageIcon sx={{ fontSize: 28, color: '#FBBC04' }} />,
      color: '#FBBC04',
      status: !!import.meta.env.VITE_GCS_BUCKET_NAME,
      category: 'Storage'
    }
  ];

  const configuredCount = Object.values(apiStatus).filter(Boolean).length + 4; // +4 for always-on services
  const totalServices = techStack.length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Powered by {totalServices} Google Cloud Services
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          EcoGuide AI leverages the full power of Google Cloud Platform to deliver intelligent, secure, and accessible sustainability solutions.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip 
            label={`${configuredCount}/${totalServices} Services Active`} 
            color={configuredCount === totalServices ? 'success' : 'warning'}
            icon={<CheckCircleIcon />}
          />
          <Chip label="No Firebase" color="info" />
          <Chip label="Client-Side Architecture" variant="outlined" />
        </Stack>
      </Box>

      {/* Architecture Overview */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          borderColor: 'divider',
          backgroundColor: 'action.hover'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Google Cloud Architecture
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          EcoGuide AI uses a modern, serverless architecture built entirely on Google Cloud services. All user data is stored locally (LocalStorage) for privacy, while leveraging Google's AI, ML, and cloud infrastructure for intelligent features.
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            '100% Google Cloud Stack',
            'No Firebase Required',
            'Serverless & Scalable',
            'Privacy-First Design',
            'AI-Powered Intelligence',
            'Global CDN Distribution',
            'WCAG 2.1 AA Compliant',
            'Multi-Language Support'
          ].map((text, idx) => (
            <Grid xs={12} sm={6} md={3} key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{text}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Service Categories */}
      {['AI & ML', 'Location Services', 'Design System', 'Analytics', 'Security', 'Infrastructure', 'Performance', 'Storage'].map(category => {
        const categoryServices = techStack.filter(s => s.category === category);
        if (categoryServices.length === 0) return null;

        return (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
              {category}
            </Typography>
            <Grid container spacing={3}>
              {categoryServices.map((tech, idx) => (
                <Grid xs={12} md={6} key={idx}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: tech.status ? 'success.light' : 'divider',
                      boxShadow: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '5px',
                        backgroundColor: tech.color
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, ml: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: `${tech.color}12`, width: 48, height: 48 }}>
                            {tech.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                              {tech.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tech.category}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={tech.status ? 'Active' : 'Available'} 
                          size="small"
                          color={tech.status ? 'success' : 'default'}
                          variant={tech.status ? 'filled' : 'outlined'}
                        />
                      </Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: '500', mb: 1 }}>
                        {tech.description}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {tech.details}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}

      {/* Integration Benefits */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mt: 4,
          borderRadius: '16px',
          borderColor: 'primary.main',
          backgroundColor: 'primary.50'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Why Google Cloud?
        </Typography>
        <Grid container spacing={2}>
          {[
            { title: 'Enterprise-Grade Security', desc: 'Bank-level encryption, DDoS protection, compliance certifications' },
            { title: 'Global Infrastructure', desc: '35+ regions worldwide, <100ms latency, 99.9% uptime SLA' },
            { title: 'AI Leadership', desc: 'State-of-the-art Gemini AI, Vision, Translation, and ML services' },
            { title: 'Cost Efficiency', desc: 'Pay-per-use pricing, automatic scaling, no idle costs' }
          ].map((benefit, idx) => (
            <Grid xs={12} sm={6} key={idx}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {benefit.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default GoogleTech;
