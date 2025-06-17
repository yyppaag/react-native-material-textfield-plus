import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Helper, { HelperProps } from './index'; // Import HelperProps

/* eslint-env jest */

const helperText: string = 'This is a helper';
const errorText: string = 'This is an error';

const baseProps: HelperProps = {
  title: helperText,
  baseColor: 'black',
  errorColor: 'red',
  focusAnimation: new Animated.Value(0), // Neutral state
};

describe('Helper', () => {
  it('renders correctly with title and neutral focus', () => {
    const tree = renderer.create(<Helper {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = renderer.create(<Helper {...baseProps} disabled={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with error text when error prop is provided and focus is error state', () => {
    // Simulate error state via focusAnimation being -1 (as per component logic)
    // and error prop being set.
    const tree = renderer.create(
      <Helper
        {...baseProps}
        error={errorText}
        focusAnimation={new Animated.Value(-1)} // Error focus state
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders title text when error prop is provided but focus is neutral', () => {
    // Even if error prop is present, if focusAnimation is not in error state,
    // the component's internal `errored` state might be false initially or after transition.
    // The snapshot will show the text based on the `errored` state derived from focusAnimation.
    const tree = renderer.create(
      <Helper
        {...baseProps}
        error={errorText} // error prop is present
        focusAnimation={new Animated.Value(0)} // Neutral focus state
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders null if no title and no error are provided', () => {
    const tree = renderer.create(
      <Helper {...baseProps} title={undefined} error={undefined} />
    ).toJSON();
    expect(tree).toBeNull();
  });

  it('applies custom style prop', () => {
    const customStyle = { fontSize: 18, fontWeight: 'bold' as const };
    const tree = renderer.create(<Helper {...baseProps} style={customStyle} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders title when focusAnimation indicates error but no error prop is set', () => {
    // This tests the scenario where animation might show error color, but text remains title
    const tree = renderer.create(
      <Helper
        {...baseProps}
        title="Only title"
        error={undefined} // No error text
        focusAnimation={new Animated.Value(-1)} // Error focus state for color
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
