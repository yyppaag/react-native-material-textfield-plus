import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Helper from './index';

/* eslint-env jest */

interface TestProps {
  title: string;
  fontSize: number;
  baseColor: string;
  errorColor: string;
  focusAnimation: Animated.Value;
  disabled?: boolean;
  error?: string;
}

const text: string = 'helper';
const props: TestProps = {
  title: text,
  fontSize: 16,
  baseColor: 'black',
  errorColor: 'red',
  focusAnimation: new Animated.Value(0),
};

it('renders helper', () => {
  let helper: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Helper {...props} />)
    .toJSON();

  expect(helper)
    .toMatchSnapshot();
});

it('renders disabled helper', () => {
  let helper: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Helper {...props} disabled={true} />
    )
    .toJSON();

  expect(helper)
    .toMatchSnapshot();
});

it('renders helper with error', () => {
  let helper: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Helper {...props} error={text} focusAnimation={new Animated.Value(-1)} />
    )
    .toJSON();

  expect(helper)
    .toMatchSnapshot();
});
