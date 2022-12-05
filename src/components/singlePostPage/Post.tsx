import React, { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { saveSinglePost } from '../../store/postsSlice';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { convertDate } from '../../helpers/convertDate';
import { postImgSrc } from '../../helpers/choosePostImage';
import { UserBar } from '../../UI/UserBar';
import { Button } from '../../UI/Button';
import Modal from '../../UI/Modal';
import { postAPI } from '../../api/postAPI';
import { getUserById } from '../../store/userSlice';
import { ILikeInfo, IPost, IUser } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

interface Props {
  post: IPost;
  isSinglePostPage?: boolean;
  isCreatorCurrentUser?: boolean;
  deletePostById?: () => void;
}

export const Post: FC<Props> = ({
  post,
  isSinglePostPage,
  isCreatorCurrentUser,
  deletePostById,
}) => {
  const [creatorData, setCreatorData] = useState<IUser>({
    name: '',
    avatar: '',
    _id: '',
  });
  const [postLikesInfo, setPostLikesInfo] = useState<ILikeInfo>({
    isLikedByCurrentUser: false,
    amountOfLikes: 0,
  });
  const [dateCreated, setDateCreated] = useState<string>('');

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.user);
  const allUsers = useAppSelector((state) => state.user.allUsers);

  const getCreatorNameById = useCallback(
    (userId: string): void => {
      const postCreatorFromStore = allUsers.filter(
        (user: IUser) => user._id === userId
      );
      if (postCreatorFromStore.length > 0) {
        setCreatorData({
          name: postCreatorFromStore[0].name,
          avatar: imgSrc(postCreatorFromStore[0]),
          _id: postCreatorFromStore[0]._id,
        });
        return;
      }
      dispatch(getUserById(userId));
    },
    [allUsers, dispatch]
  );

  const putLikeForPost = useCallback(async (): Promise<void> => {
    if (currentUser) {
      try {
        await postAPI.setLikeForPost(post._id);
        setPostLikesInfo({
          isLikedByCurrentUser: !postLikesInfo.isLikedByCurrentUser,
          amountOfLikes: postLikesInfo.isLikedByCurrentUser
            ? postLikesInfo.amountOfLikes - 1
            : postLikesInfo.amountOfLikes + 1,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    currentUser,
    post._id,
    postLikesInfo.amountOfLikes,
    postLikesInfo.isLikedByCurrentUser,
  ]);

  // Узнать поставил ли текущий(залогиненый) пользователь лайк посту
  const findCurrentUserLikesForPosts = useCallback(
    (likesOfAllUsers: string[]): boolean =>
      currentUser && likesOfAllUsers.includes(currentUser._id),
    [currentUser]
  );

  // если компонент вызван для рендера открытого поста, то сохранаяю этот пост в сторе, чтобы вывести дефолтные значения инпутов
  const isSinglePostRender = useCallback((): void => {
    if (isSinglePostPage) dispatch(saveSinglePost(post));
  }, [dispatch, isSinglePostPage, post]);

  const createMarkup = (html: string): { __html: string } => {
    return { __html: html };
  };

  useEffect(() => {
    if (post.postedBy) getCreatorNameById(post.postedBy);
    setDateCreated(convertDate(post.dateCreated));
    setPostLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForPosts(post.likes),
      amountOfLikes: post.likes.length,
    });
    isSinglePostRender();
  }, [
    getCreatorNameById,
    isSinglePostRender,
    findCurrentUserLikesForPosts,
    post,
  ]);

  return (
    <>
      {isSinglePostPage ? (
        <div className="flex flex-col items-center">
          <div className="w-1/2">
            <UserBar
              creatorData={creatorData}
              dateCreated={dateCreated}
              likesInfo={postLikesInfo}
              putLike={putLikeForPost}
            />
          </div>
          {isCreatorCurrentUser && (
            <div className="flex w-1/2 mt-2">
              <Link to={`/post/editor/${post._id}`}>
                <Button className="mr-4 px-4 py-2 text-sm">Edit Post</Button>
              </Link>

              <Modal
                deleteTarget="post"
                deleteUser={deletePostById}
                className="mb-0 px-4 py-2 w-28 text-sm"
              />
            </div>
          )}

          <img
            src={postImgSrc(post.image)}
            className="mt-4 medium-post-image"
            alt="nothing"
          />
          <div className="w-1/2 break-words">
            <div className="flex flex-col items-start text-left">
              <div className="w-full">
                <h2>{post.title}</h2>
                <p className="lg:text-lg">{post.description}</p>
                <p className="mt-6">{post.fullText}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-3 lg:m-8">
          <div className="min-width-230">
            <UserBar
              creatorData={creatorData}
              dateCreated={dateCreated}
              likesInfo={postLikesInfo}
              putLike={putLikeForPost}
            />
            <div className="flex flex-col items-start">
              <Link
                to={`/post/${post._id}/${post.title}`}
                className="break-words w-full text-left"
              >
                <div className="flex flex-col">
                  <div className="self-start w-full">
                    <h2 dangerouslySetInnerHTML={createMarkup(post.title)} />
                  </div>
                  <div className="self-start w-full">
                    <p
                      className="lg:text-lg"
                      dangerouslySetInnerHTML={createMarkup(post.description)}
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
