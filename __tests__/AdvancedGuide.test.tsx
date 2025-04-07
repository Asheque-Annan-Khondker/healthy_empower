import React from 'react';
import { render } from '@testing-library/react-native';
import AdvancedGuide from '../../../app/(drawer)/(guide)/AdvancedGuide';

jest.mock('@/components/screenTransition', () => {
  return ({ children }: any) => <>{children}</>; 
});

describe('AdvancedGuide', () => {
  it('renders the correct guide text', () => {
    const { getByText } = render(<AdvancedGuide />);
    expect(getByText('Guide for advanced')).toBeTruthy();
  });
});
