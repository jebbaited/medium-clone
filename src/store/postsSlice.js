import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: null,
    singlePost: null,
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
      console.log('saved');
    },
  },
});

export const { savePosts, reSaveOnePost, saveSinglePost } = postsSlice.actions;

export default postsSlice.reducer;
