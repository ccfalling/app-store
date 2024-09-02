import { test, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import Search from './Search';

test('clear icon', () => {
  const { getByTestId } = render(<Search onSearch={() => {}} />);

  const after = getByTestId('afterIcon');
  expect(after.getAttribute('font-size')).toBe('0');

  const input = getByTestId('input');
  const val = 'Hello';
  fireEvent.change(input, { target: { value: val } });
  expect((input as HTMLInputElement).value).toBe(val);
  expect(after.getAttribute('font-size')).toBe('16');
})

test('event should be called', () => {
  const fn = jest.fn();
  const { getByTestId } = render(<Search onSearch={fn} />);

  const input = getByTestId('input');
  const val = '123';
  fireEvent.change(input, { target: { value: val } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });
  expect(fn).toBeCalled();
})


test('value should be clear', () => {
  const { getByTestId } = render(<Search onSearch={() => {}} />);

  const input = getByTestId('input');
  const val = '123';
  fireEvent.change(input, { target: { value: val } });
  expect((input as HTMLInputElement).value).toBe(val);

  const after = getByTestId('afterIcon');
  fireEvent.pointerDown(after);

  expect((input as HTMLInputElement).value).toBe('');
})