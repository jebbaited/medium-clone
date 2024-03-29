import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CommentsSection } from './CommentsSection';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { timeFromNow } from '../../helpers/convertDate';
import { Button } from '../../UI/Button';
import { Loader } from '../../UI/Loader';
import { Textarea } from '../../UI/Textarea';
import { UserBar } from '../../UI/UserBar';

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

  const findCurrentUserLikesForComment = useCallback(
    (likesOfAllUsers) =>
      currentUser && likesOfAllUsers.includes(currentUser._id),
    [currentUser]
  );

  const getUserById = useCallback(async () => {
    try {
      const response = await axios.get(`/users/${commentData.commentedBy}`);
      setCreatorOfCommentData({
        name: response.data.name,
        avatar: imgSrc(response.data),
        id: response.data._id,
      });
    } catch (error) {
      console.log(error);
    }
  }, [commentData]);

  const setLikeForComment = useCallback(async () => {
    if (currentUser) {
      try {
        await axios.put(`/comments/like/${commentData._id}`);
        setCommentLikesInfo({
          isLikedByCurrentUser: !commentLikesInfo.isLikedByCurrentUser,
          amountOfLikes: commentLikesInfo.isLikedByCurrentUser
            ? commentLikesInfo.amountOfLikes - 1
            : commentLikesInfo.amountOfLikes + 1,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    commentData._id,
    commentLikesInfo.amountOfLikes,
    commentLikesInfo.isLikedByCurrentUser,
    currentUser,
  ]);

  const setInitialStates = useCallback(() => {
    setDateCommentCreated(timeFromNow(commentData.dateCreated));
    setCommentLikesInfo({
      isLikedByCurrentUser: findCurrentUserLikesForComment(commentData.likes),
      amountOfLikes: commentData.likes.length,
    });
    setEditedCommentText(commentData.text);
  }, [findCurrentUserLikesForComment, commentData]);

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
    setInitialStates();
  }, [getUserById, setInitialStates]);

  return (
    <>
      {!creatorOfCommentData && <Loader />}

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
                className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0 mr-2"
                onClick={cancelEditing}
              >
                Cancel
              </Button>

              <Button
                className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0"
                onClick={saveAndCancel}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <p className="break-words text-left text-black mb-1 min-width-230">
            {commentData.text}
          </p>
        )}
        {currentUser?._id === commentData.commentedBy && !isEditing ? (
          <>
            <div className="flex justify-between">
              <Button
                className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white text-left lg:px-0 lg:py-0 mr-2"
                onClick={replyClicked}
                disabled={isReplied}
              >
                Reply
              </Button>

              <div className="flex">
                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0 mr-2"
                  onClick={editComment}
                >
                  Edit
                </Button>

                <Button
                  className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0"
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
              className="px-0 py-0 bg-white text-gray-400 text-xs hover:bg-white lg:px-0 lg:py-0 mr-2"
              onClick={replyClicked}
              disabled={isReplied}
            >
              Reply
            </Button>
          </div>
        )}
        {isReplying && (
          <div className="w-full">
            <CommentsSection
              commentIdToReply={commentData._id}
              isReplied={true}
            />
          </div>
        )}
      </div>
    </>
  );
};
