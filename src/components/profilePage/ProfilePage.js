import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { imgSrc } from '../../helpers/chooseAvatarImage';
import axios from '../../api/axios';
import { Post } from '../singlePostPage/Post';
import { Pagination } from '../pagination/Pagination';
import { savePaginationInfo, savePosts } from '../../store/postsSlice';
import { Loader } from '../../UI/Loader';

export const ProfilePage = () => {
  const [chosenUserInfo, setChosenUserInfo] = useState(null);

  const currentUser = useSelector((state) => state.user.user);
  const userPosts = useSelector((state) => state.posts.posts);

  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useSelector((state) => state.posts.paginationInfo.total);

  const dispatch = useDispatch();
  const params = useParams();

  const getPostsOfUser = async () => {
    try {
      const response = await axios.get('/posts', {
        params: {
          postedBy: params.userId,
        },
      });
      dispatch(savePaginationInfo(response.data.pagination));
      dispatch(savePosts(response.data.data.reverse()));
    } catch (error) {}
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`/users/${params.userId}`);
      setChosenUserInfo({ ...response.data });
    } catch (error) {}
  };

  useEffect(() => {
    getPostsOfUser();
    getUserInfo();
  }, [params.userId]);

  return (
    <>
      {chosenUserInfo ? (
        <>
          <div className="bg-gray-100 h-56 flex flex-col justify-center min-width-640">
            <div className="flex flex-col items-center">
              <img
                src={imgSrc(chosenUserInfo)}
                className="rounded-full object-cover h-16 w-16 mb-1 lg:h-24 lg:w-24 lg:mb-3"
              />
              <h2 className="font-bold">{chosenUserInfo.name}</h2>
              <p className="mb-2">{chosenUserInfo.details}</p>
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
                  if (post.postedBy === chosenUserInfo._id)
                    return <Post post={post} key={post._id} />;
                })}
              </div>

              {lastPageNumber > 1 && (
                <div className="self-center">
                  <Pagination chosenUserInfo={chosenUserInfo} />
                </div>
              )}

              {total < 1 && (
                <p className="mt-10">Haven't posted any post yet...</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
