import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const usePagination = () => {
  const params = useParams();
  const [page, setPage] = useState(+params.pageNumber || 1);
  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );

  let disableNextButton = false;
  let disableBackButton = false;

  const goToThePreviousPage = () => {
    setPage(page - 1);
  };

  const goToTheNextPage = () => {
    setPage(page + 1);
  };

  const goToTheFirstPage = () => {
    setPage(1);
  };

  const goToTheLastPage = () => {
    setPage(lastPageNumber);
  };

  disableNextButton = page >= lastPageNumber ? true : false;
  disableBackButton = page <= 1 ? true : false;

  useEffect(() => {
    if (params.pageNumber === undefined && page === lastPageNumber) setPage(1);
  }, [params.pageNumber === undefined]);

  return {
    page,
    disableNextButton,
    disableBackButton,
    nextPage: goToTheNextPage,
    prevPage: goToThePreviousPage,
    firstPage: goToTheFirstPage,
    lastPage: goToTheLastPage,
  };
};
