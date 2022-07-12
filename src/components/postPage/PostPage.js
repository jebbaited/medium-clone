import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from '../../api/axios';

export const PostPage = () => {
  const [postToRender, setPostToRender] = useState(null);
  const params = useParams();

  const getNecessaryPost = async () => {
    const id = params.id;
    try {
      const response = await axios.get(`/posts/${id}`);
      setPostToRender(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getNecessaryPost();
  }, []);

  return (
    <>
      {postToRender ? (
        <div>
          <div>
            <div>
              <h1>{postToRender.title}</h1>
            </div>
            <div>
              <p>avatar</p>
              <p>{postToRender.postedBy}</p>
              <p>{postToRender.dateCreated}</p>
              <p>{postToRender.likes.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
