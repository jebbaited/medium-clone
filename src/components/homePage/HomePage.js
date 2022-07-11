import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Post } from '../post/Post';

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const getAllPosts = async () => {
    try {
      const response = await axios.get('/posts');
      console.log(response);
      setPosts([...response.data.data]);
    } catch (error) {}
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="flex justify-start mt-8 w-2/3">
        <div className="w-2/3">
          <p>Feed</p>
          {posts.map((post) => (
            <div key={post._id}>
              <Post post={post} />
            </div>
          ))}
        </div>
        <div className="w-1/3 bg-gray-200">
          Popular Tags
          <p></p>
        </div>
      </div>
    </div>
  );
};
