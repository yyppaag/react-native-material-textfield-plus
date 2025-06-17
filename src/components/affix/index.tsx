import React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';

import styles from './styles';

interface AffixProps {
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  color: string;
  fontSize: number;
  type: 'prefix' | 'suffix';
  labelAnimation: Animated.Value;
  children?: React.ReactNode | React.ReactNode[];
}

const Affix: React.FC<AffixProps> = ({
  labelAnimation,
  style,
  children,
  type,
  fontSize,
  color,
  numberOfLines = 1, // Default prop
}) => {
  const containerStyle: Animated.AnimatedProps<TextStyle> = {
    height: fontSize * 1.5,
    opacity: labelAnimation,
  };

  const textStyle: Animated.AnimatedProps<TextStyle> = {
    includeFontPadding: false,
    textAlignVertical: 'top',
    fontSize,
    color,
    // numberOfLines is a direct prop for Text component
  };

  switch (type) {
    case 'prefix':
      containerStyle.paddingRight = 8;
      textStyle.textAlign = 'left';
      break;

    case 'suffix':
      containerStyle.paddingLeft = 8;
      textStyle.textAlign = 'right';
      break;
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text style={[style, textStyle]} numberOfLines={numberOfLines}>
        {children}
      </Animated.Text>
    </Animated.View>
  );
};

Affix.defaultProps = {
  numberOfLines: 1,
};

export default Affix;
