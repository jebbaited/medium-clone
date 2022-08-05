import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const getNecessaryPost = useCallback(async () => {
    try {
      const response = await axios.get(`/posts/${params.postId}`);
      if (!response.data) return;
      setPostToRender(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [params.postId]);

  const deletePostById = useCallback(async () => {
    try {
      await axios.delete(`/posts/${postToRender._id}`);
      navigate(`/profile/${currentUser._id}/${currentUser.name}`);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id, currentUser?.name, navigate, postToRender?._id]);

  // проверка того, кто создал пост. Если открытый пост создал залогиненый юзер, то далее будут отображены кнопки редактирования и удаления
  const IsCreatorCurrentUser = useMemo(
    () => !!(currentUser?._id === postToRender?.postedBy),
    [currentUser?._id, postToRender?.postedBy]
  );

  const isShowedComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    getNecessaryPost();
  }, [getNecessaryPost]);

  return (
    <>
      {postToRender ? (
        <>
          <div className="min-width-640">
            <Post
              post={postToRender}
              isSinglePostPage={true}
              deletePostById={deletePostById}
              IsCreatorCurrentUser={IsCreatorCurrentUser}
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
