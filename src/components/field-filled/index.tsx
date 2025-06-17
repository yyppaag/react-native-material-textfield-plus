import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import TextField, { FieldProps, ContentInset, LabelOffset } from '../field'; // Import TextField and its props
import styles from './styles';

// Define the specific values for FilledTextField
const filledContentInset: ContentInset = {
  ...(TextField as any).contentInset, // Access default static prop from TextField
  top: 8,
  left: 12,
  right: 12,
};

const filledLabelOffset: LabelOffset = {
  ...(TextField as any).labelOffset, // Access default static prop from TextField
  y0: -10,
  y1: -2,
};

const filledInputContainerStyle: StyleProp<ViewStyle> = [
  (TextField as any).inputContainerStyle, // Access default static prop from TextField
  styles.inputContainer,
];

const FilledTextField: React.FC<FieldProps> = (props) => {
  // Pass the specific props to the base TextField component
  return (
    <TextField
      {...props} // Spread original props
      contentInset={filledContentInset}
      labelOffset={filledLabelOffset}
      inputContainerStyle={filledInputContainerStyle}
      // any other FilledTextField specific props or overrides can be added here
    />
  );
};

// If FilledTextField needs its own defaultProps that differ from TextField, define them here.
// Otherwise, TextField's defaultProps will apply.
// FilledTextField.defaultProps = { ... };


export default FilledTextField;
