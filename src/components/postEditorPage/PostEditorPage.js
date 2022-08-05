import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import axios from '../../api/axios';
import validateRules from '../../helpers/validateRules';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Textarea } from '../../UI/Textarea';

export const PostEditorPage = () => {
  const [errorFromServer, setErrorFromServer] = useState(null);
  const params = useParams();
  const postId = params.id;

  const currentPost = useSelector((state) => state.posts.singlePost);
  const currentUser = useSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: currentPost.title,
      description: currentPost.description,
      text: currentPost.fullText,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    await updatePost(formData);
    if (!formData.image.length) return;
    await updatePostImage(formData.image);
  };

  const updatePost = async (data) => {
    try {
      await axios.patch(`/posts/${postId}`, {
        title: data.title,
        fullText: data.text,
        description: data.description,
      });
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
    navigate(`/profile/${currentUser._id}/${currentUser.name}`);
  };

  const updatePostImage = async (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.put(`/posts/upload/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const buttonDisabled = !!Object.keys(errors).length;

  return (
    <div className="flex justify-center mt-6 min-width-640">
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
            isLabled={true}
          />
          <Input
            id="titleInput"
            type="text"
            name="title"
            placeholder="Post title"
            register={{
              ...register('title', {
                ...validateRules.postValidationRules.titleValidation,
              }),
            }}
            errorMessage={errors}
            className="text-lg"
            isLabled={true}
          />
          <Input
            id="postDescriptionInput"
            type="text"
            name="description"
            placeholder="What's this post about?"
            register={{
              ...register('description', {
                ...validateRules.postValidationRules.descriptionValidation,
              }),
            }}
            errorMessage={errors}
            isLabled={true}
          />

          <Textarea
            id="fullTextInput"
            rows="7"
            name="text"
            placeholder="Write your post"
            register={{
              ...register('text', {
                ...validateRules.postValidationRules.fullTextValidation,
              }),
            }}
            errorMessage={errors}
            isLabled={true}
          />
          <Button disabled={buttonDisabled}>Update Post</Button>
        </div>
      </form>
    </div>
  );
};
