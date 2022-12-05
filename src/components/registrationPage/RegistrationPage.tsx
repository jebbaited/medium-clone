import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import validateRules from '../../helpers/validateRules';
import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import { usersAPI } from '../../api/usersAPI';

interface IRegistrationFormData {
  email: string;
  password: string;
  username: string;
}

export const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationFormData>({ mode: 'onChange' });

  const navigate = useNavigate();
  const [errorFromServer, setErrorFromServer] = useState<string>('');

  const onSubmit: SubmitHandler<IRegistrationFormData> = async (
    formData
  ): Promise<void> => {
    await createUser(formData);
  };

  const createUser = async (formData: IRegistrationFormData): Promise<void> => {
    try {
      const data = await usersAPI.postUser(
        formData.email,
        formData.password,
        formData.username
      );
      if (!data) return;
      navigate('/login');
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const buttonDisabled: boolean = !!Object.keys(errors).length;

  return (
    <>
      <div className="flex flex-col items-center min-width-640 h-[calc(100vh-56px)]">
        <div className="flex flex-col justify-end flex-wrap w-96">
          <h1>Sign up</h1>
          <Link to="/login">
            <p className="text-emerald-500 pb-4">Have an account?</p>
          </Link>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center"
          >
            {errorFromServer && (
              <div className="error-from-server">{errorFromServer}</div>
            )}
            <Input
              id="userNameInputForm"
              type="text"
              name="username"
              placeholder="Username"
              register={{
                ...register('username', validateRules.loginValidateRules),
              }}
              errorMessage={errors}
            />

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

            <Button disabled={buttonDisabled}>Sign Up</Button>
          </form>
        </div>
      </div>
    </>
  );
};
