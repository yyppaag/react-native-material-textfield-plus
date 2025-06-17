import 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON, ReactTestInstance } from 'react-test-renderer';

import BottomRightLabel, { BottomRightLabelProps } from './index'; // Adjust if BottomRightLabelProps is not exported

/* eslint-env jest */

const mockOnPress = jest.fn();

const baseProps: BottomRightLabelProps = {
  title: 'Test Title',
  baseColor: 'black', // Though unused, it's part of the props
  onPress: mockOnPress,
  testID: 'bottom-right-label',
  accessibilityLabel: 'Test Label',
};

describe('BottomRightLabel', () => {
  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with a title', () => {
    const tree = renderer.create(<BottomRightLabel {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders null if title is not provided or empty', () => {
    const treeNull = renderer.create(<BottomRightLabel {...baseProps} title={undefined as any} />).toJSON();
    expect(treeNull).toBeNull();

    const treeEmpty = renderer.create(<BottomRightLabel {...baseProps} title="" />).toJSON();
    expect(treeEmpty).toBeNull();
  });

  it('applies rightTextStyle', () => {
    const customStyle = { color: 'blue', fontSize: 10 };
    const tree = renderer.create(<BottomRightLabel {...baseProps} rightTextStyle={customStyle} />).toJSON();
    expect(tree).toMatchSnapshot();

    // More specific check for style application
    const instance = renderer.create(<BottomRightLabel {...baseProps} rightTextStyle={customStyle} />);
    const textInstance = instance.root.findByType('Text');
    // Check if customStyle is part of the applied styles.
    // Note: styles are merged, so check for presence of custom styles.
    // This can be complex due to StyleSheet processing. Snapshot is usually sufficient.
    // For a direct check, you'd look at the props of the Text element in the JSON output.
    const json = instance.toJSON() as ReactTestRendererJSON;
    expect(json!.props.style).toEqual(expect.arrayContaining([customStyle]));
  });

  it('passes onPress prop', () => {
    const tree = renderer.create(<BottomRightLabel {...baseProps} />).toJSON() as ReactTestRendererJSON;
    expect(tree!.props.onPress).toBeDefined();
    // Note: react-test-renderer does not simulate press events easily.
    // @testing-library/react-native would be better for this with fireEvent.
    // For now, we ensure the prop is passed.
  });

  it('applies testID and accessibilityLabel', () => {
    const tree = renderer.create(<BottomRightLabel {...baseProps} />).toJSON() as ReactTestRendererJSON;
    expect(tree!.props.testID).toBe('bottom-right-label');
    expect(tree!.props.accessibilityLabel).toBe('Test Label');
  });

  // Test for the unused baseColor - it won't affect rendering but ensures prop handling
  it('renders with baseColor prop (though unused visually)', () => {
    const tree = renderer.create(<BottomRightLabel {...baseProps} baseColor="green" />).toJSON();
    expect(tree).toMatchSnapshot(); // Ensures component renders with it
  });
});
