import 'react-native';
import React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import renderer, { ReactTestRendererJSON, ReactTestInstance } from 'react-test-renderer';

import Label, { LabelProps, LabelOffset } from './index';

/* eslint-env jest */

const props: LabelProps = {
  fontSize: 16,
  activeFontSize: 12,
  contentInset: { label: 4 },
  baseColor: 'black',
  tintColor: 'blue',
  errorColor: 'red',
  offset: { x0: 0, y0: 0, x1: 0, y1: 0 } as LabelOffset,
  focusAnimation: new Animated.Value(0),
  labelAnimation: new Animated.Value(0),
  label: 'test',
};

it('renders label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Label {...props} />)
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders empty label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Label {...props} label={undefined} />)
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders active label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label {...props} labelAnimation={new Animated.Value(1)} />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders active focused label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label
        {...props}
        labelAnimation={new Animated.Value(1)}
        focusAnimation={new Animated.Value(1)}
      />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders errored label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label
        {...props}
        labelAnimation={new Animated.Value(0)}
        focusAnimation={new Animated.Value(-1)}
      />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders active errored label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label
        {...props}
        labelAnimation={new Animated.Value(1)}
        focusAnimation={new Animated.Value(-1)}
      />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders restricted label', () => {
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label restricted={true} {...props} />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});

it('renders styled label', () => {
  const style: StyleProp<TextStyle> = { textTransform: 'uppercase' };
  let label: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Label style={style} {...props} />
    )
    .toJSON();

  expect(label)
    .toMatchSnapshot();
});
