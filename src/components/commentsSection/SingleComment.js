import axios from 'axios';
import { useEffect, useState } from 'react';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { timeFromNow } from '../../helpers/convertDate';
import { UserBar } from '../../UI/UserBar';

export const SingleComment = ({ commentData }) => {
  const [creatorOfCommentData, setCreatorOfCommentData] = useState({
    name: '',
    avatar: '',
    id: '',
  });
  const [dateCommentCreated, setDateCommentCreated] = useState('');

  const getUserById = async () => {
    try {
      const response = await axios.get(`/users/${commentData.commentedBy}`);
      setCreatorOfCommentData({
        name: response.data.name,
        avatar: imgSrc(response.data),
        id: response.data._id,
      });
    } catch (error) {}
  };

  const setLikeForComment = async () => {
    await axios.put(`/comments/like/${commentData._id}`);
  };

  useEffect(() => {
    getUserById();
    setDateCommentCreated(timeFromNow(commentData.dateCreated));
  }, []);

  return (
    <>
      {creatorOfCommentData ? (
        <>
          <UserBar
            creatorData={creatorOfCommentData}
            dateCreated={dateCommentCreated}
            likesInfo={commentData.likes}
            putLike={setLikeForComment}
          />
          <p className="break-words">{commentData.text}</p>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
