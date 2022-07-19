import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { timeFromNow } from '../../helpers/convertDate';
import { Button } from '../../UI/Button';
import { Textarea } from '../../UI/Textarea';
import { UserBar } from '../../UI/UserBar';

export const SingleComment = ({ commentData, deleteComment, saveChanges }) => {
  const [creatorOfCommentData, setCreatorOfCommentData] = useState({
    name: '',
    avatar: '',
    id: '',
  });
  const [commentLikesInfo, setCommentLikesInfo] = useState({
    isLikedByCurrentUser: false,
    amountOfLikes: 0,
  });
  const [dateCommentCreated, setDateCommentCreated] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentText, setEditCommentText] = useState('');

  const currentUser = useSelector((state) => state.user.user);

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
    setCommentLikesInfo({
      isLikedByCurrentUser: !commentLikesInfo.isLikedByCurrentUser,
      amountOfLikes: commentLikesInfo.isLikedByCurrentUser
        ? commentLikesInfo.amountOfLikes - 1
        : commentLikesInfo.amountOfLikes + 1,
    });
  };

  const findCurrentUserLikesForComment = (likesOfAllUsers) => {
    if (currentUser) {
      const isLiked = likesOfAllUsers.includes(currentUser._id);
      return isLiked;
    }
    return false;
  };

  const editComment = () => {
    setIsEditing(!isEditing);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveAndCancel = () => {
    saveChanges(commentData._id, editCommentText);
    setIsEditing(false);
  };

  const handleEditingComment = (event) => {
    setEditCommentText(event.target.value);
  };

  useEffect(() => {
    getUserById();
    setDateCommentCreated(timeFromNow(commentData.dateCreated));
    setCommentLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForComment(commentData.likes),
      amountOfLikes: commentData.likes.length,
    });
    setEditCommentText(commentData.text);
  }, []);

  return (
    <>
      {creatorOfCommentData ? (
        <div className="mb-4 flex flex-col">
          <UserBar
            creatorData={creatorOfCommentData}
            dateCreated={dateCommentCreated}
            likesInfo={commentLikesInfo}
            putLike={setLikeForComment}
          />
          {currentUser._id === commentData.commentedBy && !isEditing ? (
            <>
              <p className="break-words text-left text-black">
                {commentData.text}
              </p>

              <div className="flex justify-end">
                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs mr-2 hover:bg-white"
                  onClick={editComment}
                >
                  Edit
                </Button>

                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white"
                  onClick={() => deleteComment(commentData._id)}
                >
                  Delete
                </Button>
              </div>
            </>
          ) : null}
          {isEditing ? (
            <>
              <Textarea
                value={editCommentText}
                onChange={handleEditingComment}
              />

              <div className="flex justify-end">
                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs mr-2 hover:bg-white"
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>

                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white"
                  onClick={saveAndCancel}
                >
                  Save
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
