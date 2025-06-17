import { Image } from 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import FilledTextField from './index';
import { FieldProps } from '../field'; // Import FieldProps

/* eslint-env jest */

// Base props for FilledTextField tests. It accepts all FieldProps.
const baseProps: Partial<FieldProps> = {
  label: 'Test Label',
};

describe('FilledTextField', () => {
  it('renders correctly with minimal props', () => {
    const tree = renderer.create(<FilledTextField {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a value', () => {
    const tree = renderer.create(<FilledTextField {...baseProps} value="text" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = renderer.create(<FilledTextField {...baseProps} value="text" disabled />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a title (helper text)', () => {
    const tree = renderer.create(<FilledTextField {...baseProps} title="Helper title" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a character counter', () => {
    const tree = renderer.create(
      <FilledTextField {...baseProps} value="text" characterRestriction={10} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a left accessory', () => {
    const renderLeftAccessory = () => <Image source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{width: 20, height: 20}} />;
    const tree = renderer.create(
      <FilledTextField {...baseProps} renderLeftAccessory={renderLeftAccessory} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Add more tests if FilledTextField had specific logic beyond overriding TextField's styles/defaults.
  // For instance, if it introduced new props or significantly altered behavior.
  // Since it primarily passes down specialized defaults, snapshots of various states are effective.
});
