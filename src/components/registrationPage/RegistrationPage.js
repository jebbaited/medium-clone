import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import validateRules from '../../helpers/validateRules';
import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import { saveUser } from '../../store/userSlice';

const RegistrationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorFromServer, setErrorFromServer] = useState(null);

  const onSubmit = async (formData) => {
    await createUser(formData);
  };

  const createUser = async (formData) => {
    try {
      const response = await axios.post('/users', {
        email: formData.email,
        password: formData.password,
        name: formData.username,
        extra_details: '',
        skills: '',
        profession: '',
        details: '',
      });
      if (response.data) {
        dispatch(saveUser(response.data));
        navigate('/login');
      }
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const buttonDisabled = Object.keys(errors).length ? true : false;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-end flex-wrap w-96">
        <h1>Sign up</h1>
        <Link to="/login">
          <p className="text-sm text-emerald-500 pb-4">Have an account?</p>
        </Link>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center"
        >
          {errorFromServer && (
            <div className="errorFromServer">{errorFromServer}</div>
          )}
          <Input
            id="userNameInputForm"
            type="text"
            name="username"
            placeholder="Username"
            register={{
              ...register('username', {
                ...validateRules.loginValidateRules,
              }),
            }}
            errorMessage={errors}
          />

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

          <Button disabled={buttonDisabled}>Sign Up</Button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
