import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, TextStyle, TextProps } from 'react-native';

import styles from './styles';

interface HelperProps extends TextProps { // Inherit TextProps for testID, accessibilityLabel etc.
  title?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  baseColor: string;
  errorColor: string;
  focusAnimation: Animated.Value;
  // testID and accessibilityLabel are part of TextProps
}

const Helper: React.FC<HelperProps> = ({
  title,
  error,
  disabled,
  style,
  baseColor,
  errorColor,
  focusAnimation,
  ...restProps // Pass other TextProps like testID, accessibilityLabel
}) => {
  const [errored, setErrored] = useState<boolean>(!!error);
  const animationValueRef = useRef<number>(0); // To store the last animation value

  // Update 'errored' state if the error prop changes
  useEffect(() => {
    setErrored(!!error);
  }, [error]);

  const opacity = useMemo(() => {
    return focusAnimation.interpolate({
      inputRange: [-1, -0.5, 0],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });
  }, [focusAnimation]);

  useEffect(() => {
    const onAnimation = ({ value }: { value: number }) => {
      if (animationValueRef.current > -0.5 && value <= -0.5) {
        setErrored(true);
      }
      if (animationValueRef.current <= -0.5 && value > -0.5) {
        // Only set to false if there isn't an external error prop forcing it to be true
        if (!error) {
          setErrored(false);
        }
      }
      animationValueRef.current = value;
    };

    const listenerId = focusAnimation.addListener(onAnimation);

    // Set initial animationValueRef based on current focusAnimation value
    // This requires a way to get the current value, which Animated.Value does not directly expose easily for initial state.
    // A common workaround is to assume initial value or trigger an update.
    // For simplicity, we'll assume it starts at a neutral state (e.g., 0) or that an initial animation call will set it.
    // If focusAnimation could be at -1 initially, this might need more complex handling for animationValueRef.current.
    // One way is to use a private method of Animated.Value `_value` but it's not recommended.
    // Let's assume the initial value of focusAnimation is what animationValueRef should be.
    // However, direct access to _value is a hack. A better way is to manage this via an initial animation if possible.
    // For this refactor, we'll keep it simple. The logic for errored state is primarily driven by prop `error` and animation transitions.

    return () => {
      focusAnimation.removeListener(listenerId);
    };
  }, [focusAnimation, error]); // Add error to dependencies, so if error prop changes, logic re-evaluates

  const currentText = errored ? error : title;

  if (currentText == null) {
    return null;
  }

  const textStyle: StyleProp<TextStyle> = {
    opacity,
    color: !disabled && errored ? errorColor : baseColor,
  };

  return (
    <Animated.Text style={[styles.text, style, textStyle]} {...restProps}>
      {currentText}
    </Animated.Text>
  );
};

export default Helper;
