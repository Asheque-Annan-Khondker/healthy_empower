import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestSquare from '../anime_square';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.withSpring = jest.fn(); // Mock withSpring
  return Reanimated;
});

describe('TestSquare Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TestSquare />);
    const button = getByText('Click Here');
    expect(button).toBeTruthy(); // Ensure the button renders
  });

  it('calls withSpring when the button is pressed', () => {
    const { getByText } = render(<TestSquare />);

    // Mock the implementation of withSpring
    const withSpringMock = require('react-native-reanimated').withSpring;

    // Find the button
    const button = getByText('Click Here');

    // Simulate a button press
    fireEvent.press(button);

    // Verify that withSpring is called with a number
    expect(withSpringMock).toHaveBeenCalledWith(expect.any(Number));
  });
});