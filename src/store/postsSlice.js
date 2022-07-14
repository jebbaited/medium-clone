import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: null,
    singlePost: null,
    pageNumber: 1,
    lastPageNumber: null,
  },
  reducers: {
    savePosts(state, action) {
      state.posts = [...action.payload];
    },
    reSaveOnePost(state, action) {
      state.posts.map((post, index) => {
        if (post._id === action.payload._id)
          state.posts[index] = action.payload;
      });
    },
    saveSinglePost(state, action) {
      state.singlePost = { ...action.payload };
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
    saveLastPageNumber(state, action) {
      state.lastPageNumber = action.payload;
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
  saveLastPageNumber,
} = postsSlice.actions;

export default postsSlice.reducer;
