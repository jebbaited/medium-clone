import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate, useParams } from 'react-router';
import { countPostsSkip } from '../../helpers/countPostsToSkip';
import { usePagination } from '../../hooks/usePagination';
import {
  getAllUsers,
  setInitialUsersToRenderState,
} from '../../store/userSlice';
import { Loader } from '../../UI/Loader';
import { PaginationBar } from '../../UI/PaginationBar';
import { User } from './User';
import { IUser } from '../../types/types';

export const AllUsers = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.user.user);
  const usersToRender = useAppSelector((state) => state.user.usersToRender);
  const lastPageNumber = useAppSelector(
    (state) => state.user.paginationInfo.lastPageNumber
  );
  const total = useAppSelector((state) => state.user.paginationInfo.total);
  const limit = useAppSelector((state) => state.user.paginationInfo.limit);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination(lastPageNumber);

  const getAllUsersByParams = useCallback(
    (pageToSkip: string): void => {
      const currentPage = +lastPageNumber - (+pageToSkip - 1 || 0);
      const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
      const limitForLastUsers =
        +skip === 0 ? +limit - (+lastPageNumber * +limit - +total) : 0;

      dispatch(getAllUsers({ limitForLastUsers, skip: +skip }));
    },
    [dispatch, lastPageNumber, limit, total]
  );

  useEffect(() => {
    dispatch(setInitialUsersToRenderState());
    getAllUsersByParams(params.pageNumber);
  }, [dispatch, getAllUsersByParams, params.pageNumber, currentUser, navigate]);

  return (
    <>
      <div className="flex justify-center min-width-640">
        <div className="flex flex-col items-center w-2/3 mt-8">
          <div className="w-1/2">
            <h1>All Users</h1>
            {!usersToRender ? (
              <Loader />
            ) : (
              usersToRender?.map((user: IUser) => (
                <User key={user._id} userData={user} />
              ))
            )}
          </div>
          {usersToRender && (
            <PaginationBar
              page={page}
              firstPage={firstPage}
              prevPage={prevPage}
              nextPage={nextPage}
              lastPage={lastPage}
              disableBackButton={disableBackButton}
              disableNextButton={disableNextButton}
              lastPageNumber={lastPageNumber}
              isNavigateAllUsers={true}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  );
  // return <div>dferdf</div>;
};
