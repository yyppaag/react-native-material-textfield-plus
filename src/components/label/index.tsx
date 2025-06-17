import React, { useMemo } from 'react';
import { Animated, StyleProp, TextStyle, TextProps, NativeSyntheticEvent, TextLayoutEventData } from 'react-native';

import styles from './styles';

export interface LabelOffset {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface LabelProps extends TextProps {
  numberOfLines?: number;
  disabled?: boolean;
  restricted?: boolean;
  fontSize: number;
  activeFontSize: number;
  baseColor: string;
  tintColor: string;
  errorColor: string;
  focusAnimation: Animated.Value;
  labelAnimation: Animated.Value;
  contentInset: {
    label: number;
  };
  offset: LabelOffset;
  style?: StyleProp<TextStyle>;
  label?: string;
  labelColor?: string;
  // Updated to use the specific event type from react-native
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
}

const Label: React.FC<LabelProps> = ({
  label,
  offset,
  disabled = Label.defaultProps.disabled, // Apply default directly
  restricted = Label.defaultProps.restricted, // Apply default directly
  fontSize,
  activeFontSize,
  contentInset,
  errorColor,
  baseColor,
  tintColor,
  style,
  focusAnimation,
  labelAnimation,
  labelColor,
  numberOfLines = Label.defaultProps.numberOfLines, // Apply default directly
  ...restProps // Captures other TextProps like testID, accessibilityLabel, onTextLayout
}) => {
  if (label == null) {
    return null;
  }

  const color = useMemo(() => {
    return disabled
      ? baseColor
      : restricted
      ? errorColor
      : focusAnimation.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [errorColor, baseColor, tintColor],
        });
  }, [disabled, restricted, baseColor, errorColor, tintColor, focusAnimation]);

  const textStyle = useMemo<StyleProp<TextStyle>>(() => ({
    lineHeight: fontSize,
    fontSize,
    color: labelColor || color,
  }), [fontSize, labelColor, color]);

  const containerStyle = useMemo(() => {
    // Make a mutable copy for y0 modification
    const currentOffset = { ...offset };
    currentOffset.y0 += activeFontSize;
    currentOffset.y0 += contentInset.label;
    currentOffset.y0 += fontSize * 0.25;

    return {
      transform: [
        {
          scale: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, activeFontSize / fontSize],
          }),
        },
        {
          translateY: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [currentOffset.y0, currentOffset.y1],
          }),
        },
        {
          translateX: labelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [currentOffset.x0, currentOffset.x1],
          }),
        },
      ],
    };
  }, [offset, activeFontSize, contentInset.label, fontSize, labelAnimation]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text
        style={[styles.text, style, textStyle]}
        numberOfLines={numberOfLines}
        {...restProps} // Pass down other props including onTextLayout
      >
        {label}
      </Animated.Text>
    </Animated.View>
  );
};

Label.defaultProps = {
  numberOfLines: 1,
  disabled: false,
  restricted: false,
};

export default Label;
