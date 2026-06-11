import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  TextField,
  Divider,
  Avatar,
  Stack,
  Alert,
  Paper
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useCarbon } from '../context/CarbonContext';

export const ActionEngine = () => {
  const { actions, toggleAction } = useCarbon();
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'transport':
        return <DirectionsCarIcon color="primary" />;
      case 'food':
        return <RestaurantIcon color="primary" />;
      case 'utilities':
        return <FlashOnIcon color="primary" />;
      case 'shopping':
        return <ShoppingBagIcon color="primary" />;
      case 'waste':
        return <DeleteIcon color="primary" />;
      default:
        return <InfoIcon color="primary" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredActions = actions.filter((action) => {
    const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || action.difficulty === filterDifficulty;
    const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          action.impact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const totalSavings = actions
    .filter((a) => a.completed)
    .reduce((sum, current) => sum + current.impactValue, 0);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Personalized Action Engine
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review customized activities generated from your profile. Actively completing tasks offsets your emissions.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'primary.light',
          backgroundColor: 'rgba(0, 230, 118, 0.03)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" /> Committed Reduction Savings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cumulative annual carbon emissions saved by pursuing active commitments listed below.
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {totalSavings.toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            kg CO2 Saved / Year
          </Typography>
        </Box>
      </Paper>

      <Card sx={{ mb: 4, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-category-label">Category</InputLabel>
                <Select
                  labelId="filter-category-label"
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="transport">Transportation</MenuItem>
                  <MenuItem value="food">Dietary Habits</MenuItem>
                  <MenuItem value="utilities">Home Utilities</MenuItem>
                  <MenuItem value="shopping">Consumer Shopping</MenuItem>
                  <MenuItem value="waste">Waste Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="filter-difficulty-label"
                  value={filterDifficulty}
                  label="Difficulty"
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <MenuItem value="all">All Difficulties</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid xs={12} sm={4}>
              <TextField
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                fullWidth
                inputProps={{ 'aria-label': 'Search recommended actions' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredActions.length === 0 ? (
        <Alert severity="info" sx={{ py: 2, borderRadius: '12px' }}>
          No recommendations match your filtering queries. Modify your selection or update the Carbon Analyzer.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredActions.map((action) => (
            <Grid xs={12} md={6} key={action.id}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: action.completed ? 'primary.light' : 'divider',
                  boxShadow: action.completed ? '0 4px 16px rgba(0,230,118,0.06)' : 'none',
                  backgroundColor: action.completed ? 'rgba(0, 230, 118, 0.01)' : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  height: '100%'
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'action.hover', width: 44, height: 44 }} aria-hidden="true">
                      {getCategoryIcon(action.category)}
                    </Avatar>
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={action.completed}
                          onChange={() => toggleAction(action.id)}
                          inputProps={{ 'aria-label': `Commit to: ${action.title}` }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: action.completed ? 'primary.main' : 'text.secondary' }}>
                          {action.completed ? 'Active Commitment' : 'Add to Plan'}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1.5,
                      textDecoration: action.completed ? 'line-through' : 'none',
                      color: action.completed ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {action.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {action.impact}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                    <Chip
                      label={`Save ~${action.impactValue} kg/yr`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: '600' }}
                    />
                    <Chip
                      label={`Difficulty: ${action.difficulty}`}
                      color={getDifficultyColor(action.difficulty)}
                      size="small;;"
                      sx={{ textTransform: 'capitalize', fontWeight: '500' }}
                    />
                    <Chip
                      label={`Priority: ${action.priority}`}
                      color={getPriorityColor(action.priority)}
                      size="small"
                      sx={{ textTransform: 'capitalize', fontWeight: '500' }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
export default ActionEngine;
