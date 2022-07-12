import { useForm } from 'react-hook-form';
import validateRules from '../../helpers/validateRules';
import { Button } from '../../UI/Button';
import { Input } from '../../UI/Input';
import axios from '../../api/axios';

export const CreatePost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (formData) => {
    await createPost(formData);
  };

  const createPost = async (data) => {
    try {
      await axios.post('/posts', {
        title: data.title,
        description: data.description,
        fullText: data.fullText,
      });
    } catch (error) {}
  };

  const buttonDisabled = Object.keys(errors).length ? true : false;

  return (
    <div className="flex justify-center mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2">
        <div className="flex flex-col">
          <h1>Create a new post!</h1>
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
          <Input
            id="fullTextInput"
            type="text"
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
