import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders correctly with styling props', () => {
    const tree = renderer.create(<ThemedText style={{ fontSize: 20, color: 'blue' }}>Styled text</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
 it('renders correctly with nested elements', () => {
    const tree = renderer.create(
      <ThemedText>
        <span>Nested Element</span>
      </ThemedText>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  }); 
 it('renders correctly with different text', () => {
    const tree = renderer.create(<ThemedText>Another test case</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  }); 
 
  