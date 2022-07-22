import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import axios from '../../api/axios';
import { Button } from '../../UI/Button';
import { Loader } from '../../UI/Loader';
import { CommentsSection } from '../comments/CommentsSection';
import { Post } from './Post';

export const SinglePostPage = () => {
  const [postToRender, setPostToRender] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();

  const getNecessaryPost = async () => {
    try {
      const response = await axios.get(`/posts/${params.postId}`);
      setPostToRender(response.data);
    } catch (error) {}
  };

  const deletePostById = async () => {
    try {
      await axios.delete(`/posts/${postToRender._id}`);
      console.log('Successfully deleted');
      navigate(`/profile/${currentUser._id}/${currentUser.name}`);
    } catch (error) {}
  };

  // проверка того, кто создал пост. Если открытый пост создал залогиненый юзер, то далее будут отображены кнопки редактирования и удаления
  const checkCreatorOfPost = () => {
    if (currentUser?._id === postToRender?.postedBy) return true;
    return false;
  };

  const isShowedComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    getNecessaryPost();
  }, []);

  return (
    <>
      {postToRender ? (
        <>
          <div className="min-width-640">
            <Post
              post={postToRender}
              isSinglePostPage={true}
              deletePostById={deletePostById}
              IsCreatorCurrentUser={checkCreatorOfPost()}
            />
          </div>
          <div className="flex justify-center min-width-640">
            <div className="w-1/2 flex flex-col mb-4">
              <div className="self-start mt-4">
                <Button
                  onClick={isShowedComments}
                  className="px-2 py-1 text-sm"
                >
                  Comments
                </Button>
              </div>
              <hr className="mt-3 border-gray-400" />
            </div>
          </div>
          {showComments ? <CommentsSection /> : null}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
