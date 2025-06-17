import 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Counter, { CounterProps } from './index'; // Import CounterProps from component

/* eslint-env jest */

// Base props, can be spread and overridden in tests
const baseProps: CounterProps = {
  count: 0, // Default count
  baseColor: 'blue',
  errorColor: 'red',
  // fontSize is not directly a prop of Counter, but could be part of a style prop.
  // The original test's CounterProps had fontSize, but the component's CounterProps does not.
  // Let's remove fontSize from here as it's not a direct prop.
  // If it was meant to be part of a style, it should be tested via the style prop.
};

it('renders null when limit is not set', () => {
  const tree = renderer.create(<Counter {...baseProps} count={1} />).toJSON();
  expect(tree).toBeNull();
});

it('renders correctly when limit is set and not exceeded', () => {
  const tree = renderer.create(<Counter {...baseProps} count={1} limit={10} />).toJSON();
  expect(tree).toMatchSnapshot();
  // Optional: More specific style check for baseColor if not relying solely on snapshots
  // const instance = renderer.create(<Counter {...baseProps} count={1} limit={10} />);
  // const textInstance = instance.root.findByType('Text');
  // expect(textInstance.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: baseProps.baseColor })]));
});

it('renders correctly and shows error color when limit is exceeded', () => {
  const tree = renderer.create(<Counter {...baseProps} count={11} limit={10} />).toJSON();
  expect(tree).toMatchSnapshot();
  // Optional: More specific style check for errorColor
  // const instance = renderer.create(<Counter {...baseProps} count={11} limit={10} />);
  // const textInstance = instance.root.findByType('Text');
  // expect(textInstance.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ color: baseProps.errorColor })]));
});

it('displays the correct count and limit text', () => {
  const count = 5;
  const limit = 15;
  const instance = renderer.create(<Counter {...baseProps} count={count} limit={limit} />);
  const textInstance = instance.root.findByType('Text');
  expect(textInstance.props.children.join('')).toBe(`${count} / ${limit}`);
});

it('applies custom style prop', () => {
  const customStyle = { fontSize: 20, fontWeight: 'bold' as const };
  const tree = renderer.create(<Counter {...baseProps} count={1} limit={2} style={customStyle} />).toJSON();
  expect(tree).toMatchSnapshot();

  // More specific check
  const instance = renderer.create(<Counter {...baseProps} count={1} limit={2} style={customStyle} />);
  const textInstance = instance.root.findByType('Text');
  // Check if customStyle is part of the applied styles.
  // Note: styles are merged. Snapshot is usually sufficient.
  const json = instance.toJSON() as ReactTestRendererJSON;
  expect(json!.props.style).toEqual(expect.arrayContaining([customStyle]));
});
