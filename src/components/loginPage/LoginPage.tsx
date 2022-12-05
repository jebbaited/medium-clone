import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/hooks';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { getUserByToken } from '../../store/userSlice';
import validateRules from '../../helpers/validateRules';
import { setItem } from '../../helpers/persistanceStorage';
import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import { authAPI } from '../../api/authAPI';
import { IToken, KeyStrings } from '../../types/types';

interface ILoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormData>({ mode: 'onChange' });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorFromServer, setErrorFromServer] = useState<string>('');

  const onSubmit: SubmitHandler<ILoginFormData> = async (
    formData
  ): Promise<void> => {
    await signIn(formData);
  };

  const signIn = async (data: ILoginFormData): Promise<IToken> => {
    try {
      const response: IToken = await authAPI.postAuth(
        data.email,
        data.password
      );
      if (!response.data) return;
      setItem(KeyStrings.accessToken, response.data.token);
      dispatch(getUserByToken());
      navigate('/');
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const buttonDisabled: boolean = !!Object.keys(errors).length;

  return (
    <div className="flex flex-col items-center min-width-640 h-[calc(100vh-56px)]">
      <div className="flex flex-col justify-end flex-wrap w-96">
        <h1>Sign in</h1>
        <Link to="/register">
          <p className="text-emerald-500 pb-4">Need an account?</p>
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center"
        >
          {errorFromServer && (
            <div className="error-from-server">{errorFromServer}</div>
          )}
          <Input
            id="emailLoginInputForm"
            type="text"
            name="email"
            placeholder="Email"
            register={{
              ...register('email', validateRules.emailValidateRules),
            }}
            errorMessage={errors}
          />

          <Input
            id="passwordLoginInputForm"
            type="password"
            name="password"
            placeholder="Password"
            register={{
              ...register('password', validateRules.passwordValidateRules),
            }}
            errorMessage={errors}
          />
          <Button disabled={buttonDisabled}>Sign In</Button>
        </form>
      </div>
    </div>
  );
};
