import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Dashboard from '../components/Dashboard';
import { CarbonProvider } from '../context/CarbonContext';
import { AuthProvider as CustomAuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';

const renderWithProviders = (component) => {
  return render(
    <LanguageProvider>
      <CustomAuthProvider>
        <CarbonProvider>
          {component}
        </CarbonProvider>
      </CustomAuthProvider>
    </LanguageProvider>
  );
};

describe('Dashboard Widget Component', () => {
  test('should render scorecards and headings correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Sustainability Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Annual Footprint')).toBeInTheDocument();
    expect(screen.getByText('vs Global Target')).toBeInTheDocument();
    expect(screen.getByText('Action Completion')).toBeInTheDocument();
    expect(screen.getByText('Weekly Goal Score')).toBeInTheDocument();
  });

  test('should allow user to create new weekly goals', () => {
    renderWithProviders(<Dashboard />);

    const input = screen.getByPlaceholderText('e.g. Switch to a smart power strip...');
    const addBtn = screen.getByLabelText('Add new goal');

    expect(input).toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Compost kitchen waste' } });
    fireEvent.click(addBtn);

    expect(screen.getByText('Compost kitchen waste')).toBeInTheDocument();
  });
});
