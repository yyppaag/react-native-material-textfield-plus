import { Image } from 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import FilledTextField from './index';

interface TestProps {
  label: string;
  value?: string;
  disabled?: boolean;
  title?: string;
  characterRestriction?: number;
  renderLeftAccessory?: () => JSX.Element;
}

const props: TestProps = {
  label: 'test',
};

/* eslint-env jest */

it('renders', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} value='text' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders disabled value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} value='text' disabled />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders title', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} title='field' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders counter', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} value='text' characterRestriction={10} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders accessory', () => {
  let render = (): JSX.Element => (
    <Image />
  );

  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<FilledTextField {...props} renderLeftAccessory={render} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});
