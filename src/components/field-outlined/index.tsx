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

  const {
    fontSize = defaultProps.fontSize, // fontSize from TextField's default if not in props
    labelFontSize = defaultProps.labelFontSize, // labelFontSize from TextField's default if not in props
    ...restProps
  } = props;

  const onTextLayout = useCallback((event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = event.nativeEvent;
    // Ensure fontSize and labelFontSize are available, falling back to TextField's defaults if necessary
    const currentFontSize = props.fontSize || defaultProps.fontSize;
    const currentLabelFontSize = props.labelFontSize || defaultProps.labelFontSize;

    if (currentFontSize && currentLabelFontSize && lines.length > 0) {
      const scale = currentLabelFontSize / currentFontSize;
      labelWidth.setValue(lines[0].width * scale);
    }
  }, [props.fontSize, props.labelFontSize, labelWidth]);

  // Props that will be passed to the underlying TextField component
  const textFieldProps: FieldProps = {
    ...outlinedDefaultProps, // Apply OutlinedTextField's default props
    ...restProps, // Spread the incoming props
    contentInset: outlinedContentInset,
    labelOffset: outlinedLabelOffset,
    // Pass onTextLayout to be used by TextField's Label component
    // TextField needs to be adapted to pass this to its Label's props
    onTextLayoutForLabel: onTextLayout,
    // Pass the Outline component to be used for rendering the line
    // TextField needs to be adapted to accept and use this component
    LineComponent: (lineProps) => (
      <Outline
        {...lineProps} // Props passed by TextField to its line component
        labelWidth={labelWidth}
        // Ensure Outline receives all necessary props.
        // These should align with what LineProps expects and what TextField provides.
      />
    ),
  };

  return <TextField {...textFieldProps} />;
};

// Re-attach defaultProps from TextField if they are not overridden,
// or merge them. For simplicity, TextField handles its own defaults.
// FieldOutlined specific defaults are handled in outlinedDefaultProps.

export default FieldOutlined;
