import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import axios from '../../api/axios';
import { countPostsSkip } from '../../helpers/countPostsToSkip';
import { savePosts, setDefaultPage } from '../../store/postsSlice';
import { Pagination } from '../pagination/Pagination';
import { Post } from '../post/Post';

export const HomePage = () => {
  const params = useParams();
  const posts = useSelector((state) => state.posts.posts);
  // const lastPageNumber = useSelector(
  //   (state) => state.posts.paginationInfo.lastPageNumber
  // );
  // const total = useSelector((state) => state.posts.paginationInfo.total);
  // const limit = useSelector((state) => state.posts.paginationInfo.limit);
  // const dispatch = useDispatch();

  // const getFirstPage = async (page) => {
  //   const skip = countPostsSkip(page, lastPageNumber, total, limit);
  //   try {
  //     const response = await axios.get('/posts', {
  //       params: {
  //         skip: skip,
  //       },
  //     });
  //     dispatch(savePosts([...response.data.data.reverse()]));
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   getFirstPage(lastPageNumber);
  //   dispatch(setDefaultPage());
  // }, [lastPageNumber]);

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
