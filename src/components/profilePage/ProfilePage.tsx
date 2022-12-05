import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { Post } from '../singlePostPage/Post';
import { getAllPosts, setInitialPostsState } from '../../store/postsSlice';
import { Loader } from '../../UI/Loader';
import { usePagination } from '../../hooks/usePagination';
import { PaginationBar } from '../../UI/PaginationBar';
import { countPostsSkip } from '../../helpers/countPostsToSkip';
import { getUserById } from '../../store/userSlice';
import { IPost, IUser } from '../../types/types';

export const ProfilePage = () => {
  const [chosenUserInfo, setChosenUserInfo] = useState<IUser>(null);

  const currentUser = useAppSelector((state) => state.user.user);
  const userPosts = useAppSelector((state) => state.posts.posts);
  const allUsers = useAppSelector((state) => state.user.allUsers);

  const lastPageNumber = useAppSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useAppSelector((state) => state.posts.paginationInfo.total);
  const limit = useAppSelector((state) => state.posts.paginationInfo.limit);
  const isLoading = useAppSelector((state) => state.posts.isLoading);

  const dispatch = useAppDispatch();

  const params = useParams();

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination(lastPageNumber);

  const getUserInfo = useCallback((): void => {
    const userProfileFromStore = allUsers.filter(
      (user: IUser) => user._id === params.userId
    );
    if (userProfileFromStore.length > 0) {
      setChosenUserInfo({ ...userProfileFromStore[0] });
      return;
    } else {
      dispatch(getUserById(params.userId));
    }
  }, [allUsers, dispatch, params.userId]);

  const getPostsByParams = useCallback(
    (pageToSkip: string): void => {
      const currentPage = +lastPageNumber - (+pageToSkip - 1 || 0);
      const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
      const limitForLastPosts =
        +skip === 0 ? +limit - (+lastPageNumber * +limit - +total) : 0;

      const userId = params.userId;

      dispatch(getAllPosts({ limitForLastPosts, skip, userId }));
    },
    [dispatch, lastPageNumber, limit, total, params.userId]
  );

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, params.userId]);

  useEffect(() => {
    dispatch(setInitialPostsState());
    getPostsByParams(params.pageNumber);
  }, [dispatch, getPostsByParams, params.pageNumber, total]);

  return (
    <>
      {!chosenUserInfo && <Loader />}
      {chosenUserInfo && (
        <div
          className={`${userPosts?.length < 5 ? 'h-[calc(100vh-56px)]' : ''}`}
        >
          <div className="bg-gray-100 h-56 flex flex-col justify-center min-width-640 dark:bg-neutral-900">
            <div className="flex flex-col items-center">
              <img
                src={imgSrc(chosenUserInfo)}
                className="rounded-full object-cover h-16 w-16 mb-1 lg:h-24 lg:w-24 lg:mb-3"
                alt="nothing"
              />
              <h2 className="font-bold">{chosenUserInfo.name}</h2>
              <div className="w-3/4">
                <p className="mb-2 truncate">{chosenUserInfo.details}</p>
              </div>
            </div>
            {chosenUserInfo._id === currentUser?._id ? (
              <div className="self-end w-1/2">
                <Link to="/settings">
                  <button className="border border-gray-400 px-2 py-1 text-gray-400 rounded-md hover:bg-slate-300 text-sm lg:text-base">
                    Edit Profile Settings
                  </button>
                </Link>
              </div>
            ) : null}
          </div>
          <div className="flex justify-center min-width-640">
            <div className="flex flex-col justify-center w-1/2 mt-8">
              <h1>User's posts</h1>
              <div className="w-full self-center">
                {!userPosts && <Loader />}
                {userPosts?.map((post: IPost) => {
                  if (post.postedBy !== chosenUserInfo._id) return null;
                  return <Post post={post} key={post._id} />;
                })}
              </div>

              <div
                className={
                  !userPosts?.length || userPosts.length < 10
                    ? 'invisible'
                    : 'self-center'
                }
              >
                <PaginationBar
                  page={page}
                  firstPage={firstPage}
                  prevPage={prevPage}
                  nextPage={nextPage}
                  lastPage={lastPage}
                  disableBackButton={disableBackButton}
                  disableNextButton={disableNextButton}
                  lastPageNumber={lastPageNumber}
                  isLoading={isLoading}
                  isNavigateToProfile={true}
                />
              </div>

              {total < 1 && (
                <p className="mt-10">Haven't posted any post yet...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
