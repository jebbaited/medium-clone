import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const usePagination = () => {
  const params = useParams();
  const [page, setPage] = useState(+params.pageNumber || 1);
  const lastPageNumber = useSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );

  const goToThePreviousPage = useCallback(() => {
    setPage(page - 1);
  }, [page]);

  const goToTheNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const goToTheFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToTheLastPage = useCallback(() => {
    setPage(lastPageNumber);
  }, [lastPageNumber]);

  let disableNextButton = !!(page >= lastPageNumber);
  let disableBackButton = !!(page <= 1);

  useEffect(() => {
    if (!params.pageNumber && page === lastPageNumber) setPage(1);
    if (!params.pageNumber) setPage(1);
  }, [lastPageNumber, page, params.pageNumber]);

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
