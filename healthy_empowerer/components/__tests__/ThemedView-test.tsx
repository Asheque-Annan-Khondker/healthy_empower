import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedView } from '../ThemedView';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#ffffff'), // Mocked color as white
}));

describe('ThemedView Component', () => {
  it('renders correctly with light and dark colors', () => {
    const tree = renderer
      .create(
        <ThemedView lightColor="#f0f0f0" darkColor="#333333">
          <></>
        </ThemedView>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('applies custom styles correctly', () => {
    const tree = renderer
      .create(
        <ThemedView lightColor="#f0f0f0" darkColor="#333333" style={{ padding: 10 }}>
          <></>
        </ThemedView>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});