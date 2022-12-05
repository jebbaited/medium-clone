import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const usePagination = (lastPageNumber: string | number) => {
  const params = useParams();
  const [page, setPage] = useState<number>(+params.pageNumber || 1);

  const goToThePreviousPage = useCallback((): void => {
    setPage(page - 1);
  }, [page]);

  const goToTheNextPage = useCallback((): void => {
    setPage(page + 1);
  }, [page]);

  const goToTheFirstPage = useCallback((): void => {
    setPage(1);
  }, []);

  const goToTheLastPage = useCallback((): void => {
    setPage(+lastPageNumber);
  }, [lastPageNumber]);

  let disableNextButton: boolean = lastPageNumber
    ? !!(page >= +lastPageNumber)
    : false;
  let disableBackButton: boolean = !!(page <= 1);

  useEffect(() => {
    if (!params.pageNumber && page === +lastPageNumber) setPage(1);
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
