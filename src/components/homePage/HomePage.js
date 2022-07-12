import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Post } from '../post/Post';

export const HomePage = () => {
  const [posts, setPosts] = useState(null);

  const getAllPosts = async () => {
    try {
      const response = await axios.get('/posts');
      console.log('got posts', response.data.data);
      setPosts([...response.data.data]);
    } catch (error) {}
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-2/3 mt-8">
        <div className="w-2/3">
          <p>Global Feed</p>
          {posts ? (
            posts.map((post) => <Post post={post} key={post._id} />)
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};
