import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { CommentsSection } from '../comments/CommentsSection';
import { useAppSelector } from '../../hooks/hooks';
import { postAPI } from '../../api/postAPI';
import { IPost } from '../../types/types';
import { Loader } from '../../UI/Loader';
import { Button } from '../../UI/Button';
import { Post } from './Post';

export const SinglePostPage = () => {
  const [postToRender, setPostToRender] = useState<IPost>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const currentUser = useAppSelector((state) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();

  const getNecessaryPost = useCallback(async (): Promise<IPost> => {
    try {
      const data: IPost = await postAPI.getPostsById(params.postId);
      if (!data) return;
      setPostToRender(data);
    } catch (error) {
      console.log(error);
    }
  }, [params.postId]);

  const deletePostById = useCallback(async (): Promise<void> => {
    try {
      await postAPI.deletePostById(postToRender._id);
      navigate(`/profile/${currentUser._id}/${currentUser.name}`);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser?._id, currentUser?.name, navigate, postToRender?._id]);

  // проверка того, кто создал пост. Если открытый пост создал залогиненый юзер, то далее будут отображены кнопки редактирования и удаления
  const isCreatorCurrentUser: boolean = useMemo(
    () => !!(currentUser?._id === postToRender?.postedBy),
    [currentUser?._id, postToRender?.postedBy]
  );

  const isShowedComments = (): void => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    getNecessaryPost();
  }, [getNecessaryPost]);

  return (
    <>
      {postToRender ? (
        <div className={showComments ? '' : 'h-[calc(100vh-56px)]'}>
          <div className="min-width-640">
            <Post
              post={postToRender}
              isSinglePostPage={true}
              deletePostById={deletePostById}
              isCreatorCurrentUser={isCreatorCurrentUser}
            />
          </div>
          <div className="flex justify-center min-width-640">
            <div className="w-1/2 flex flex-col mb-4">
              <div className="self-start mt-4">
                <Button
                  onClick={isShowedComments}
                  className="px-2 py-1 text-sm"
                  dataTestId="show-comments-button"
                >
                  Comments
                </Button>
              </div>
              <hr className="mt-3 border-gray-400" />
            </div>
          </div>
          {showComments && <CommentsSection />}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
