import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Affix, { AffixProps } from './index'; // Import AffixProps from component

/* eslint-env jest */

// Base props, individual tests can override parts of this
const baseProps: AffixProps = {
  color: 'black',
  fontSize: 16,
  labelAnimation: new Animated.Value(1),
  type: 'prefix', // Default type for baseProps, can be overridden
};

const prefix: string = 'a';
const suffix: string = 'z';

it('renders prefix correctly', () => {
  const tree = renderer.create(<Affix {...baseProps} type="prefix">{prefix}</Affix>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders suffix correctly', () => {
  const tree = renderer.create(<Affix {...baseProps} type="suffix">{suffix}</Affix>).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders inactive prefix (opacity 0)', () => {
  const tree = renderer.create(
    <Affix {...baseProps} type="prefix" labelAnimation={new Animated.Value(0)}>{prefix}</Affix>
  ).toJSON();
  expect(tree).toMatchSnapshot();
  // More specific checks could be added if not using snapshots, e.g., checking style.opacity
});

it('renders inactive suffix (opacity 0)', () => {
  const tree = renderer.create(
    <Affix {...baseProps} type="suffix" labelAnimation={new Animated.Value(0)}>{suffix}</Affix>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with default numberOfLines', () => {
  const tree = renderer.create(<Affix {...baseProps}>{prefix}</Affix>).toJSON();
  // Snapshot will cover this. To be more explicit without snapshots:
  // const textInstance = tree.children[0]; // Assuming Animated.Text is the first child of Animated.View
  // expect(textInstance.props.numberOfLines).toBe(1);
  expect(tree).toMatchSnapshot();
});

it('renders with custom numberOfLines', () => {
  const tree = renderer.create(<Affix {...baseProps} numberOfLines={2}>{prefix}</Affix>).toJSON();
  // Snapshot will cover this. To be more explicit without snapshots:
  // const textInstance = tree.children[0];
  // expect(textInstance.props.numberOfLines).toBe(2);
  expect(tree).toMatchSnapshot();
});

it('applies custom style to the text', () => {
  const customStyle = { color: 'blue', textDecorationLine: 'underline' as const };
  const tree = renderer.create(<Affix {...baseProps} style={customStyle}>{prefix}</Affix>).toJSON();
  expect(tree).toMatchSnapshot();
  // More explicit check:
  // const textElement = tree.children[0]; // Assuming Animated.Text
  // expect(textElement.props.style).toEqual(expect.arrayContaining([customStyle]));
});
