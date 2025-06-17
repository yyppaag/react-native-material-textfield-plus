import React, { useMemo } from 'react';
import { View, Animated, StyleProp, ViewStyle } from 'react-native';

import styles from './styles';

type LineType = 'solid' | 'dotted' | 'dashed' | 'none';

export interface LineProps {
  lineType?: LineType;
  disabledLineType?: LineType;
  disabled?: boolean;
  restricted?: boolean;
  tintColor: string;
  baseColor: string;
  errorColor: string;
  lineColor?: string;
  lineTintColor?: string;
  disabledLineColor?: string;
  lineWidth: number;
  activeLineWidth: number;
  disabledLineWidth: number;
  focusAnimation: Animated.Value;
  labelAnimation?: Animated.Value; // Kept as per existing interface
  contentInset?: { label: number; input: number }; // Kept as per existing interface
  lineContainer?: StyleProp<ViewStyle>;
}

const Line: React.FC<LineProps> = ({
  lineType = Line.defaultProps.lineType,
  disabledLineType = Line.defaultProps.disabledLineType,
  disabled = Line.defaultProps.disabled,
  restricted = Line.defaultProps.restricted,
  tintColor,
  baseColor,
  errorColor,
  lineColor,
  lineTintColor,
  disabledLineColor,
  lineWidth,
  activeLineWidth,
  disabledLineWidth,
  focusAnimation,
  // labelAnimation, // Not used in this component's logic
  // contentInset, // Not used in this component's logic
  lineContainer,
}) => {
  const maxLineWidth = useMemo(() => {
    return Math.max(lineWidth, activeLineWidth, disabledLineWidth, 1);
  }, [lineWidth, activeLineWidth, disabledLineWidth]);

  const borderProps = useMemo(() => {
    const selectedLineColor = lineColor || baseColor;
    const selectedLineTintColor = lineTintColor || tintColor;
    const selectedDisabledLineColor = disabledLineColor || baseColor;

    if (disabled) {
      return {
        borderColor: selectedDisabledLineColor,
        borderWidth: disabledLineWidth,
      };
    }

    if (restricted) {
      return {
        borderColor: errorColor,
        borderWidth: activeLineWidth,
      };
    }

    return {
      borderColor: focusAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [errorColor, selectedLineColor, selectedLineTintColor],
      }),
      borderWidth: focusAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [activeLineWidth, lineWidth, activeLineWidth],
      }),
    };
  }, [
    disabled,
    restricted,
    lineWidth,
    activeLineWidth,
    disabledLineWidth,
    baseColor,
    tintColor,
    errorColor,
    lineColor,
    disabledLineColor,
    lineTintColor,
    focusAnimation,
  ]);

  const currentBorderStyle = disabled ? disabledLineType : lineType;

  if (currentBorderStyle === 'none') {
    return null;
  }

  const [top, right, left] = Array.from(new Array(3), () => -1.5 * maxLineWidth);

  const lineStyle: Animated.AnimatedProps<ViewStyle> = {
    ...borderProps,
    borderStyle: currentBorderStyle,
    top,
    right,
    left,
  };

  return (
    <View style={[styles.container, lineContainer]} pointerEvents='none'>
      <Animated.View style={[styles.line, lineStyle]} />
    </View>
  );
};

Line.defaultProps = {
  lineType: 'solid' as LineType,
  disabledLineType: 'dotted' as LineType,
  disabled: false,
  restricted: false,
};

export default Line;
