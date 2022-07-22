import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from '../../api/axios';
import { reSaveOnePost, saveSinglePost } from '../../store/postsSlice';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { convertDate } from '../../helpers/convertDate';
import { postImgSrc } from '../../helpers/choosePostImage';
import { UserBar } from '../../UI/UserBar';
import { Button } from '../../UI/Button';
import Modal from '../../UI/Modal';

export const Post = (props) => {
  const [creatorData, setCreatorData] = useState({
    name: '',
    avatar: '',
    id: '',
  });
  const [postLikesInfo, setPostLikesInfo] = useState({
    isLikedByCurrentUser: false,
    amountOfLikes: 0,
  });
  const [dateCreated, setDateCreated] = useState('');

  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Используется для того, чтобы получить необходимые данные создателя поста для дальнейшего рендера
  const getCreatorNameById = async (id) => {
    try {
      const response = await axios.get(`/users/${id}`);
      setCreatorData({
        name: response.data.name,
        avatar: imgSrc(response.data),
        id: response.data._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const putLikeForPost = async () => {
    if (currentUser) {
      try {
        await axios.put(`/posts/like/${props.post._id}`);
        await getPostById();
      } catch (error) {}
    }
  };

  // Для того, чтобы заново получить пост, которому был поставлен лайк и обновить их количество
  const getPostById = async () => {
    try {
      const response = await axios.get(`/posts/${props.post._id}`);
      setPostLikesInfo({
        isLikedByCurrentUser: !postLikesInfo.isLikedByCurrentUser,
        amountOfLikes: response.data.likes.length,
      });
      dispatch(reSaveOnePost(response.data));
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

  // если компонент вызван для рендера открытого поста, то сохранаяю этот пост в сторе, чтобы вывести дефолтные значения инпутов
  const isSinglePostRender = () => {
    if (props.isSinglePostPage) dispatch(saveSinglePost(props.post));
  };

  useEffect(() => {
    if (props.post.postedBy) getCreatorNameById(props.post.postedBy);
    setDateCreated(convertDate(props.post.dateCreated));
    setPostLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForPosts(props.post.likes),
      amountOfLikes: props.post.likes.length,
    });
    isSinglePostRender();
  }, []);

  return (
    <>
      {props.isSinglePostPage ? (
        <div className="flex flex-col items-center">
          <div className="w-1/2">
            <UserBar
              creatorData={creatorData}
              dateCreated={dateCreated}
              likesInfo={postLikesInfo}
              putLike={putLikeForPost}
            />
          </div>
          {props.IsCreatorCurrentUser ? (
            <div className="flex w-1/2 mt-2">
              <Link to={`/post/editor/${props.post._id}`}>
                <Button className="mr-4 px-4 py-2 text-sm">Edit Post</Button>
              </Link>

              <Modal
                deleteTarget="post"
                deleteUser={props.deletePostById}
                className="mb-0 px-4 py-2 w-28 text-sm"
              />
            </div>
          ) : null}

          <img
            src={postImgSrc(props.post.image)}
            className="mt-4 medium-post-image"
          />
          <div className="w-1/2 break-words">
            <div className="flex flex-col items-start text-left">
              <div className="w-full">
                <h2>{props.post.title}</h2>
                <p className="text-lg">{props.post.description}</p>
                <p className="mt-6">{props.post.fullText}</p>
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
                to={`/post/${props.post._id}/${props.post.title}`}
                className="break-words w-full text-left"
              >
                <div className="flex flex-col">
                  <div className="self-start w-full">
                    <h2>{props.post.title}</h2>
                  </div>
                  <div className="self-start w-full">
                    <p>{props.post.description}</p>
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
