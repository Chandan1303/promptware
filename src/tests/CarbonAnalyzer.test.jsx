import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CarbonAnalyzer from '../components/CarbonAnalyzer';
import { CarbonProvider } from '../context/CarbonContext';
import { AuthProvider } from '../context/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <CarbonProvider>
        {component}
      </CarbonProvider>
    </AuthProvider>
  );
};

describe('CarbonAnalyzer Form Component', () => {
  test('should render first step of the form wizard', () => {
    renderWithProviders(<CarbonAnalyzer />);
    
    expect(screen.getByText('Smart Carbon Analyzer')).toBeInTheDocument();
    expect(screen.getByText('Transportation Footprint')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  test('should navigate steps when Next is clicked', () => {
    renderWithProviders(<CarbonAnalyzer />);
    
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(screen.getAllByText('Dietary Habits')[0]).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(screen.getAllByText('Home Utilities')[0]).toBeInTheDocument();
  });

  test('should allow entering transit distance', () => {
    renderWithProviders(<CarbonAnalyzer />);
    
    const input = screen.getByLabelText('Daily km');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: '45' } });
    expect(input).toHaveValue(45);
  });
});
