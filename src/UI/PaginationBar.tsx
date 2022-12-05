import React, { FC } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface Props {
  page: number;
  firstPage: () => void;
  prevPage: () => void;
  nextPage: () => void;
  lastPage: () => void;
  disableBackButton: boolean;
  disableNextButton: boolean;
  lastPageNumber: string | number;
  isLoading?: boolean;
  isNavigateToProfile?: boolean;
  isNavigateThroughtComments?: boolean;
  isSearching?: boolean;
  isNavigateAllUsers?: boolean;
}

export const PaginationBar: FC<Props> = ({
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
  isNavigateThroughtComments,
  isSearching,
  isNavigateAllUsers,
}) => {
  const params = useParams();
  const navigate = useNavigate();

  const pathToUserProfile = `/profile/${params.userId}/${params.name}`;
  const pathToComments = `/post/${params.postId}/${params.title}/comments`;
  const searchingPath = `/search=${params.searchText}`;
  const pathToAllUsers = `/allUsers`;

  const pageToDisplay: number = +params.pageNumber || 1;

  useEffect(() => {
    if (params.pageNumber > lastPageNumber && lastPageNumber) {
      navigate(
        isNavigateToProfile
          ? `${pathToUserProfile}/page-${lastPageNumber}`
          : isNavigateThroughtComments
          ? `${pathToComments}/page-${lastPageNumber}`
          : isSearching
          ? `/page-${lastPageNumber}${searchingPath}`
          : isNavigateAllUsers
          ? `${pathToAllUsers}/page-${lastPageNumber}`
          : `/page-${lastPageNumber}`
      );
    }
  }, [
    lastPageNumber,
    isNavigateToProfile,
    isNavigateThroughtComments,
    isNavigateAllUsers,
    isSearching,
    navigate,
    params.pageNumber,
    pathToUserProfile,
    pathToComments,
    searchingPath,
    pathToAllUsers,
  ]);

  return (
    <div className="flex items-center">
      {isNavigateToProfile && (
        <>
          <Link to={pathToUserProfile}>
            <Button onClick={firstPage} disabled={disableBackButton}>
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
          <h2 className="px-2">{pageToDisplay}</h2>
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
            <Button onClick={lastPage} disabled={disableNextButton}>
              Last page
            </Button>
          </Link>
        </>
      )}

      {isNavigateThroughtComments && (
        <>
          <Link to={`/post/${params.postId}/${params.title}`}>
            <Button onClick={firstPage} disabled={disableBackButton}>
              First
            </Button>
          </Link>
          <Link
            to={
              params.pageNumber === '2'
                ? `/post/${params.postId}/${params.title}`
                : `${pathToComments}/page-${page - 1}`
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
          <h2 className="px-2">{pageToDisplay}</h2>
          <Link to={`${pathToComments}/page-${page + 1}`}>
            <Button
              onClick={nextPage}
              disabled={isLoading || disableNextButton}
              className="mr-2 lg:mr-7"
            >
              Next
            </Button>
          </Link>
          <Link to={`${pathToComments}/page-${lastPageNumber}`}>
            <Button onClick={lastPage} disabled={disableNextButton}>
              Last
            </Button>
          </Link>
        </>
      )}

      {isSearching && (
        <>
          <Link to={searchingPath}>
            <Button onClick={firstPage} disabled={disableBackButton}>
              First page
            </Button>
          </Link>
          <Link
            to={
              params.pageNumber === '2'
                ? `${searchingPath}`
                : `/page-${page - 1}${searchingPath}`
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
          <h2 className="px-2">{pageToDisplay}</h2>
          <Link to={`/page-${page + 1}${searchingPath}`}>
            <Button
              onClick={nextPage}
              disabled={isLoading || disableNextButton}
              className="mr-2 lg:mr-7"
            >
              Next
            </Button>
          </Link>
          <Link to={`/page-${lastPageNumber}${searchingPath}`}>
            <Button onClick={lastPage} disabled={disableNextButton}>
              Last page
            </Button>
          </Link>
        </>
      )}

      {isNavigateAllUsers && (
        <>
          <Link to={pathToAllUsers}>
            <Button onClick={firstPage} disabled={disableBackButton}>
              First Page
            </Button>
          </Link>
          <Link
            to={
              params.pageNumber === '2'
                ? `${pathToAllUsers}`
                : `${pathToAllUsers}/page-${page - 1}`
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
          <h2 className="px-2">{pageToDisplay}</h2>
          <Link to={`${pathToAllUsers}/page-${page + 1}`}>
            <Button
              onClick={nextPage}
              disabled={isLoading || disableNextButton}
              className="mr-2 lg:mr-7"
            >
              Next
            </Button>
          </Link>
          <Link to={`${pathToAllUsers}/page-${lastPageNumber}`}>
            <Button onClick={lastPage} disabled={disableNextButton}>
              Last Page
            </Button>
          </Link>
        </>
      )}

      {!isNavigateThroughtComments &&
        !isNavigateToProfile &&
        !isSearching &&
        !isNavigateAllUsers && (
          <>
            <Link to="/">
              <Button onClick={firstPage} disabled={disableBackButton}>
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
            <h2 className="px-2">{pageToDisplay}</h2>
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
              <Button onClick={lastPage} disabled={disableNextButton}>
                Last page
              </Button>
            </Link>
          </>
        )}
    </div>
  );
};
