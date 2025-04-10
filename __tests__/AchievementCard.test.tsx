import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AchievementCard from '../components/achievements//AchievementCard';

describe('AchievementCard', () => {
  const achievement = {
    title: 'Achievement 1',
    description: 'Some description',
    // other fields if required
  };

  it('renders the achievement title', () => {
    const { getByText } = render(
      <AchievementCard achievement={achievement} />
    );

    expect(getByText('Achievement 1')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <AchievementCard achievement={achievement} onPress={onPressMock} />
    );

    fireEvent.press(getByText('Achievement 1'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
