import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { convertDate } from '../../helpers/convertDate';

export const Post = (props) => {
  const [creatorData, setCreatorData] = useState({ name: '', avatar: '' });
  const [postLikesInfo, setPostLikesInfo] = useState({
    isPostLikedByCurrentUser: false,
    amountOfPostLikes: 0,
  });
  const [dateCreated, setDateCreated] = useState('');

  const currentUser = useSelector((state) => state.user.user);

  // const postTitleWithoutSpaces = props.post.title.replace(/\s/g, '-');

  // Используется для того, чтобы получить необходимые данные создателя поста для дальнейшего рендера
  const getCreatorNameById = async (id) => {
    try {
      const response = await axios.get(`/users/${id}`);
      setCreatorData({
        name: response.data.name,
        avatar: imgSrc(response.data),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const putLikeForPost = async () => {
    try {
      await axios.put(`/posts/like/${props.post._id}`);
      await getPostById();
    } catch (error) {}
  };

  // Для того, чтобы заново получить пост, которому был поставлен лайк и обновить их количество
  const getPostById = async () => {
    try {
      const response = await axios.get(`/posts/${props.post._id}`);
      setPostLikesInfo({
        isPostLikedByCurrentUser: !postLikesInfo.isPostLikedByCurrentUser,
        amountOfPostLikes: response.data.likes.length,
      });
    } catch (error) {}
  };

  // Узнать поставил ли текущий(залогиненый) пользователь лайк посту
  const findCurrentUserLikesForPosts = (likesOfAllUsers) => {
    if (currentUser) {
      const isLiked = likesOfAllUsers.includes(currentUser._id);
      return isLiked;
    }
    return false;
  };

  useEffect(() => {
    if (props.post.postedBy) getCreatorNameById(props.post.postedBy);
    setDateCreated(convertDate(props.post.dateCreated));
    setPostLikesInfo({
      isPostLikedByCurrentUser: findCurrentUserLikesForPosts(props.post.likes),
      amountOfPostLikes: props.post.likes.length,
    });
  }, []);

  return (
    <div className="m-10">
      <div>
        <div className="flex justify-between">
          <div className="self-start">
            <div className="flex">
              <Link to={`/profile/${creatorData.name}`}>
                <div>
                  <img
                    className="mediumAvatar"
                    src={
                      creatorData.avatar
                        ? creatorData.avatar
                        : imgSrc('No such user')
                    }
                  />
                </div>
              </Link>
              <div className="flex flex-col items-start">
                <div className="self-start">
                  <Link to={`/profile/${creatorData.name}`}>
                    <p className="text-emerald-500">
                      {creatorData.name ? creatorData.name : 'Deleted user'}
                    </p>
                  </Link>
                </div>
                <p>{dateCreated}</p>
              </div>
            </div>
          </div>
          <div className="self-end">
            <button
              className={`${
                postLikesInfo.isPostLikedByCurrentUser
                  ? 'likesButton bg-emerald-500 text-white'
                  : 'likesButton'
              }`}
              onClick={putLikeForPost}
            >
              <div className="flex justify-center">
                <div>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>{postLikesInfo.amountOfPostLikes}</div>
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start">
          {/* <Link to={`/post/${postTitleWithoutSpaces}`}> */}
          <Link to={`/post/${props.post._id}`}>
            <div className="flex flex-col ">
              <div className="self-start">
                <h2 className="text-xl">{props.post.title}</h2>
              </div>
              <div className="self-start">
                <p>{props.post.description}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* <hr className="border border-zinc-300 mt-3" /> */}
    </div>
  );
};
