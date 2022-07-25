import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const PaginationBar = ({
  page,
  firstPage,
  prevPage,
  nextPage,
  lastPage,
  disableBackButton,
  disableNextButton,
  lastPageNumber,
  isLoading,
  isNavigateToProfile,
}) => {
  const params = useParams();

  const pathToUserProfile = `/profile/${params.userId}/${params.name}`;

  return (
    <div className="flex items-center">
      {isNavigateToProfile ? (
        <>
          <Link to={pathToUserProfile}>
            <Button onClick={firstPage} disable={disableBackButton}>
              First page
            </Button>
          </Link>
          <Link
            to={
              params.pageNumber === '2'
                ? `${pathToUserProfile}`
                : `${pathToUserProfile}/page-${page - 1}`
            }
          >
            <Button
              onClick={prevPage}
              disabled={isLoading || disableBackButton}
              className="ml-2 lg:ml-7"
            >
              Back
            </Button>
          </Link>
          <h2 className="px-2">{page}</h2>
          <Link to={`${pathToUserProfile}/page-${page + 1}`}>
            <Button
              onClick={nextPage}
              disabled={isLoading || disableNextButton}
              className="mr-2 lg:mr-7"
            >
              Next
            </Button>
          </Link>
          <Link to={`${pathToUserProfile}/page-${lastPageNumber}`}>
            <Button onClick={lastPage} disable={disableNextButton}>
              Last page
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/">
            <Button onClick={firstPage} disable={disableBackButton}>
              First page
            </Button>
          </Link>
          <Link to={params.pageNumber === '2' ? '/' : `/page-${page - 1}`}>
            <Button
              onClick={prevPage}
              disabled={isLoading || disableBackButton}
              className="ml-2 lg:ml-7"
            >
              Back
            </Button>
          </Link>
          <h2 className="px-2">{page}</h2>
          <Link to={`/page-${page + 1}`}>
            <Button
              onClick={nextPage}
              disabled={isLoading || disableNextButton}
              className="mr-2 lg:mr-7"
            >
              Next
            </Button>
          </Link>
          <Link to={`/page-${lastPageNumber}`}>
            <Button onClick={lastPage} disable={disableNextButton}>
              Last page
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
