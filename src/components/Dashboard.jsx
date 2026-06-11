import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Checkbox,
  TextField,
  IconButton,
  Button,
  LinearProgress,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ForestIcon from '@mui/icons-material/Forest';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useCarbon } from '../context/CarbonContext';
import { useLanguage } from '../context/LanguageContext';
import { getLeafRating } from '../utils/carbonCalculations';

export const Dashboard = () => {
  const {
    breakdown,
    actions,
    weeklyGoals,
    history,
    addWeeklyGoal,
    toggleWeeklyGoal,
    deleteWeeklyGoal
  } = useCarbon();

  const { t } = useLanguage();

  const [newGoalText, setNewGoalText] = useState('');
  const leafInfo = getLeafRating(breakdown.total);
  
  const showAccessibilityGuides = localStorage.getItem('eco_sr_hints') === 'true';

  const completedActions = actions.filter(a => a.completed).length;
  const totalActions = actions.length;
  const actionProgress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const completedGoals = weeklyGoals.filter(g => g.completed).length;
  const totalGoals = weeklyGoals.length;
  const goalProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const pieData = [
    { name: 'Transit', value: breakdown.transport, color: '#00BFA5' },
    { name: 'Diet', value: breakdown.food, color: '#4CAF50' },
    { name: 'Utilities', value: breakdown.utilities, color: '#FFB300' },
    { name: 'Shopping', value: breakdown.shopping, color: '#29B6F6' },
    { name: 'Waste', value: breakdown.waste, color: '#AB47BC' }
  ].filter(d => d.value > 0);

  const projectionData = [
    { name: 'Current', BAU: breakdown.total, Target: breakdown.total, EcoPath: breakdown.total },
    { name: '1 Month', BAU: breakdown.total, Target: Math.round(breakdown.total * 0.95), EcoPath: Math.round(breakdown.total * 0.88) },
    { name: '6 Month', BAU: Math.round(breakdown.total * 1.02), Target: Math.round(breakdown.total * 0.85), EcoPath: Math.round(breakdown.total * 0.70) },
    { name: '1 Year', BAU: Math.round(breakdown.total * 1.05), Target: Math.round(breakdown.total * 0.75), EcoPath: Math.round(breakdown.total * 0.50) }
  ];

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoalText.trim() === '') return;
    addWeeklyGoal(newGoalText);
    setNewGoalText('');
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {t('Sustainability Dashboard')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('Keep track of your carbon balance and evaluate ongoing eco objectives.')}
          </Typography>
        </Box>
        <Chip
          icon={<StarIcon style={{ color: '#FFB300' }} />}
          label={leafInfo.label}
          sx={{
            fontSize: '1rem',
            py: 2,
            px: 1.5,
            fontWeight: '600',
            backgroundColor: `${leafInfo.color}15`,
            borderColor: leafInfo.color,
            color: leafInfo.color,
            border: '1px solid'
          }}
        />
      </Box>

      {showAccessibilityGuides && (
        <Alert severity="info" sx={{ mb: 4 }} aria-live="polite">
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Screen Reader Graph Summaries:</Typography>
          <List size="small" sx={{ p: 0, m: 0 }}>
            <ListItem sx={{ py: 0.2 }}><ListItemText primary={`- Emission breakdown: Transit accounts for ${breakdown.transport} kg CO2, Diet accounts for ${breakdown.food} kg CO2, and utilities account for ${breakdown.utilities} kg CO2.`} /></ListItem>
            <ListItem sx={{ py: 0.2 }}><ListItemText primary={`- Prediction trajectories: If lifestyle factors remain unchanged, your yearly emissions are projected to rise to ${Math.round(breakdown.total * 1.05)} kg CO2 in 1 year. By pursuing actions, emissions could fall to ${Math.round(breakdown.total * 0.5)} kg CO2.`} /></ListItem>
          </List>
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Carbon Score */}
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t('Annual Footprint')}
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 1, color: leafInfo.color }}>
                {breakdown.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('kg CO2 / year equivalent')}
              </Typography>
            </CardContent>
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ForestIcon fontSize="small" sx={{ color: leafInfo.color }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: leafInfo.color }}>
                  {t('Ranked')}: {leafInfo.rating} / 5 {t('Leaves')}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Global Average Comparison */}
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t('vs Global Target')}
              </Typography>
              {breakdown.total <= 2000 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, color: '#2E7D32' }}>
                  <ArrowDownwardIcon />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    Safe
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, color: '#D32F2F' }}>
                  <ArrowUpwardIcon />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    +{Math.round((breakdown.total / 2000) * 100 - 100)}%
                  </Typography>
                </Box>
              )}
              <Typography variant="body2" color="text.secondary">
                {t('Relative to the ideal 2,000 kg target')}
              </Typography>
            </CardContent>
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {t('Global average')}: 4,700 kg/year
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Recommendations Progress */}
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t('Action Completion')}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
                {actionProgress}%
              </Typography>
              <Box sx={{ mt: 1.5 }}>
                <LinearProgress variant="determinate" value={actionProgress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {completedActions} {t('of')} {totalActions} {t('actions active')}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Custom Weekly Goal Progress */}
        <Grid xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                {t('Weekly Goal Score')}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
                {goalProgress}%
              </Typography>
              <Box sx={{ mt: 1.5 }}>
                <LinearProgress variant="determinate" value={goalProgress} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }} />
              </Box>
            </CardContent>
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                {completedGoals} {t('of')} {totalGoals} {t('commitments met')}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Breakdown Chart */}
        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('Emission Category Breakdown')}
              </Typography>
              <Box sx={{ height: 280, width: '100%', minHeight: 280 }} role="region" aria-label="Emission breakdown pie chart">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(val) => `${val.toLocaleString()} kg CO2`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Prediction Chart */}
        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('Sustainability Trajectory (1-Year Prediction)')}
              </Typography>
              <Box sx={{ height: 280, width: '100%', minHeight: 280 }} role="region" aria-label="Carbon emission projections chart">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'kg CO2', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip formatter={(val) => `${val.toLocaleString()} kg`} />
                    <Legend />
                    <Line type="monotone" dataKey="BAU" name="No Lifestyle Change" stroke="#D32F2F" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Target" name="Moderate Commitment" stroke="#FFB300" strokeWidth={2} />
                    <Line type="monotone" dataKey="EcoPath" name="Eco-Champion Path" stroke="#2E7D32" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Trend History */}
        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('Carbon Log (Historical Trend)')}
              </Typography>
              <Box sx={{ height: 280, width: '100%', minHeight: 280 }} role="region" aria-label="Footprint history tracking bar chart">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={history} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip formatter={(val) => `${val.toLocaleString()} kg CO2`} />
                    <Bar dataKey="score" name="Carbon Output" fill="#00BFA5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Goals Widget */}
        <Grid xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                {t('Weekly Commitments & Goals')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('Commit to simple weekly changes to gradually build clean daily habits.')}
              </Typography>

              <Box component="form" onSubmit={handleAddGoal} sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  placeholder="e.g. Switch to a smart power strip..."
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  size="small"
                  fullWidth
                  inputProps={{ 'aria-label': 'Create a new sustainability goal' }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  aria-label="Add new goal"
                  sx={{
                    borderRadius: '10px',
                    minWidth: 50,
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>

              <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', maxHeight: 190 }}>
                {weeklyGoals.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
                    {t('No custom goals set. Type a goal above and click Add!')}
                  </Typography>
                ) : (
                  weeklyGoals.map((goal) => (
                    <ListItem
                      key={goal.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label={`Delete goal: ${goal.title}`}
                          onClick={() => deleteWeeklyGoal(goal.id)}
                          color="error"
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      }
                      disablePadding
                      sx={{
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '10px',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemButton
                        onClick={() => toggleWeeklyGoal(goal.id)}
                        aria-label={`Toggle goal completion: ${goal.title}`}
                        sx={{ py: 0.5 }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={goal.completed}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': `goal-text-${goal.id}` }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={`goal-text-${goal.id}`}
                          primary={goal.title}
                          sx={{
                            textDecoration: goal.completed ? 'line-through' : 'none',
                            color: goal.completed ? 'text.secondary' : 'text.primary'
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Dashboard;
