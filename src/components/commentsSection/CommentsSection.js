import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import axios from '../../api/axios';
import { imgSrc } from '../../helpers/chooseAvatarImage';
import { Button } from '../../UI/Button';
import { Textarea } from '../../UI/Textarea';
import { SingleComment } from './SingleComment';

export const CommentsSection = () => {
  const [comments, setComments] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  // const [editCommentText, setEditCommentText] = useState('');
  const params = useParams();
  const currentUser = useSelector((state) => state.user.user);

  const getAllComments = async () => {
    try {
      const response = await axios.get(`/comments/post/${params.postId}`);
      setComments(response.data.reverse());
      console.log(response.data);
    } catch (error) {}
  };

  const createComment = async () => {
    try {
      await axios.post(`/comments/post/${params.postId}`, {
        text: newCommentText,
        followedCommentID: null,
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

  const cancel = () => {
    setNewCommentText('');
  };

  const handleNewComment = (event) => {
    setNewCommentText(event.target.value);
  };

  // const handleEditingComment = (event) => {
  //   setEditCommentText(event.target.value)
  // }

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-1/2">
          <div className="flex flex justify-start w-full mt-5">
            <img src={imgSrc(currentUser)} className="smallAvatar" />
            <div className="w-full">
              <Textarea onChange={handleNewComment} value={newCommentText} />
              <div className="flex justify-end">
                <div className="mr-1">
                  <Button
                    onClick={cancel}
                    className="bg-white text-gray-400 hover:bg-white"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button onClick={createComment}>Post</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="w-1/2 flex flex-col items-left">
            <div className="flex flex-col items-left w-full">
              {comments?.map((comment) => (
                <div key={comment._id}>
                  <SingleComment
                    commentData={comment}
                    deleteComment={deleteComment}
                    saveChanges={saveChangesAfterEditing}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
