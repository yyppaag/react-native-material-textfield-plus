import React from 'react';
import { Text, StyleProp, TextStyle, TextProps } from 'react-native';

import styles from './styles';

interface BottomRightLabelProps extends TextProps {
  title: string;
  baseColor: string; // This prop seems unused in the current render logic but is in the interface.
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  rightTextStyle?: StyleProp<TextStyle>;
  // testID and accessibilityLabel are included in TextProps
}

const BottomRightLabel: React.FC<BottomRightLabelProps> = ({
  title,
  onPress,
  rightTextStyle,
  testID,
  accessibilityLabel,
  // baseColor is destructured but not used. Kept for interface consistency.
  baseColor,
  ...props // Spread other TextProps
}) => {
  if (!title) {
    return null;
  }

  return (
    <Text
      onPress={onPress}
      style={[styles.text, rightTextStyle]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      {...props} // Apply remaining TextProps
    >
      {title}
    </Text>
  );
};

export default BottomRightLabel;
