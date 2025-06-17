import { Image } from 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import OutlinedTextField from './index';
import { FieldProps } from '../field'; // Import FieldProps

/* eslint-env jest */

// Base props for OutlinedTextField tests. It accepts all FieldProps.
const baseProps: Partial<FieldProps> = {
  label: 'Test Label',
};

describe('OutlinedTextField', () => {
  it('renders correctly with minimal props', () => {
    const tree = renderer.create(<OutlinedTextField {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a value', () => {
    const tree = renderer.create(<OutlinedTextField {...baseProps} value="text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = renderer.create(<OutlinedTextField {...baseProps} value="text" disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a title (helper text)', () => {
    const tree = renderer.create(<OutlinedTextField {...baseProps} title="Helper title" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a character counter', () => {
    const tree = renderer.create(
      <OutlinedTextField {...baseProps} value="text" characterRestriction={10} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a left accessory', () => {
    const renderLeftAccessory = () => <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{width: 20, height: 20}} />;
    const tree = renderer.create(
      <OutlinedTextField {...baseProps} renderLeftAccessory={renderLeftAccessory} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Specific test for OutlinedTextField: ensure it renders the Outline component.
  // This is implicitly covered by snapshots, but a more direct test could be added
  // if we could query component types easily (e.g., findByType(Outline) which is not standard in react-test-renderer).
  // For now, snapshots are the primary verification for the outline appearance.

  // Test that onTextLayoutForLabel is passed (conceptual)
  // Actual testing of onTextLayout's effect (labelWidth change) is an integration test with TextField.
  // Here, we just ensure OutlinedTextField itself renders as expected.
  it('renders correctly when label animation might occur (active state)', () => {
    // To make this test more meaningful for Outline, we'd need to simulate focus/text input
    // to trigger labelAnimation changes, then check the snapshot.
    // With react-test-renderer, this is complex. We'll rely on TextField's tests for animation logic.
    // This snapshot primarily ensures OutlinedTextField renders correctly in a typical state.
    const tree = renderer.create(<OutlinedTextField {...baseProps} value="some value" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
