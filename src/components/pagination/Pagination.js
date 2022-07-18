import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { countPostsSkip } from '../../helpers/countPostsToSkip';
import {
  decreasePage,
  increasePage,
  savePosts,
  setDefaultPage,
  setCurrentPage,
  savePaginationInfo,
} from '../../store/postsSlice';
import { Button } from '../../UI/Button';

export const Pagination = () => {
  const page = useSelector((state) => state.posts.pageNumber);
  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useSelector((state) => state.posts.paginationInfo.total);
  const limit = useSelector((state) => state.posts.paginationInfo.limit);

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
    const currentPage = lastPageNumber - pageToSkip;
    const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
    const limitForLastPosts =
      skip === 0 ? limit - (lastPageNumber * limit - total) : 0;

    try {
      const response = await axios.get('/posts', {
        params: {
          limit: limitForLastPosts || 10,
          skip: skip,
        },
      });
      dispatch(savePosts([...response.data.data.reverse()]));
      // dispatch(savePaginationInfo(response.data.pagination));
      dispatch(
        savePaginationInfo({
          lastPageNumber: lastPageNumber,
          total: response.data.pagination.total,
          limit: 10,
        })
      );
    } catch (error) {}
  };

  disableNextButton = page >= lastPageNumber ? true : false;
  disableBackButton = page <= 1 ? true : false;

  // переделать как-то по-другому
  useEffect(() => {
    // отрисовка для первого рендера
    if (page === 1 && params.pageNumber === undefined && total !== null) {
      goToTheFirstPage();
    }
    // при нажатии на Home в хедере pageNumber становится undefined
    if (page !== 1 && params.pageNumber === undefined) {
      goToTheFirstPage();
    }
    // при нажатии на кнопку "вперед" в браузере
    if (params.pageNumber > page) goToTheNextPage();

    // при нажатии на кнопку "назад" в браузере
    if (params.pageNumber < page) goToThePreviousPage();
  }, [params.pageNumber, total]);

  return (
    <div className="flex items-center">
      <Link to="/">
        <Button onClick={goToTheFirstPage} disable={disableBackButton}>
          First page
        </Button>
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
        <Button onClick={goToTheLastPage} disable={disableNextButton}>
          Last page
        </Button>
      </Link>
    </div>
  );
};
