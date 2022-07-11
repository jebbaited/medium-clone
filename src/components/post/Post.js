import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { convertDate } from '../../helpers/convertDate';

export const Post = (props) => {
  const [creatorData, setCreatorData] = useState({ name: '', avatar: '' });
  const [postData, setPostData] = useState({ createdDate: '', likes: 0 });

  const postTitleWithoutSpaces = props.post.title.replace(/\s/g, '-');

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

  const setLikeForPost = async () => {
    try {
      await axios.put(`/posts/like/${props.post._id}`);
      console.log('liked');
      setPostData({ ...postData, likes: +postData.likes + 1 });
    } catch (error) {}
  };

  const getPostById = async () => {
    try {
      const response = await axios.get(`/posts/${props.post._id}`);
      console.log('here', response.data);
      setPostData({ ...postData, likes: response.data.likes.length });
    } catch (error) {}
  };

  useEffect(() => {
    if (props.post.postedBy) getCreatorNameById(props.post.postedBy);
    setPostData({
      createdDate: convertDate(props.post.dateCreated),
      likes: props.post.likes.length,
    });
  }, [props]);

  useEffect(() => {
    getPostById();
  }, [postData.likes]);

  return (
    <div className="m-6">
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
                <p>{postData.createdDate}</p>
              </div>
            </div>
          </div>
          <div className="self-end">
            <button
              className="text-emerald-500 text-sm border border-emerald-500 py-1 px-2 w-16 rounded-md hover:text-white hover:bg-emerald-500"
              onClick={setLikeForPost}
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
                <div>{postData.likes}</div>
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Link to={`/article/${postTitleWithoutSpaces}`}>
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
      <hr className="border border-zinc-300 mt-3" />
    </div>
  );
};
