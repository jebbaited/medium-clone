import React from 'react';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate } from 'react-router';

import { Input } from '../../UI/Input';
import { Button } from '../../UI/Button';
import Modal from '../../UI/Modal';
import { Textarea } from '../../UI/Textarea';
import { Loader } from '../../UI/Loader';
import validateRules from '../../helpers/validateRules';
import { removeItem } from '../../helpers/persistanceStorage';
import {
  clearUser,
  patchUserById,
  updateAvatar,
  deleteUser,
} from '../../store/userSlice';
import { postAPI } from '../../api/postAPI';
import { IPost, IUser, KeyStrings } from '../../types/types';

interface ISettingParamForm {
  avatar: File[];
  username: string;
  details: string;
}

export const SettingsPage = () => {
  const currentUser: IUser = useAppSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISettingParamForm>({
    mode: 'onChange',
    defaultValues: {
      username: currentUser?.name,
      details: currentUser?.details,
    },
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ISettingParamForm> = (formData): void => {
    updateUserInfo(formData);
    if (!formData.avatar.length) return;
    setAvatar(formData.avatar);
  };

  const updateUserInfo = (data: ISettingParamForm): void => {
    dispatch(
      patchUserById({
        id: currentUser._id,
        name: data.username,
        details: data.details,
      })
    );
    alert('Successfully updated!');
  };

  const setAvatar = (files: File[]): void => {
    const avatar: File = files[0];
    dispatch(updateAvatar({ id: currentUser._id, avatar }));
  };

  const logout = useCallback((): void => {
    removeItem(KeyStrings.accessToken);
    dispatch(clearUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const deleteAllUserPosts = useCallback(async () => {
    try {
      const data = await postAPI.getAllPosts(null, null, currentUser._id);
      if (!data) return;
      data.data.forEach((post: IPost) => {
        deletePost(post._id);
      });
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id]);

  const deleteUserProfile = useCallback(async () => {
    await deleteAllUserPosts();

    dispatch(deleteUser(currentUser._id));
    navigate('/');
  }, [deleteAllUserPosts, dispatch, navigate, currentUser?._id]);

  const deletePost = async (postId: string) => {
    try {
      await postAPI.deletePostById(postId);
    } catch (error) {
      console.log(error);
    }
  };

  const buttonDisabled: boolean = !!Object.keys(errors).length;

  return (
    <>
      {currentUser ? (
        <div className="flex flex-col items-center min-width-640 h-[calc(100vh-56px)]">
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
                      if (exp.test(value[0]?.name)) return true;
                      return 'Wrong format. Choose another file';
                    },
                  }),
                }}
                errorMessage={errors}
                isLabeled={true}
              />

              <Input
                id="userNameSettingsInputForm"
                type="text"
                name="username"
                placeholder="Username"
                register={{
                  ...register('username', validateRules.loginValidateRules),
                }}
                errorMessage={errors}
                isLabeled={true}
              />

              <Textarea
                id="detailsSettingsInputForm"
                rows="2"
                name="details"
                placeholder="Some details about you"
                register={{
                  ...register('details', validateRules.detailsValidateRules),
                }}
                errorMessage={errors}
                isLabeled={true}
              />

              <Button disabled={buttonDisabled}>Update Settings</Button>
              <hr className="my-3" />
            </form>
            <Button onClick={logout} isDanger={true}>
              Logout
            </Button>
            <Modal deleteTarget="profile" deleteUser={deleteUserProfile} />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
