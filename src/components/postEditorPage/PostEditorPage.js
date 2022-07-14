import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import axios from '../../api/axios';
import validateRules from '../../helpers/validateRules';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';

export const PostEditorPage = () => {
  const [errorFromServer, setErrorFromServer] = useState(null);
  const params = useParams();

  const currentPost = useSelector((state) => state.posts.singlePost);

  const postId = params.id;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      // image: new File(['foo'], 'https://tl.rulate.ru/i/book/19/10/18925.jpg'),
      title: currentPost.title,
      description: currentPost.description,
      text: currentPost.fullText,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    await updatePost(formData);
    if (formData.image.length) await updatePostImage(formData.image);
    navigate(`/post/${currentPost.title}`);
  };

  const updatePost = async (data) => {
    try {
      await axios.patch(`/posts/${postId}`, {
        title: data.title,
        description: data.description,
        fullText: data.fullText,
      });
    } catch (error) {
      setErrorFromServer(error.response.data.error);
    }
  };

  const updatePostImage = async (files) => {
    console.log('image', files);

    const file = files[0];
    let formData = new FormData();
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

  const buttonDisabled = Object.keys(errors).length ? true : false;

  return (
    <div className="flex justify-center mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="flex flex-col">
          <h1>Update your post</h1>
          {errorFromServer && (
            <div className="errorFromServer">{errorFromServer}</div>
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
          <Input
            id="fullTextInput"
            type="text"
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
