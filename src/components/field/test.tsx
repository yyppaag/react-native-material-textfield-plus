import { Image } from 'react-native';
import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import TextField from './index';

interface TestProps {
  label: string;
  value?: string | null;
  disabled?: boolean;
  defaultValue?: string;
  multiline?: boolean;
  title?: string;
  error?: string;
  characterRestriction?: number;
  prefix?: string;
  suffix?: string;
  renderLeftAccessory?: () => JSX.Element;
  renderRightAccessory?: () => JSX.Element;
}

const props: TestProps = {
  label: 'test',
};

/* eslint-env jest */

it('renders', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders null value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value={null} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders disabled value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' disabled />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders default value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} defaultValue='text' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders multiline value', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' multiline />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders title', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} title='field' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders error', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} error='message' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders counter', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' characterRestriction={10} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders restriction', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' characterRestriction={2} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders prefix', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' prefix='$' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders suffix', () => {
  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} value='text' suffix='.com' />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders left accessory', () => {
  let render = () => (
    <Image />
  );

  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} renderLeftAccessory={render} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});

it('renders right accessory', () => {
  let render = () => (
    <Image />
  );

  let field: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
    .create(<TextField {...props} renderRightAccessory={render} />)
    .toJSON();

  expect(field)
    .toMatchSnapshot();
});