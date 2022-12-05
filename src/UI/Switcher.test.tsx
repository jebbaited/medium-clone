import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Switcher } from './Switcher';

describe('Switcher works', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Switcher />
      </Provider>
    );
  });
  test('light mode on', () => {
    const lightButton = screen.getByTestId('light-button');
    const darkButton = screen.queryByTestId('dark-button');
    expect(lightButton).toBeInTheDocument();
    expect(darkButton).toBeNull();
  });
  test('dark mode on', () => {
    expect(screen.getByTestId('light-button')).toBeInTheDocument();
    expect(screen.queryByTestId('dark-button')).toBeNull();
    fireEvent.click(screen.getByTestId('light-button'));
    expect(screen.queryByTestId('light-button')).toBeNull();
    expect(screen.queryByTestId('dark-button')).toBeInTheDocument();
  });
});
