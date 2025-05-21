import React from 'react';
import { Card as PaperCard } from 'react-native-paper';

// Wrapper component that fixes the Card issues by avoiding the problematic hooks
const Card = (props) => {
  // Filter out any props that might be triggering the useLatestCallback issue
  const { onLongPress, onPress, ...otherProps } = props;
  
  // Only add onPress/onLongPress if they're explicitly provided
  const pressProps = {};
  if (onPress) pressProps.onPress = onPress;
  if (onLongPress) pressProps.onLongPress = onLongPress;
  
  return <PaperCard {...otherProps} {...pressProps} />;
};

// Add all Card subcomponents to maintain the same API
Card.Title = PaperCard.Title;
Card.Content = PaperCard.Content;
Card.Actions = PaperCard.Actions;
Card.Cover = PaperCard.Cover;

// Export the wrapped component
export default Card;