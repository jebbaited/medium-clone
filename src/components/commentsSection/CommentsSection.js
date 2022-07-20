import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import axios from '../../api/axios';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { Button } from '../../UI/Button';
import { Textarea } from '../../UI/Textarea';
import { SingleComment } from './SingleComment';

export const CommentsSection = ({ commentIdToReply, isReplied }) => {
  const [comments, setComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const params = useParams();

  const currentUser = useSelector((state) => state.user.user);

  const getAllComments = async () => {
    try {
      const response = await axios.get(`/comments/post/${params.postId}`);
      handleComments(response.data);
    } catch (error) {}
  };

  const handleComments = (data) => {
    const commentsToSet = commentIdToReply
      ? data.filter((comment) => comment.followedCommentID === commentIdToReply)
      : data.filter((comment) => comment.followedCommentID === null);

    setComments(commentsToSet.reverse());
  };

  const createComment = async () => {
    try {
      await axios.post(`/comments/post/${params.postId}`, {
        text: newCommentText,
        followedCommentID: commentIdToReply ? commentIdToReply : null,
      });
      await getAllComments();
      setNewCommentText('');
    } catch (error) {}
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      await getAllComments();
    } catch (error) {}
  };

  const saveChangesAfterEditing = async (commentId, text) => {
    try {
      await axios.patch(`/comments/${commentId}`, {
        text: text,
      });
      await getAllComments();
    } catch (error) {}
  };

  const replyToComment = () => {
    getAllComments();
  };

  const cancel = () => {
    setNewCommentText('');
  };

  const handleNewComment = (event) => {
    setNewCommentText(event.target.value);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div className={isReplied ? 'w-full' : 'w-1/2'}>
          <div className="flex flex justify-start w-full mt-5">
            <img src={imgSrc(currentUser)} className="smallAvatar" />
            <div className="w-full">
              <Textarea
                id="commentField"
                rows="3"
                name="comment"
                placeholder="Leave a comment..."
                onChange={handleNewComment}
                value={newCommentText}
              />
              <div className="flex justify-end">
                <div className="mr-1">
                  <Button
                    onClick={cancel}
                    className={`bg-white text-gray-400 hover:bg-white ${
                      isReplied ? 'px-1 py-1 text-sm' : ''
                    }`}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={createComment}
                    className={isReplied ? 'px-1 py-1 text-sm' : ''}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className={isReplied ? 'w-3/4' : 'w-1/2'}>
          <div
            className={`flex flex-col items-left ${
              isReplied ? 'w-3/4' : 'w-1/2'
            }`}
          >
            <div className="flex flex-col items-left w-full">
              {comments?.length ? (
                <>
                  {comments?.map((comment) => (
                    <div key={comment._id} className="mb-3">
                      <SingleComment
                        commentData={comment}
                        deleteComment={deleteComment}
                        saveChanges={saveChangesAfterEditing}
                        replyToComment={replyToComment}
                        isReplied={isReplied}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-left">There is no comments yet...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
