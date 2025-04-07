import React from 'react';
import { render } from '@testing-library/react-native';
import ExpertGuide from '../app/(drawer)/(guide)/ExpertGuide';

jest.mock('@/components/screenTransition', () => {
  return ({ children }: any) => <>{children}</>; 
});

describe('ExpertGuide', () => {
  it('renders the correct guide text', () => {
    const { getByText } = render(<ExpertGuide />);
    expect(getByText('Guide for experts')).toBeTruthy();
  });
});
