import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import axios from '../../api/axios';
import validateRules from '../../helpers/validateRules';
import { setItem } from '../../helpers/persistanceStorage';
import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import { saveUser } from '../../store/userSlice';

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorFromServer, setErrorFromServer] = useState(null);

  const onSubmit = async (formData) => {
    await signIn(formData);
  };

  const signIn = async (data) => {
    try {
      const response = await axios.post('/auth', {
        email: data.email,
        password: data.password,
      });
      if (!response.data) return;

      setItem('accessToken', response.data.token);
      await getUserByToken();
      navigate('/');
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const getUserByToken = async () => {
    try {
      const response = await axios.get('/auth/user');
      dispatch(saveUser(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const buttonDisabled = !!Object.keys(errors).length;

  return (
    <div className="flex flex-col items-center min-width-640">
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
              ...register('email', {
                ...validateRules.emailValidateRules,
              }),
            }}
            errorMessage={errors}
          />

          <Input
            id="passwordLoginInputForm"
            type="password"
            name="password"
            placeholder="Password"
            register={{
              ...register('password', {
                ...validateRules.passwordValidateRules,
              }),
            }}
            errorMessage={errors}
          />
          <Button disabled={buttonDisabled}>Sign In</Button>
        </form>
      </div>
    </div>
  );
};
