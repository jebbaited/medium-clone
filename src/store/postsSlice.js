import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: null,
    singlePost: null,
    paginationInfo: {
      lastPageNumber: null,
      total: null,
      limit: null,
    },
  },
  reducers: {
    savePosts(state, action) {
      state.posts = [...action.payload];
    },
    setInitialPostsState(state, action) {
      state.posts = null;
    },
    reSaveOnePost(state, action) {
      state.posts.forEach((post, index) => {
        if (post._id === action.payload._id)
          state.posts[index] = action.payload;
      });
    },
    saveSinglePost(state, action) {
      state.singlePost = { ...action.payload };
    },
    savePaginationInfo(state, action) {
      state.paginationInfo = {
        lastPageNumber: Math.ceil(action.payload.total / action.payload.limit),
        total: action.payload.total,
        limit: action.payload.limit,
      };
    },
  },
});

export const {
  savePosts,
  setInitialPostsState,
  reSaveOnePost,
  saveSinglePost,
  savePaginationInfo,
} = postsSlice.actions;

export default postsSlice.reducer;
