import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Line, { LineProps } from './index';

/* eslint-env jest */

const baseProps: LineProps = {
  disabled: false,
  restricted: false,
  baseColor: 'black',
  tintColor: 'blue',
  errorColor: 'red',
  lineWidth: 0.5,
  activeLineWidth: 2,
  disabledLineWidth: 1,
  focusAnimation: new Animated.Value(0), // Neutral focus state
};

describe('Line', () => {
  it('renders correctly with default props and neutral focus', () => {
    const tree = renderer.create(<Line {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when disabled', () => {
    const tree = renderer.create(<Line {...baseProps} disabled={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when restricted', () => {
    const tree = renderer.create(<Line {...baseProps} restricted={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when active (focused)', () => {
    const tree = renderer.create(<Line {...baseProps} focusAnimation={new Animated.Value(1)} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when in error state (focused)', () => {
    const tree = renderer.create(<Line {...baseProps} focusAnimation={new Animated.Value(-1)} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders null when lineType is "none"', () => {
    const tree = renderer.create(<Line {...baseProps} lineType="none" />).toJSON();
    expect(tree).toBeNull();
  });

  it('renders null when disabled and disabledLineType is "none"', () => {
    const tree = renderer.create(<Line {...baseProps} disabled={true} disabledLineType="none" />).toJSON();
    expect(tree).toBeNull();
  });

  it('renders with "dotted" lineType', () => {
    const tree = renderer.create(<Line {...baseProps} lineType="dotted" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with "dashed" lineType when disabled', () => {
    const tree = renderer.create(<Line {...baseProps} disabled={true} disabledLineType="dashed" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('uses specific lineColor when provided', () => {
    const tree = renderer.create(<Line {...baseProps} lineColor="green" />).toJSON();
    expect(tree).toMatchSnapshot(); // Color change will be in snapshot
  });

  it('uses specific lineTintColor when provided and active', () => {
    const tree = renderer.create(
      <Line {...baseProps} lineTintColor="purple" focusAnimation={new Animated.Value(1)} />
    ).toJSON();
    expect(tree).toMatchSnapshot(); // Color change will be in snapshot
  });

  it('uses specific disabledLineColor when provided and disabled', () => {
    const tree = renderer.create(
      <Line {...baseProps} disabledLineColor="grey" disabled={true} />
    ).toJSON();
    expect(tree).toMatchSnapshot(); // Color change will be in snapshot
  });

  it('applies lineContainer style', () => {
    const customStyle = { marginTop: 10, marginBottom: 5 };
    const tree = renderer.create(<Line {...baseProps} lineContainer={customStyle} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
