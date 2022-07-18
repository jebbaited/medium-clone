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
  const [commentsText, setCommentsText] = useState('');
  const params = useParams();
  const currentUser = useSelector((state) => state.user.user);

  const getAllComments = async () => {
    try {
      const response = await axios.get(`/comments/post/${params.postId}`);
      setComments(response.data.reverse());
    } catch (error) {}
  };

  const createComment = async () => {
    try {
      const response = await axios.post(`/comments/post/${params.postId}`, {
        text: commentsText,
        followedCommentID: null,
      });
      //   setComments([...comments.unshift(response.data)]);
    } catch (error) {}
  };

  const cancel = () => {
    setCommentsText('');
  };

  const handleChange = (event) => {
    setCommentsText(event.target.value);
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      <div className="flex flex justify-center w-full mt-5">
        <img src={imgSrc(currentUser)} className="smallAvatar" />
        <div>
          <Textarea onChange={handleChange} value={commentsText} />
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

      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="w-1/2 flex flex-col items-left">
            <div className="flex flex-col items-left w-full">
              {comments?.map((comment) => (
                <div key={comment._id}>
                  <SingleComment commentData={comment} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
