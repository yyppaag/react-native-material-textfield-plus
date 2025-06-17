import React, { Fragment, useMemo } from 'react';
import { View, Animated, I18nManager, StyleProp, ViewStyle } from 'react-native';

import styles, { borderRadius } from './styles';

type LineType = 'solid' | 'none';

// Interface for props passed to the Outline component
export interface OutlineProps {
  lineType?: LineType;
  disabled?: boolean;
  restricted?: boolean;
  tintColor: string;
  baseColor: string;
  errorColor: string;
  lineWidth: number;
  activeLineWidth: number;
  disabledLineWidth: number;
  focusAnimation: Animated.Value;
  labelAnimation: Animated.Value;
  labelWidth: Animated.Value;
  contentInset: {
    left: number;
    right: number;
  };
}

// Interface for the border properties object returned by borderProps logic
interface BorderProps {
  borderColor: string | Animated.AnimatedInterpolation;
  borderWidth: number | Animated.AnimatedInterpolation;
  borderStyle?: LineType; // borderStyle is part of the line style, not just border props
}

const Outline: React.FC<OutlineProps> = ({
  lineType = Outline.defaultProps.lineType,
  disabled = Outline.defaultProps.disabled,
  restricted = Outline.defaultProps.restricted,
  tintColor,
  baseColor,
  errorColor,
  lineWidth,
  activeLineWidth,
  disabledLineWidth,
  focusAnimation,
  labelAnimation,
  labelWidth,
  contentInset,
}) => {
  const borderProps = useMemo<BorderProps>(() => {
    if (disabled) {
      return {
        borderColor: baseColor,
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
        outputRange: [errorColor, baseColor, tintColor],
      }),
      borderWidth: focusAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [activeLineWidth, lineWidth, activeLineWidth],
      }),
      // borderStyle is applied directly in lineStyle, not returned here
    };
  }, [
    disabled,
    restricted,
    baseColor,
    disabledLineWidth,
    errorColor,
    activeLineWidth,
    focusAnimation,
    tintColor,
    lineWidth,
  ]);

  if (lineType === 'none') {
    return null;
  }

  const labelOffset = 2 * (contentInset.left - 2 * borderRadius);
  // lineOffset can be memoized if labelWidth or labelOffset calculation is complex,
  // but Animated.add itself is lightweight.
  const lineOffset = Animated.add(labelWidth, labelOffset);

  const topLineContainerStyle = useMemo<Animated.AnimatedProps<ViewStyle>>(() => ({
    transform: [
      {
        scaleX: I18nManager.isRTL ? -1 : 1,
      },
      {
        translateX: Animated.multiply(labelAnimation, lineOffset),
      },
    ],
  }), [labelAnimation, lineOffset]);

  const leftContainerStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    width: contentInset.left - borderRadius,
  }), [contentInset.left]);

  const rightContainerStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    width: contentInset.right - borderRadius,
  }), [contentInset.right]);

  const topContainerStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    left: contentInset.left - borderRadius, // Directly use values if they are simple numbers
    right: contentInset.right - borderRadius,
  }), [contentInset.left, contentInset.right]);

  // lineStyle should include borderStyle from props
  const lineStyle = useMemo<Animated.AnimatedProps<ViewStyle>>(() => ({
    ...borderProps,
    borderStyle: lineType, // Use lineType from props for borderStyle
  }),[borderProps, lineType]);

  return (
    <Fragment>
      <View style={[styles.topContainer, topContainerStyle]} pointerEvents='none'>
        <Animated.View style={[styles.topLineContainer, topLineContainerStyle]}>
          <Animated.View style={[styles.borderTop, lineStyle]} />
        </Animated.View>
      </View>

      <View style={[styles.rightContainer, rightContainerStyle]} pointerEvents='none'>
        <Animated.View style={[styles.borderRight, lineStyle]} />
      </View>

      <View style={styles.bottomContainer} pointerEvents='none'>
        <Animated.View style={[styles.borderBottom, lineStyle]} />
      </View>

      <View style={[styles.leftContainer, leftContainerStyle]} pointerEvents='none'>
        <Animated.View style={[styles.borderLeft, lineStyle]} />
      </View>
    </Fragment>
  );
};

Outline.defaultProps = {
  lineType: 'solid' as LineType,
  disabled: false,
  restricted: false,
};

export default Outline;
