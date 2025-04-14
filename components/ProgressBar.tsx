import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  progress: number; // choose 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
};

const ProgressBar = ({
  progress,
  height = 10,
  backgroundColor = '#e0e0e0',
  progressColor = '#5acdff',
}: Props) => {
  const progressWidth = Math.max(0, Math.min(progress, 100)); // clamp between 0-100

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${progressWidth}%`,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;
