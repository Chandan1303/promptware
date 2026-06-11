import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateCarbonFootprint, getRecommendedActions } from '../utils/carbonCalculations';

const DEFAULT_ANSWERS = {
  transportType: 'car',
  transportKm: 20,
  diet: 'mixed',
  electricity: 'medium',
  water: 'medium',
  shopping: 'medium',
  waste: 'medium'
};

const CarbonContext = createContext(undefined);

export const CarbonProvider = ({ children }) => {
  // Load initial answers or use defaults
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('ecoguide_answers');
    return saved ? JSON.parse(saved) : DEFAULT_ANSWERS;
  });

  // Load custom API key
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('ecoguide_api_key');
  });

  // Calculate carbon breakdown based on answers
  const [breakdown, setBreakdown] = useState(() => {
    return calculateCarbonFootprint(answers);
  });

  // Action items generated from answers
  const [actions, setActions] = useState(() => {
    const saved = localStorage.getItem('ecoguide_actions');
    if (saved) return JSON.parse(saved);
    return getRecommendedActions(answers);
  });

  // Custom goals
  const [weeklyGoals, setWeeklyGoals] = useState(() => {
    const saved = localStorage.getItem('ecoguide_goals');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', title: 'Bike to the grocery store', completed: false, targetDate: new Date().toLocaleDateString() },
      { id: '2', title: 'Buy only zero-waste packaged snacks', completed: false, targetDate: new Date().toLocaleDateString() },
      { id: '3', title: 'Turn off power strips before bed', completed: true, targetDate: new Date().toLocaleDateString() }
    ];
  });

  // Historical carbon footprint tracking
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('ecoguide_history');
    if (saved) return JSON.parse(saved);
    
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        score: Math.round(breakdown.total + (Math.random() * 400 - 200))
      });
    }
    return data;
  });

  // Update calculations and actions whenever answers change
  useEffect(() => {
    const newBreakdown = calculateCarbonFootprint(answers);
    setBreakdown(newBreakdown);
    localStorage.setItem('ecoguide_answers', JSON.stringify(answers));

    setHistory(prev => {
      const now = new Date().toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const index = prev.findIndex(item => item.date === now);
      let updated = [...prev];
      if (index >= 0) {
        updated[index] = { date: now, score: newBreakdown.total };
      } else {
        updated.push({ date: now, score: newBreakdown.total });
        if (updated.length > 12) updated.shift();
      }
      localStorage.setItem('ecoguide_history', JSON.stringify(updated));
      return updated;
    });
  }, [answers]);

  const updateAnswers = (newAnswers) => {
    setAnswers(newAnswers);
    const freshActions = getRecommendedActions(newAnswers);
    setActions(freshActions);
    localStorage.setItem('ecoguide_actions', JSON.stringify(freshActions));
  };

  const saveCustomApiKey = (key) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('ecoguide_api_key', key);
    } else {
      localStorage.removeItem('ecoguide_api_key');
    }
  };

  const toggleAction = (actionId) => {
    const updated = actions.map(act =>
      act.id === actionId ? { ...act, completed: !act.completed } : act
    );
    setActions(updated);
    localStorage.setItem('ecoguide_actions', JSON.stringify(updated));
  };

  const addWeeklyGoal = (title, targetDate) => {
    const newGoal = {
      id: Date.now().toString(),
      title,
      completed: false,
      targetDate: targetDate || new Date().toLocaleDateString()
    };
    const updated = [...weeklyGoals, newGoal];
    setWeeklyGoals(updated);
    localStorage.setItem('ecoguide_goals', JSON.stringify(updated));
  };

  const toggleWeeklyGoal = (goalId) => {
    const updated = weeklyGoals.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    setWeeklyGoals(updated);
    localStorage.setItem('ecoguide_goals', JSON.stringify(updated));
  };

  const deleteWeeklyGoal = (goalId) => {
    const updated = weeklyGoals.filter(g => g.id !== goalId);
    setWeeklyGoals(updated);
    localStorage.setItem('ecoguide_goals', JSON.stringify(updated));
  };

  const resetData = () => {
    setAnswers(DEFAULT_ANSWERS);
    const freshActions = getRecommendedActions(DEFAULT_ANSWERS);
    setActions(freshActions);
    localStorage.removeItem('ecoguide_answers');
    localStorage.removeItem('ecoguide_actions');
    localStorage.removeItem('ecoguide_goals');
    localStorage.removeItem('ecoguide_history');
    setWeeklyGoals([
      { id: '1', title: 'Bike to the grocery store', completed: false, targetDate: new Date().toLocaleDateString() },
      { id: '2', title: 'Buy only zero-waste packaged snacks', completed: false, targetDate: new Date().toLocaleDateString() }
    ]);
    const baseBreakdown = calculateCarbonFootprint(DEFAULT_ANSWERS);
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        score: Math.round(baseBreakdown.total + (Math.random() * 400 - 200))
      });
    }
    setHistory(data);
  };

  return (
    <CarbonContext.Provider
      value={{
        answers,
        breakdown,
        actions,
        weeklyGoals,
        history,
        customApiKey,
        saveCustomApiKey,
        updateAnswers,
        toggleAction,
        addWeeklyGoal,
        toggleWeeklyGoal,
        deleteWeeklyGoal,
        resetData
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error('useCarbon must be used within a CarbonProvider');
  }
  return context;
};
