import React from 'react';
import { render } from '@testing-library/react-native';
import BeginnerGuide from '../app/(drawer)/(guide)/BeginnerGuide';

jest.mock('@/components/screenTransition', () => {
  return ({ children }: any) => <>{children}</>; 
});

describe('BeginnerGuide', () => {
  it('renders the correct guide text', () => {
    const { getByText } = render(<BeginnerGuide />);
    expect(getByText('Guide for noobs')).toBeTruthy();
  });
});
