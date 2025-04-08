import React from 'react';
import { render } from '@testing-library/react-native';
import IntermediateGuide from '../app/(drawer)/(guide)/IntermediateGuide';

jest.mock('@/components/screenTransition', () => {
  return ({ children }: any) => <>{children}</>; 
});

describe('IntermediateGuide', () => {
  it('renders the correct guide text', () => {
    const { getByText } = render(<IntermediateGuide />);
    expect(getByText('Guide for intermediates')).toBeTruthy();
  });
});
