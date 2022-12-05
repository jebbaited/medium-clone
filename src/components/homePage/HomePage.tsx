import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate, useParams } from 'react-router';

import { countPostsSkip } from '../../helpers/countPostsToSkip';
import { usePagination } from '../../hooks/usePagination';
import { Post } from '../singlePostPage/Post';
import validateRules from '../../helpers/validateRules';
import {
  getAllPosts,
  searchPosts,
  setInitialPostsState,
} from '../../store/postsSlice';
import { Loader } from '../../UI/Loader';
import { PaginationBar } from '../../UI/PaginationBar';
import { Textarea } from '../../UI/Textarea';
import { IPost } from '../../types/types';

interface SearchParamForm {
  search: string;
}

export const HomePage = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const posts = useAppSelector((state) => state.posts.posts);
  const lastPageNumber = useAppSelector(
    (state) => state.posts.paginationInfo.lastPageNumber
  );
  const total = useAppSelector((state) => state.posts.paginationInfo.total);
  const limit = useAppSelector((state) => state.posts.paginationInfo.limit);

  const searchLastPageNumber = useAppSelector(
    (state) => state.posts.searchPaginationInfo.lastPageNumber
  );
  const searchTotal = useAppSelector(
    (state) => state.posts.searchPaginationInfo.total
  );
  const searchLimit = useAppSelector(
    (state) => state.posts.searchPaginationInfo.limit
  );
  const isLoading = useAppSelector((state) => state.posts.isLoading);

  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const {
    page,
    disableNextButton,
    disableBackButton,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination(isSearching ? searchLastPageNumber : lastPageNumber);

  const {
    register,
    handleSubmit,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm<SearchParamForm>({
    mode: 'onChange',
    defaultValues: {
      search: params.searchText,
    },
  });

  const getPostsByParams = useCallback(
    (pageToSkip: string): void => {
      setIsSearching(false);
      const currentPage = +lastPageNumber - (+pageToSkip - 1 || 0);
      const skip = countPostsSkip(currentPage, lastPageNumber, total, limit);
      const limitForLastPosts =
        +skip === 0 ? +limit - (+lastPageNumber * +limit - +total) : 0;

      dispatch(getAllPosts({ limitForLastPosts, skip, userId: '' }));
    },
    [dispatch, lastPageNumber, limit, total]
  );

  const searchPostsByParams = useCallback(
    (pageToSkip: string, search: string): void => {
      setIsSearching(true);
      const currentPage = +searchLastPageNumber - (+pageToSkip - 1 || 0);
      const skip = countPostsSkip(
        currentPage,
        searchLastPageNumber,
        searchTotal,
        searchLimit
      );
      const limitForLastPosts =
        +skip === 0
          ? +searchLimit - (+searchLastPageNumber * +searchLimit - +searchTotal)
          : 0;

      dispatch(
        searchPosts({
          limitForLastPosts,
          skip,
          userId: '',
          searchText: search,
        })
      );
    },
    [dispatch, searchLastPageNumber, searchLimit, searchTotal]
  );

  const onSubmit: SubmitHandler<SearchParamForm> = (formData): void => {
    setSearchText(formData.search);
  };

  useEffect(() => {
    dispatch(setInitialPostsState());
    clearErrors('search');
    if (!isSearching && !params.searchText) {
      getPostsByParams(params.pageNumber);
      return;
    } else {
      searchPostsByParams(params.pageNumber, params.searchText);
    }
    if (params.searchText === undefined) {
      setIsSearching(false);
      setSearchText('');
      resetField('search');
    }

    if (params.searchText && !searchText) {
      setSearchText(params.searchText);
      resetField('search');
    }
  }, [
    dispatch,
    getPostsByParams,
    searchPostsByParams,
    params.pageNumber,
    params.searchText,
    isSearching,
  ]);

  useEffect(() => {
    const sendSearchRequest = setTimeout(() => {
      if (searchText) {
        navigate(`/search=${searchText}`);
      } else {
        setSearchText('');
        resetField('search');
        navigate('/');
      }
    }, 1000);
    return () => clearTimeout(sendSearchRequest);
  }, [searchText, params.searchText]);

  return (
    <div
      className={`flex justify-center min-width-640 ${
        posts?.length < 5 ? 'h-[calc(100vh-56px)]' : ''
      }`}
    >
      <div className="flex flex-col items-center w-2/3 mt-8">
        <form onChange={handleSubmit(onSubmit)} className="w-full">
          <div className="flex items-center w-full mt-5 mb-3">
            <div className="w-full flex">
              <Textarea
                id="searchField"
                rows="1"
                name="search"
                placeholder="Search"
                register={{
                  ...register('search', validateRules.searchValidateRules),
                }}
                errorMessage={errors}
              />
            </div>
          </div>
        </form>
        <div className="w-2/3">
          <h1>Global Feed</h1>
          {!posts && <Loader />}
          {isSearching && posts?.length === 0 && (
            <p className="mt-8 text-lg">Unfortunately, nothing was found</p>
          )}
          {posts?.map((post: IPost) => (
            <Post post={post} key={post._id} />
          ))}
        </div>
        <div
          className={
            !posts?.length || (searchTotal < 10 && isSearching)
              ? 'invisible'
              : ''
          }
        >
          <PaginationBar
            page={page}
            firstPage={firstPage}
            prevPage={prevPage}
            nextPage={nextPage}
            lastPage={lastPage}
            disableBackButton={disableBackButton}
            disableNextButton={disableNextButton}
            lastPageNumber={isSearching ? searchLastPageNumber : lastPageNumber}
            isLoading={isLoading}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>
  );
};
