import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { RegistrationPage } from '../components/registrationPage/RegistrationPage';
import { SinglePostPage } from '../components/singlePostPage/SinglePostPage';
import { Button } from './Button';
import { Provider } from 'react-redux';
import { store } from '../store';
import axios from '../api/axios';

jest.mock('../api/axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Button', () => {
  let button;

  beforeEach(() => {
    render(
      <Button
        disabled={false}
        isDanger={true}
        className="py-10"
        children={''}
      />
    );
    button = screen.getByRole('button');
  });

  test('Has disabled attribute', () => {
    expect(button).not.toBeDisabled();
  });
  test('Danger styles applied to button', () => {
    expect(button).toHaveAttribute(
      'class',
      expect.stringContaining('text-red-400')
    );
  });
  test('Extra styles applied to button', () => {
    expect(button).toHaveAttribute('class', expect.stringContaining('py-10'));
  });
});

describe('Button on Registration page', () => {
  test('Appears on the page', () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );
    const signUpButton = screen.getByRole('button');
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toBeEnabled();
    expect(signUpButton).toHaveAttribute(
      'class',
      expect.stringContaining('bg-emerald-500')
    );
  });
});

describe('Button on Single post page', () => {
  let response;
  beforeEach(() => {
    response = {
      data: {
        _id: '5mhlen4lhgod95mymg',
        title: 'new post',
        fullText: 'ddddddddddddddddd',
        description: 'dfghfjul',
        dateCreated: '2021-09-01T15:18:51.859Z',
        image: null,
        likes: ['612cb18e902cf330b086a25b', '612de7d3c46d5405b35520e1'],
        postedBy: '612dfff0c46d5405b35529d2',
      },
    };
  });
  test('Show comments button appears after request', async () => {
    mockedAxios.get.mockReturnValue(response);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SinglePostPage />
        </MemoryRouter>
      </Provider>
    );
    const showCommentsButton = await screen.findByTestId(
      'show-comments-button'
    );
    expect(showCommentsButton).toBeInTheDocument();
  });
});
