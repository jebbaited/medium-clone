import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import axios from '../../api/axios';
import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import Modal from '../../UI/Modal';
import { Textarea } from '../../UI/Textarea';
import { Loader } from '../../UI/Loader';
import validateRules from '../../helpers/validateRules';
import { removeItem } from '../../helpers/persistanceStorage';
import { clearUser, saveUser } from '../../store/userSlice';

export const SettingsPage = () => {
  const user = useSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: user?.name,
      details: user?.details,
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    await updateUserInfo(formData);
    if (formData.avatar.length) await setAvatar(formData.avatar);
    navigate(`/profile/${user._id}/${user.name}`);
  };

  const updateUserInfo = async (data) => {
    try {
      const response = await axios.patch(`/users/${user._id}`, {
        name: data.username,
        extra_details: '',
        skills: '',
        profession: '',
        details: data.details,
      });
      if (response.data) {
        dispatch(saveUser(response.data));
      }
    } catch (error) {}
  };

  const setAvatar = async (files) => {
    const file = files[0];
    let formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await axios.put(`/users/upload/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data) {
        dispatch(saveUser(response.data));
      }
    } catch (error) {}
  };

  const logout = () => {
    removeItem('accessToken');
    dispatch(clearUser(null));
    navigate('/login');
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`/users/${user._id}`);
      removeItem('accessToken');
      dispatch(clearUser(null));
      navigate('/');
    } catch (error) {}
  };

  const buttonDisabled = Object.keys(errors).length ? true : false;

  return (
    <>
      {user ? (
        <div className="flex flex-col items-center min-width-640 ">
          <div className="flex flex-col justify-end flex-wrap w-1/2 ">
            <h1 className="mb-2">Your Settings</h1>

            <form
              className="flex flex-col justify-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                id="avatarInput"
                type="file"
                name="avatar"
                register={{
                  ...register('avatar', {
                    validate: (value) => {
                      const exp = /^.*\.(jpg|jpeg|JPG|png|PNG)$/;
                      if (exp.test(value[0]?.name) || user.avatar) return true;
                      return 'Wrong format. Choose another file';
                    },
                  }),
                }}
                errorMessage={errors}
                isLabled={true}
              />

              <Input
                id="userNameSettingsInputForm"
                type="text"
                name="username"
                placeholder="Username"
                register={{
                  ...register('username', {
                    ...validateRules.loginValidateRules,
                  }),
                }}
                errorMessage={errors}
                isLabled={true}
              />

              <Textarea
                id="detailsSettingsInputForm"
                rows="2"
                name="details"
                placeholder="Some details about you"
                register={{
                  ...register('details', {
                    ...validateRules.detailsValidateRules,
                  }),
                }}
                errorMessage={errors}
                isLabled={true}
              />

              <Button disabled={buttonDisabled}>Update Settings</Button>
              <hr className="my-3" />
            </form>
            <Button onClick={logout} isDanger={true}>
              Logout
            </Button>
            <Modal deleteTarget="profile" deleteUser={deleteUser} />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
