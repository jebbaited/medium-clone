import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import axios from '../../api/axios';
import { countPostsSkip } from '../../helpers/countPostsToSkip';
import { usePagination } from '../../hooks/usePagination';
import { savePaginationInfo, savePosts } from '../../store/postsSlice';
import { Loader } from '../../UI/Loader';
import { PaginationBar } from '../../UI/PaginationBar';
import { Post } from '../singlePostPage/Post';

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const posts = useSelector((state) => state.posts.posts);
  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useSelector((state) => state.posts.paginationInfo.total);
  const limit = useSelector((state) => state.posts.paginationInfo.limit);

  const dispatch = useDispatch();
  const params = useParams();

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination();

  const getPostsByParams = async (pageToSkip) => {
    const currentPage = lastPageNumber - (pageToSkip - 1 || 0);
    const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
    const limitForLastPosts =
      skip === 0 ? limit - (lastPageNumber * limit - total) : 0;

    try {
      setIsLoading(true);
      const response = await axios.get('/posts', {
        params: {
          limit: limitForLastPosts || 10,
          skip: skip,
        },
      });

      if (response.data.data.length) {
        dispatch(savePosts(response.data.data.reverse()));
      }

      dispatch(
        savePaginationInfo({
          lastPageNumber: lastPageNumber,
          total: response.data.pagination.total,
          limit: 10,
        })
      );
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getPostsByParams();
  }, []);

  useEffect(() => {
    getPostsByParams(params.pageNumber);
  }, [params.pageNumber, total]);

  return (
    <div className="flex justify-center min-width-640">
      <div className="flex flex-col items-center w-2/3 mt-8">
        <div className="w-2/3">
          <h1>Global Feed</h1>
          {posts ? (
            posts?.map((post) => <Post post={post} key={post._id} />)
          ) : (
            <Loader />
          )}
        </div>
        <PaginationBar
          page={page}
          firstPage={firstPage}
          prevPage={prevPage}
          nextPage={nextPage}
          lastPage={lastPage}
          disableBackButton={disableBackButton}
          disableNextButton={disableNextButton}
          lastPageNumber={lastPageNumber}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
