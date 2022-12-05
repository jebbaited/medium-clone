import React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import validateRules from '../../helpers/validateRules';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Textarea } from '../../UI/Textarea';
import { postAPI } from '../../api/postAPI';

interface IEditorParamForm {
  image: File[];
  title: string;
  description: string;
  text: string;
}

export const PostEditorPage = () => {
  const [errorFromServer, setErrorFromServer] = useState<string>('');
  const params = useParams();
  const postId = params.id;

  const currentPost = useAppSelector((state) => state.posts.singlePost);
  const currentUser = useAppSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditorParamForm>({
    mode: 'onChange',
    defaultValues: {
      title: currentPost.title,
      description: currentPost.description,
      text: currentPost.fullText,
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IEditorParamForm> = async (
    formData
  ): Promise<void> => {
    await updatePost(formData);
    if (!formData.image.length) return;
    await updatePostImage(formData.image);
  };

  const updatePost = async (data: IEditorParamForm): Promise<void> => {
    try {
      await postAPI.updatePostById(
        postId,
        data.title,
        data.text,
        data.description
      );
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
    navigate(`/profile/${currentUser._id}/${currentUser.name}`);
  };

  const updatePostImage = async (files: File[]): Promise<void> => {
    const image: File = files[0];
    try {
      await postAPI.updatePostImageById(postId, image);
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const buttonDisabled: boolean = !!Object.keys(errors).length;

  return (
    <div className="flex justify-center mt-6 min-width-640 h-[100vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="flex flex-col">
          <h1>Update your post</h1>
          {errorFromServer && (
            <div className="error-from-server">{errorFromServer}</div>
          )}
          <Input
            id="postImageInput"
            type="file"
            name="image"
            register={{
              ...register('image', {
                validate: (value) => {
                  const exp = /^.*\.(jpg|jpeg|JPG|png|PNG|gif|GIF)$/;
                  if (exp.test(value[0]?.name)) return true;
                  return 'Wrong format. Choose another file';
                },
              }),
            }}
            errorMessage={errors}
            isLabeled={true}
          />
          <Input
            id="titleInput"
            type="text"
            name="title"
            placeholder="Post title"
            register={{
              ...register(
                'title',
                validateRules.postValidationRules.titleValidation
              ),
            }}
            errorMessage={errors}
            className="text-lg"
            isLabeled={true}
          />
          <Input
            id="postDescriptionInput"
            type="text"
            name="description"
            placeholder="What's this post about?"
            register={{
              ...register(
                'description',
                validateRules.postValidationRules.descriptionValidation
              ),
            }}
            errorMessage={errors}
            isLabeled={true}
          />

          <Textarea
            id="fullTextInput"
            rows="7"
            name="text"
            placeholder="Write your post"
            register={{
              ...register(
                'text',
                validateRules.postValidationRules.fullTextValidation
              ),
            }}
            errorMessage={errors}
            isLabeled={true}
          />
          <Button disabled={buttonDisabled}>Update Post</Button>
        </div>
      </form>
    </div>
  );
};
