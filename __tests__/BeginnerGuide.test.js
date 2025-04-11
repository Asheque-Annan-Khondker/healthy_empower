import React from 'react';
import { render } from '@testing-library/react-native';
import BeginnerGuide from '../app/(drawer)/(guide)/BeginnerGuide';


jest.mock('@/components/screenTransition', () => {
  return ({ children }: any) => <>{children}</>; 
});

describe('BeginnerGuide', () => {
  it('renders the main guide title and description', () => {
    const { getAllByText } = render(<BeginnerGuide />);
    
    // Check for the header text
    expect(getAllByText(/Start-Up Guide/i).length).toBeGreaterThan(0);

    
  });
});
