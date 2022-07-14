import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import {
  decreasePage,
  increasePage,
  savePosts,
  setDefaultPage,
  setCurrentPage,
} from '../../store/postsSlice';
import { Button } from '../../UI/Button';

export const Pagination = () => {
  const page = useSelector((state) => state.posts.pageNumber);
  const lastPageNumber = useSelector((state) => state.posts.lastPageNumber);

  const params = useParams();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  let disableNextButton = false;
  let disableBackButton = false;

  const goToThePreviousPage = async () => {
    dispatch(decreasePage());
    setIsLoading(true);
    await getPostsByParams(page - 2);
    setIsLoading(false);
  };

  const goToTheNextPage = async () => {
    dispatch(increasePage());
    setIsLoading(true);
    await getPostsByParams(page);
    setIsLoading(false);
  };

  const goToTheFirstPage = () => {
    dispatch(setDefaultPage());
    getPostsByParams(0);
  };

  const goToTheLastPage = () => {
    dispatch(setCurrentPage(lastPageNumber));
    getPostsByParams(lastPageNumber);
  };

  const getPostsByParams = async (pageToSkip) => {
    const postsPerPage = 10;
    try {
      const response = await axios.get('/posts', {
        params: {
          skip: pageToSkip * postsPerPage,
        },
      });
      dispatch(savePosts([...response.data.data.reverse()]));
    } catch (error) {}
  };

  disableNextButton = page >= lastPageNumber ? true : false;
  disableBackButton = page <= 1 ? true : false;

  return (
    <div className="flex items-center">
      <Link to="/">
        <Button onClick={goToTheFirstPage}>First page</Button>
      </Link>
      <Link to={params.pageNumber === '2' ? '/' : `/page-${page - 1}`}>
        <Button
          onClick={goToThePreviousPage}
          disabled={isLoading || disableBackButton}
          className="ml-7"
        >
          Back
        </Button>
      </Link>
      <h2 className="px-2">{page}</h2>
      <Link to={`/page-${page + 1}`}>
        <Button
          onClick={goToTheNextPage}
          disabled={isLoading || disableNextButton}
          className="mr-7"
        >
          Next
        </Button>
      </Link>
      <Link to={`/page-${lastPageNumber}`}>
        <Button onClick={goToTheLastPage}>Last page</Button>
      </Link>
    </div>
  );
};
