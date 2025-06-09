import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Базовый URL API
const API_URL = '/api/auth';

// Получение пользователя из localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Регистрация пользователя
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(`${API_URL}/register`, userData, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка при регистрации'
      );
    }
  }
);

// Авторизация пользователя
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(`${API_URL}/login`, userData, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Неверный email или пароль'
      );
    }
  }
);

// Получение профиля пользователя
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/profile`, config);
      
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Не удалось получить профиль'
      );
    }
  }
);

// Обновление профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(`${API_URL}/profile`, userData, config);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Не удалось обновить профиль'
      );
    }
  }
);

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    resetAuthState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка getUserProfile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          ...action.payload,
        };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;

export default authSlice.reducer; 