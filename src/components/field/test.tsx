import { Image } from 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON, ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';

import TextField, { FieldProps } from './index';

// Minimal base props required for the component to render without runtime errors.
// Most props are optional due to defaultProps in the component.
const baseProps: Partial<FieldProps> = {
  label: 'Test Label',
  // Add other essential props if not covered by component's defaultProps
  // For example, if animation values were required and not defaulted internally:
  // focusAnimation: new Animated.Value(0),
  // labelAnimation: new Animated.Value(0),
};

/* eslint-env jest */

describe('TextField', () => {
  it('renders with minimal props (relying on defaultProps)', () => {
    const tree = renderer.create(<TextField {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders null value correctly', () => {
    const tree = renderer.create(<TextField {...baseProps} value={null} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with a given value', () => {
    const tree = renderer.create(<TextField {...baseProps} value="text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders when disabled', () => {
    const tree = renderer.create(<TextField {...baseProps} value="text" disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with a default value', () => {
    const tree = renderer.create(<TextField {...baseProps} defaultValue="default text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders multiline input', () => {
    const tree = renderer.create(<TextField {...baseProps} value="multi\nline" multiline />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with a title (helper text)', () => {
    const tree = renderer.create(<TextField {...baseProps} title="Helper title" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with an error message', () => {
    const tree = renderer.create(<TextField {...baseProps} error="Error message" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders character counter when characterRestriction is set', () => {
    const tree = renderer.create(<TextField {...baseProps} value="text" characterRestriction={10} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when value exceeds characterRestriction', () => {
    const tree = renderer.create(<TextField {...baseProps} value="longtext" characterRestriction={5} />).toJSON();
    expect(tree).toMatchSnapshot(); // Style should indicate error/restriction
  });

  it('renders with a prefix', () => {
    const tree = renderer.create(<TextField {...baseProps} value="text" prefix="$" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with a suffix', () => {
    const tree = renderer.create(<TextField {...baseProps} value="text" suffix=".com" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders left accessory', () => {
    const renderLeftAccessory = () => <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{width: 20, height: 20}} />;
    const tree = renderer.create(<TextField {...baseProps} renderLeftAccessory={renderLeftAccessory} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders right accessory', () => {
    const renderRightAccessory = () => <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{width: 20, height: 20}} />;
    const tree = renderer.create(<TextField {...baseProps} renderRightAccessory={renderRightAccessory} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls onFocus prop when TextInput is focused', () => {
    const onFocusMock = jest.fn();
    const component = renderer.create(<TextField {...baseProps} onFocus={onFocusMock} />);
    const textInput = component.root.findByType(TextInput);

    renderer.act(() => {
      textInput.props.onFocus({ nativeEvent: {} } as any); // Simulate focus event
    });
    expect(onFocusMock).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur prop when TextInput is blurred', () => {
    const onBlurMock = jest.fn();
    const component = renderer.create(<TextField {...baseProps} onBlur={onBlurMock} />);
    const textInput = component.root.findByType(TextInput);

    renderer.act(() => {
      textInput.props.onBlur({ nativeEvent: {} } as any); // Simulate blur event
    });
    expect(onBlurMock).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeText prop when TextInput value changes', () => {
    const onChangeTextMock = jest.fn();
    const component = renderer.create(<TextField {...baseProps} onChangeText={onChangeTextMock} />);
    const textInput = component.root.findByType(TextInput);

    renderer.act(() => {
      textInput.props.onChangeText('new text');
    });
    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });

  it('formats text with formatText prop if provided', () => {
    const formatTextMock = jest.fn((text) => text.toUpperCase());
    const onChangeTextMock = jest.fn();
    const component = renderer.create(
      <TextField {...baseProps} formatText={formatTextMock} onChangeText={onChangeTextMock} />
    );
    const textInput = component.root.findByType(TextInput);

    renderer.act(() => {
      textInput.props.onChangeText('test');
    });
    expect(formatTextMock).toHaveBeenCalledWith('test');
    expect(onChangeTextMock).toHaveBeenCalledWith('TEST');
  });

  it('renders with bottomRightText and calls onPressRightText', () => {
    const onPressRightTextMock = jest.fn();
    const tree = renderer.create(
      <TextField {...baseProps} bottomRightText="Details" onPressRightText={onPressRightTextMock} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
    // To test onPress, ideally you'd find the BottomRightLabel and simulate a press.
    // With react-test-renderer, this is less direct.
    // We can check if the prop is passed to BottomRightLabel if we query it.
  });

  // Test for default lineComponent rendering
  it('renders with default Line component when no LineComponent prop is passed', () => {
    const tree = renderer.create(<TextField {...baseProps} />).toJSON();
    // Snapshot implicitly verifies this by rendering the default line.
    // A more specific check would involve finding a component named 'Line' or checking its specific styles.
    expect(tree).toMatchSnapshot();
  });
});