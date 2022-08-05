import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { imgSrc } from '../../helpers/chooseAvatarImage';
import axios from '../../api/axios';
import { Post } from '../singlePostPage/Post';
import {
  savePaginationInfo,
  savePosts,
  setInitialPostsState,
} from '../../store/postsSlice';
import { Loader } from '../../UI/Loader';
import { usePagination } from '../../hooks/usePagination';
import { PaginationBar } from '../../UI/PaginationBar';
import { countPostsSkip } from '../../helpers/countPostsToSkip';

export const ProfilePage = () => {
  const [chosenUserInfo, setChosenUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state.user.user);
  const userPosts = useSelector((state) => state.posts.posts);

  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useSelector((state) => state.posts.paginationInfo.total);
  const limit = useSelector((state) => state.posts.paginationInfo.limit);

  const dispatch = useDispatch();
  const params = useParams();

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination();

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/users/${params.userId}`);
      setChosenUserInfo({ ...response.data });
    } catch (error) {}
  }, [params.userId]);

  const getPostsByParams = useCallback(
    async (pageToSkip) => {
      const currentPage = lastPageNumber - (pageToSkip - 1 || 0);
      const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
      const limitForLastPosts =
        skip === 0 ? limit - (lastPageNumber * limit - total) : 0;

      try {
        setIsLoading(true);
        const response = await axios.get('/posts', {
          params: {
            postedBy: params.userId,
            limit: limitForLastPosts || 10,
            skip: skip || 0,
          },
        });
        if (!response.data) return;

        dispatch(savePosts(response.data.data.reverse()));

        dispatch(
          savePaginationInfo({
            lastPageNumber: lastPageNumber,
            total: response.data.pagination.total,
            limit: 10,
          })
        );
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, lastPageNumber, limit, params.userId, total]
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
        <>
          <div className="bg-gray-100 h-56 flex flex-col justify-center min-width-640">
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
                {userPosts?.map((post) => {
                  if (post.postedBy !== chosenUserInfo._id) return null;
                  return <Post post={post} key={post._id} />;
                })}
              </div>

              {lastPageNumber > 1 && (
                <div className="self-center">
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
              )}

              {total < 1 && (
                <p className="mt-10">Haven't posted any post yet...</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
