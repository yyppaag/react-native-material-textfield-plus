import React from 'react';
import { Text, StyleProp, TextStyle, TextProps } from 'react-native';

import styles from './styles';

interface CounterProps extends TextProps {
  count: number;
  limit?: number;
  baseColor: string;
  errorColor: string;
  style?: StyleProp<TextStyle>;
}

const Counter: React.FC<CounterProps> = ({
  count,
  limit,
  baseColor,
  errorColor,
  style,
  ...props
}) => {
  if (!limit) {
    return null;
  }

  const textStyle: StyleProp<TextStyle> = {
    color: count > limit ? errorColor : baseColor,
  };

  return (
    <Text style={[styles.text, style, textStyle]} {...props}>
      {count} / {limit}
    </Text>
  );
};

export default Counter;
