import React, { useRef, useCallback } from 'react';
import { Animated, StyleSheet, NativeSyntheticEvent, TextLayoutEventData, ViewProps } from 'react-native';

import TextField, { FieldProps, ContentInset, LabelOffset } from '../field';
import Outline from '../outline'; // Assuming Outline is a functional component

// Specific values for OutlinedTextField from its static properties
const outlinedContentInset: ContentInset = {
  ...(TextField as any).contentInset, // Access default from base TextField for fallback
  input: 16,
  top: 0,
  left: 12,
  right: 12,
};

const outlinedLabelOffset: LabelOffset = {
  ...(TextField as any).labelOffset, // Access default from base TextField for fallback
  y0: 0,
  y1: -10,
};

// Default props specific to OutlinedTextField
const outlinedDefaultProps: Partial<FieldProps> = {
  lineWidth: 1,
  disabledLineWidth: StyleSheet.hairlineWidth,
};

const FieldOutlined: React.FC<FieldProps> = (props) => {
  const labelWidth = useRef(new Animated.Value(0)).current;

  // Directly use props for onTextLayout, TextField's defaults will apply if these are undefined
  const onTextLayout = useCallback((event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = event.nativeEvent;
    const currentFontSize = props.fontSize || defaultProps.fontSize; // from Field's defaultProps
    const currentLabelFontSize = props.labelFontSize || defaultProps.labelFontSize; // from Field's defaultProps

    if (currentFontSize && currentLabelFontSize && lines.length > 0) {
      const scale = currentLabelFontSize / currentFontSize;
      labelWidth.setValue(lines[0].width * scale);
    }
  }, [props.fontSize, props.labelFontSize, labelWidth]);

  // Props that will be passed to the underlying TextField component
  const textFieldProps: FieldProps = {
    ...outlinedDefaultProps, // Apply OutlinedTextField's own default props first
    ...props, // Then spread all incoming props (including fontSize, labelFontSize if provided)
    contentInset: outlinedContentInset, // Override contentInset
    labelOffset: outlinedLabelOffset,   // Override labelOffset
    onTextLayoutForLabel: onTextLayout,
    LineComponent: (lineProps) => (
      <Outline
        {...lineProps}
        labelWidth={labelWidth}
        // Pass necessary props from FieldOutlined's props to Outline if not covered by lineProps
        // For example, if Outline needs specific props not in LineProps, they must be passed here.
        // However, `lineProps` should ideally contain all that Outline needs if it's a valid LineProps substitute.
      />
    ),
  };

  return <TextField {...textFieldProps} />;
};

export default FieldOutlined;
