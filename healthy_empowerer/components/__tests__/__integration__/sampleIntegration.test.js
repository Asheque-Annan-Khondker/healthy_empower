//import React from 'react';
import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

test('renders a simple component', () => {
  const { getByText } = render(<Text>Hello World</Text>);
  expect(getByText('Hello World')).toBeTruthy();
});