import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: null,
    singlePost: null,
    pageNumber: 1,
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
    reSaveOnePost(state, action) {
      state.posts.forEach((post, index) => {
        if (post._id === action.payload._id)
          state.posts[index] = action.payload;
      });
    },
    saveSinglePost(state, action) {
      state.singlePost = { ...action.payload };
    },
    increasePage(state, action) {
      state.pageNumber = state.pageNumber + 1;
    },
    decreasePage(state, action) {
      state.pageNumber = state.pageNumber - 1;
    },
    setDefaultPage(state, action) {
      state.pageNumber = 1;
    },
    setCurrentPage(state, action) {
      state.pageNumber = action.payload;
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
  reSaveOnePost,
  saveSinglePost,
  increasePage,
  decreasePage,
  setDefaultPage,
  setCurrentPage,
  savePaginationInfo,
} = postsSlice.actions;

export default postsSlice.reducer;
