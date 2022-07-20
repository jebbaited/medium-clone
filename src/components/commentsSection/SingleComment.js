import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { timeFromNow } from '../../helpers/convertDate';
import { Button } from '../../UI/Button';
import { Textarea } from '../../UI/Textarea';
import { UserBar } from '../../UI/UserBar';
import { CommentsSection } from './CommentsSection';

export const SingleComment = ({
  commentData,
  deleteComment,
  saveChanges,
  replyToComment,
  isReplied,
}) => {
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
  const [editedCommentText, setEditedCommentText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

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
    saveChanges(commentData._id, editedCommentText);
    setIsEditing(false);
  };

  const replyClicked = () => {
    setIsReplying(!isReplying);
    replyToComment();
  };

  const handleEditingComment = (event) => {
    setEditedCommentText(event.target.value);
  };

  useEffect(() => {
    getUserById();
    setDateCommentCreated(timeFromNow(commentData.dateCreated));
    setCommentLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForComment(commentData.likes),
      amountOfLikes: commentData.likes.length,
    });
    setEditedCommentText(commentData.text);
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

          {isEditing ? (
            <>
              <Textarea
                id="editCommentField"
                rows="2"
                name="editComment"
                placeholder="Leave a comment..."
                value={editedCommentText}
                onChange={handleEditingComment}
              />

              <div className="flex justify-end mb-1">
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
          ) : (
            <p className="break-words text-left text-black mb-1">
              {commentData.text}
            </p>
          )}
          {currentUser._id === commentData.commentedBy && !isEditing ? (
            <>
              <div className="flex justify-between">
                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs mr-2 hover:bg-white"
                  onClick={replyClicked}
                  disabled={isReplied}
                >
                  Reply
                </Button>

                <div className="flex">
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
              </div>
            </>
          ) : (
            <div className="text-start">
              <Button
                className="px-0 py-0 bg-white text-gray-400 text-xs mr-2 hover:bg-white"
                onClick={replyClicked}
                disabled={isReplied}
              >
                Reply
              </Button>
            </div>
          )}
          {isReplying ? (
            <>
              <div className="w-full">
                <CommentsSection
                  commentIdToReply={commentData._id}
                  isReplied={true}
                />
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
