import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axios from '../../api/axios';
import { Post } from '../post/Post';

export const SinglePostPage = () => {
  const [postToRender, setPostToRender] = useState(null);
  const currentUser = useSelector((state) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();

  // получаю title после из URL и по нему ищу пост
  const searchPostByTitle = async () => {
    const title = params.title;
    try {
      const response = await axios.get('/posts', {
        params: {
          search: title,
        },
      });
      await getNecessaryPost(response.data.data[0]._id);
    } catch (error) {}
  };

  // получив нужный пост беру его id и делаю следующий запрос, который даёт всю инфу про пост
  const getNecessaryPost = async (postId) => {
    try {
      const response = await axios.get(`/posts/${postId}`);
      setPostToRender(response.data);
    } catch (error) {}
  };

  const deletePostById = async () => {
    try {
      axios.delete(`/posts/${postToRender._id}`);
      console.log('Successfully deleted');
      navigate(`/profile/${currentUser.name}`);
    } catch (error) {}
  };

  // проверка того, кто создал пост. Если открытый пост создал залогиненый юзер, то далее будут отображены кнопки редактирования и удаления
  const checkCreatorOfPost = () => {
    if (currentUser?._id === postToRender?.postedBy) return true;
    return false;
  };

  useEffect(() => {
    searchPostByTitle();
  }, []);

  return (
    <>
      {postToRender ? (
        <Post
          post={postToRender}
          isSinglePostPage={true}
          deletePostById={deletePostById}
          IsCreatorCurrentUser={checkCreatorOfPost()}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
