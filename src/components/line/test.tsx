import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Line, { LineProps } from './index';

/* eslint-env jest */

const props: LineProps = {
  disabled: false,
  restricted: false,
  baseColor: 'black',
  tintColor: 'blue',
  errorColor: 'red',
  lineWidth: 0.5,
  activeLineWidth: 2,
  disabledLineWidth: 1,
  focusAnimation: new Animated.Value(0),
};

it('renders line', () => {
  let line: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Line {...props} />)
    .toJSON();

  expect(line)
    .toMatchSnapshot();
});

it('renders disabled line', () => {
  let line: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Line {...props} disabled={true} />)
    .toJSON();

  expect(line)
    .toMatchSnapshot();
});

it('renders restricted line', () => {
  let line: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Line {...props} restricted={true} />)
    .toJSON();

  expect(line)
    .toMatchSnapshot();
});

it('renders active line', () => {
  let line: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Line {...props} focusAnimation={new Animated.Value(1)} />)
    .toJSON();

  expect(line)
    .toMatchSnapshot();
});
