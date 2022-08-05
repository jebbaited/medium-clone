import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

import axios from '../../api/axios';
import validateRules from '../../helpers/validateRules';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import { Textarea } from '../../UI/Textarea';

export const CreatePostPage = () => {
  const [errorFromServer, setErrorFromServer] = useState(null);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (formData) => {
    await createPost(formData);
    navigate(`/profile/${currentUser._id}/${currentUser.name}`);
  };

  const createPost = async (data) => {
    try {
      await axios.post('/posts', {
        title: data.title,
        description: data.description,
        fullText: data.fullText,
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
          <h1>Create a new post!</h1>
          {errorFromServer && (
            <div className="error-from-server">{errorFromServer}</div>
          )}
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
          />

          <Textarea
            id="fullTextInput"
            rows="7"
            name="fullText"
            placeholder="Write your post"
            register={{
              ...register('fullText', {
                ...validateRules.postValidationRules.fullTextValidation,
              }),
            }}
            errorMessage={errors}
          />
          <Button disabled={buttonDisabled}>Publish Post</Button>
        </div>
      </form>
    </div>
  );
};
