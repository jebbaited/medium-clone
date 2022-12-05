import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { commentsAPI } from '../api/commentsAPI';
import { findCommentsRecursive } from '../helpers/recursiveComments';
import { IComment } from '../types/types';
import type { RootState } from './index';

interface ICommentsState {
  rawComments: IComment[];
  commentsForPost: IComment[];
  lastPageNumber: number;
  status: string;
}

const initialState: ICommentsState = {
  rawComments: null,
  commentsForPost: [],
  lastPageNumber: null,
  status: null,
};

interface INewCommentParams {
  id: string;
  newCommentText: string;
  commentIdToReply: string;
}

interface IDeletedComment {
  data: string;
  commentId?: string;
}

interface IUpdatedComment {
  data: IComment;
  commentId: string;
}

export const getAllCommentsByPostId = createAsyncThunk<
  IComment[],
  { id: string }
>('comments/getAllComments', async (params, { rejectWithValue }) => {
  const { id } = params;
  try {
    const data = await commentsAPI.getCommentsByPostId(id);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.error);
  }
});

export const createComment = createAsyncThunk<IComment, INewCommentParams>(
  'comments/createComment',
  async (params, { rejectWithValue }) => {
    const { id, newCommentText, commentIdToReply } = params;
    try {
      const data = await commentsAPI.createNewComment(
        id,
        newCommentText,
        commentIdToReply
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteCommentById = createAsyncThunk<IDeletedComment, string>(
  'comments/deleteCommentById',
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await commentsAPI.deleteCommentById(commentId);
      return { data, commentId };
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateCommentById = createAsyncThunk<
  IUpdatedComment,
  { commentId: string; text: string }
>('comments/updateCommentById', async (params, { rejectWithValue }) => {
  const { commentId, text } = params;
  try {
    const data = await commentsAPI.updateCommentById(commentId, text);
    return { data, commentId };
  } catch (error) {
    return rejectWithValue(error.response.data.error);
  }
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCommentsByPostId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllCommentsByPostId.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.rawComments = action.payload;

        state.commentsForPost = findCommentsRecursive(action.payload);
        state.lastPageNumber = Math.ceil(state.commentsForPost?.length / 10);
      })
      .addCase(getAllCommentsByPostId.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(createComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.rawComments = [...state.rawComments, action.payload];

        state.commentsForPost = findCommentsRecursive(state.rawComments);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(deleteCommentById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCommentById.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.rawComments = [
          ...state.rawComments.filter(
            (comment: IComment) => comment._id !== action.payload.commentId
          ),
        ];

        state.commentsForPost = findCommentsRecursive(state.rawComments);
      })
      .addCase(deleteCommentById.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(updateCommentById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCommentById.fulfilled, (state, action) => {
        state.status = 'resolved';
        // ищу комментарий, который нужно поменять и удаляю его из массива, а после вставляю его же, но с новыми данными
        state.rawComments = [
          ...state.rawComments.filter(
            (comment: IComment) => comment._id !== action.payload.commentId
          ),
          { ...action.payload.data },
        ];

        state.commentsForPost = findCommentsRecursive(state.rawComments);
      })
      .addCase(updateCommentById.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      });
  },
});

export const {} = commentsSlice.actions;

export const CommentsInfo = (state: RootState) => state.comments;

export default commentsSlice.reducer;
