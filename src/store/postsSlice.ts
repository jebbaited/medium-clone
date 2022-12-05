import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postAPI } from '../api/postAPI';
import { IAllPosts, IPaginationTForRequest, IPost } from '../types/types';
import type { RootState } from './index';

interface IGetPostsParams {
  limitForLastPosts: string | number;
  skip: string;
  userId: string;
  searchText?: string;
}

interface IPostsState {
  posts: IPost[];
  singlePost: IPost;
  paginationInfo: IPaginationTForRequest;
  searchPaginationInfo: IPaginationTForRequest;
  status: string;
  searchingStatus: string;
  isLoading: boolean;
}

interface ISearchReturned {
  data: IAllPosts;
  searchText: string;
}

const initialState: IPostsState = {
  posts: null,
  singlePost: null,
  paginationInfo: {
    lastPageNumber: null,
    total: null,
    limit: null,
  },
  searchPaginationInfo: {
    lastPageNumber: null,
    total: null,
    limit: null,
  },
  status: null,
  searchingStatus: null,
  isLoading: false,
};

export const getAllPosts = createAsyncThunk<IAllPosts, IGetPostsParams>(
  'posts/getAllPosts',
  async (params, { rejectWithValue }) => {
    const { limitForLastPosts, skip, userId, searchText } = params;
    try {
      const data = await postAPI.getAllPosts(
        limitForLastPosts,
        skip,
        userId,
        searchText
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const searchPosts = createAsyncThunk<
  ISearchReturned,
  IGetPostsParams,
  { state: { posts: IPostsState } }
>(
  'posts/searchPosts',
  async (params, { rejectWithValue }) => {
    const { limitForLastPosts, skip, userId, searchText } = params;
    try {
      const data = await postAPI.getAllPosts(
        limitForLastPosts,
        skip,
        userId,
        searchText
      );
      return { data, searchText };
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (state.posts.searchingStatus === 'loading') return false;
    },
  }
);

const checkString = (string: string, searchText: string): boolean => {
  return string.toLowerCase().includes(searchText.toLowerCase());
};

const replaceString = (string: string, searchText: string): string => {
  return string.replace(
    new RegExp(searchText, 'gi'),
    (match) => `<mark>${match}</mark>`
  );
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    savePosts(state, action) {
      if (action.payload) state.posts = [...action.payload];
    },
    setInitialPostsState(state) {
      state.posts = null;
    },
    reSaveOnePost(state, action) {
      state.posts.forEach((post: IPost, index: number) => {
        if (post._id === action.payload._id)
          state.posts[index] = action.payload;
      });
    },
    saveSinglePost(state, action) {
      state.singlePost = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.isLoading = false;
        state.posts = [...action.payload.data.reverse()];
        state.paginationInfo = {
          lastPageNumber: Math.ceil(
            +state.paginationInfo.total / +state.paginationInfo.limit
          ),
          total: action.payload.pagination.total,
          limit: 10,
        };
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.status = 'rejected';
        state.isLoading = false;
        console.log(action.payload);
      })

      .addCase(searchPosts.pending, (state) => {
        state.searchingStatus = 'loading';
        state.isLoading = true;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searchingStatus = 'resolved';
        state.isLoading = false;
        state.searchPaginationInfo = {
          lastPageNumber: Math.ceil(
            +state.searchPaginationInfo.total /
              +state.searchPaginationInfo.limit
          ),
          total: action.payload.data.pagination.total,
          limit: 10,
        };

        if (action.payload.searchText) {
          state.posts = [...action.payload.data.data]
            ?.filter(
              (post: IPost) =>
                checkString(post.title, action.payload.searchText) ||
                checkString(post.description, action.payload.searchText)
            )
            ?.map((post: IPost) => {
              let newTitle = replaceString(
                post.title,
                action.payload.searchText
              );
              let newDescription = replaceString(
                post.description,
                action.payload.searchText
              );
              return {
                ...post,
                title: newTitle,
                description: newDescription,
              };
            });
        }
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.searchingStatus = 'rejected';
        state.isLoading = false;
        console.log(action.payload);
      });
  },
});

export const {
  savePosts,
  setInitialPostsState,
  reSaveOnePost,
  saveSinglePost,
} = postsSlice.actions;

export const PostsInfo = (state: RootState) => state.posts;

export default postsSlice.reducer;
