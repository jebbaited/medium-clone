import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../api/authAPI';
import { usersAPI } from '../api/usersAPI';
import { removeItem, setItem } from '../helpers/persistanceStorage';
import {
  IAllUsers,
  IPaginationTForRequest,
  IUser,
  KeyStrings,
} from '../types/types';
import type { RootState } from './index';

interface UpdateUserInfo {
  id: string;
  name: string;
  details: string;
}

interface UpdateUserAvatar {
  id: string;
  avatar: File;
}

interface AllUsersParams {
  limitForLastUsers: number;
  skip: number;
}

interface UsersInfoState {
  user: IUser;
  allUsers: IUser[];
  usersToRender: IUser[];
  status: string;
  paginationInfo: IPaginationTForRequest;
  isLoading: boolean;
  theme: string;
}

const initialState: UsersInfoState = {
  user: null,
  allUsers: [],
  usersToRender: null,
  status: null,
  paginationInfo: {
    lastPageNumber: null,
    total: null,
    limit: null,
  },
  isLoading: false,
  theme: null,
};

export const getUserByToken = createAsyncThunk<IUser, undefined>(
  'user/getUserByToken',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.getUserByToken();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const patchUserById = createAsyncThunk<IUser, UpdateUserInfo>(
  'user/patchUserById',
  async (dataToUpdate, { rejectWithValue }) => {
    const { id, name, details } = dataToUpdate;
    try {
      const data = await usersAPI.patchUserById(id, name, details);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateAvatar = createAsyncThunk<IUser, UpdateUserAvatar>(
  'user/updateAvatar',
  async (dataToUpdate: UpdateUserAvatar, { rejectWithValue }) => {
    const { id, avatar } = dataToUpdate;
    try {
      const data = await usersAPI.updateAvatar(id, avatar);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteUser = createAsyncThunk<any, string>(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const data = await usersAPI.deleteUser(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getUserById = createAsyncThunk<
  IUser,
  string,
  { state: { user: UsersInfoState } }
>(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await usersAPI.getUserById(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState();
      if (state.user.status === 'loading') return false;
    },
  }
);

export const getAllUsers = createAsyncThunk<IAllUsers, AllUsersParams>(
  'user/getAllUsers',
  async (params, { rejectWithValue }) => {
    const { limitForLastUsers, skip } = params;
    try {
      const data = await usersAPI.getAllUsers(limitForLastUsers, skip);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const checkTheme = (existing: string) => {
  const root = window.document.documentElement;
  const isDark = existing === 'dark';

  root.classList.remove(isDark ? 'light' : 'dark');
  root.classList.add(existing);

  setItem(KeyStrings.currentTheme, existing);
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
    setInitialUsersToRenderState(state) {
      state.usersToRender = null;
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
      checkTheme(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserByToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = { ...action.payload };
      })
      .addCase(getUserByToken.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(patchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(patchUserById.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = { ...action.payload };
      })
      .addCase(patchUserById.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(updateAvatar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.user = { ...action.payload };
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'resolved';
        removeItem(KeyStrings.accessToken);
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(getUserById.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.isLoading = false;

        const repeatedUser = state.allUsers.filter(
          (user: IUser) => user._id === action.payload._id
        );
        if (repeatedUser.length === 0)
          state.allUsers = [...state?.allUsers, { ...action.payload }];
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      })

      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'resolved';
        action.payload.data.forEach((user) => {
          const repeatedUser = state.allUsers.filter(
            (userInStore: IUser) => userInStore._id === user._id
          );
          if (repeatedUser.length === 0)
            state.allUsers = [...state?.allUsers, { ...user }];
        });
        state.usersToRender = [...action.payload.data.reverse()];
        state.paginationInfo = {
          lastPageNumber: Math.ceil(
            +state.paginationInfo.total / +state.paginationInfo.limit
          ),
          total: action.payload.pagination.total,
          limit: 20,
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = 'rejected';
        console.log(action.payload);
      });
  },
});

export const { clearUser, setInitialUsersToRenderState, setTheme } =
  userSlice.actions;

export const usersInfo = (state: RootState) => state.user;

export default userSlice.reducer;
