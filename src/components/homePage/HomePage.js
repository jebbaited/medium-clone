import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import axios from '../../api/axios';
import { savePaginationInfo, savePosts } from '../../store/postsSlice';
import { Pagination } from '../pagination/Pagination';
import { Post } from '../post/Post';

export const HomePage = () => {
  const params = useParams();
  const posts = useSelector((state) => state.posts.posts);

  const dispatch = useDispatch();

  const getPosts = async () => {
    try {
      const response = await axios.get('/posts');
      dispatch(savePaginationInfo(response.data.pagination));
      // navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-2/3 mt-8">
        <div className="w-2/3">
          <h1>Global Feed</h1>
          {posts ? (
            posts?.map((post) => <Post post={post} key={post._id} />)
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
};
