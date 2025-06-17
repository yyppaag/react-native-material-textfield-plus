import 'react-native';
import React from 'react';
import { Animated } from 'react-native';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import Affix from './index';

/* eslint-env jest */

interface AffixProps {
  color: string;
  fontSize: number;
  labelAnimation: Animated.Value;
}

const props: AffixProps = {
  color: 'black',
  fontSize: 16,
  labelAnimation: new Animated.Value(1),
};

const prefix: string = 'a';
const suffix: string = 'z';

it('renders prefix', () => {
  let affix: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Affix type='prefix' {...props}>{prefix}</Affix>)
    .toJSON();

  expect(affix)
    .toMatchSnapshot();
});

it('renders inactive prefix', () => {
  let affix: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Affix type='prefix' {...props} labelAnimation={new Animated.Value(0)}>
        {prefix}
      </Affix>
    )
    .toJSON();

  expect(affix)
    .toMatchSnapshot();
});

it('renders suffix', () => {
  let affix: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<Affix type='suffix' {...props}>{suffix}</Affix>)
    .toJSON();

  expect(affix)
    .toMatchSnapshot();
});

it('renders inactive suffix', () => {
  let affix: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(
      <Affix type='suffix' {...props} labelAnimation={new Animated.Value(0)}>
        {suffix}
      </Affix>
    )
    .toJSON();

  expect(affix)
    .toMatchSnapshot();
});
