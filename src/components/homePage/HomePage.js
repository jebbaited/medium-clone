import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import { Pagination } from '../pagination/Pagination';
import { Post } from '../post/Post';

export const HomePage = () => {
  const posts = useSelector((state) => state.posts.posts);

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
