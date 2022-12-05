import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  test('Input with mandatory props', () => {
    render(<Input id="someId" name="someName" />);
    const input = screen.getByTestId('input-for-components');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'someId');
    expect(screen.queryByTestId('label-for-input')).toBeNull();
  });

  test('Input with some additional props', () => {
    render(
      <Input
        id="someId"
        name="someName"
        className="bg-red"
        placeholder="placeholderText"
      />
    );
    const input = screen.getByTestId('input-for-components');
    expect(input).toHaveAttribute('placeholder', 'placeholderText');
    expect(input).toHaveAttribute('class', expect.stringContaining('bg-red'));
  });

  test('Input with label', () => {
    render(<Input id="someId" name="someName" isLabeled={true} />);
    const label = screen.getByTestId('label-for-input');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(/someName/i);
  });
});
