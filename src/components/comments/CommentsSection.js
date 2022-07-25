import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import axios from '../../api/axios';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { SingleComment } from './SingleComment';
import { Button } from '../../UI/Button';
import { Loader } from '../../UI/Loader';
import { Textarea } from '../../UI/Textarea';

export const CommentsSection = ({ commentIdToReply, isReplied }) => {
  const [comments, setComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);
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
    } catch (error) {
      setCommentError(error.response.data.error[0].message);
    }
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
    setCommentError(null);
  };

  const handleNewComment = (event) => {
    setNewCommentText(event.target.value);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      {comments ? (
        <>
          {' '}
          <div className="flex justify-center">
            <div className={isReplied ? 'w-full' : 'w-1/2'}>
              {currentUser && (
                <div className="flex flex justify-start w-full mt-5 mb-3">
                  <img src={imgSrc(currentUser)} className="small-avatar" />
                  <div className="w-full">
                    <Textarea
                      id="commentField"
                      rows="3"
                      name="comment"
                      placeholder="Leave a comment..."
                      onChange={handleNewComment}
                      value={newCommentText}
                    />
                    <p className="text-left text-red-500 mb-1">
                      {commentError}
                    </p>
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
                          disabled={commentError}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
      ) : (
        <Loader />
      )}
    </>
  );
};
