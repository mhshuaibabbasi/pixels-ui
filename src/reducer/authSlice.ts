import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { localService } from '../services/local';
import { login as loginAPI, register as registerAPI } from '../api/authAPI';

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  address?: string;
  status?: string;
  logo?: string;
  join_date?: string;
  employment_status?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Track if auth state has been initialized
}

/**
 * Retrieves stored user data from localStorage
 */
const getStoredUser = (): User | null => {
  try {
    const userData = localService.getUser();
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        id: parsed.user_id || parsed.id,
        email: parsed.email,
        name: parsed.full_name || parsed.name,
        phone: parsed.phone,
        role: parsed.role || 'User',
        address: parsed.address,
        status: parsed.status,
        logo: parsed.logo,
        join_date: parsed.join_date,
        employment_status: parsed.employment_status,
      };
    }
  } catch {
    // If parsing fails, return null
  }
  return null;
};

/**
 * Get initial authentication state from storage
 */
const getInitialAuthState = (): { token: string | null; isAuthenticated: boolean; user: User | null } => {
  const token = localService.getToken();
  return {
    token,
    isAuthenticated: !!token,
    user: token ? getStoredUser() : null,
  };
};

const { token: initialToken, isAuthenticated: initialIsAuth, user: initialUser } = getInitialAuthState();

const initialState: AuthState = {
  isAuthenticated: initialIsAuth,
  user: initialUser,
  token: initialToken,
  isLoading: false,
  error: null,
  isInitialized: true, // Set to true after first load
};

/**
 * Async thunk for user login
 */
export const login = createAsyncThunk(
  'auth/login',
  async (payload: { emailID?: string; email?: string; password: string }, thunkAPI) => {
    try {
      const response = await loginAPI(payload);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Async thunk for user registration
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: any, thunkAPI) => {
    try {
      const response = await registerAPI(payload);
      return response.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout user and clear authentication data
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localService.removeToken();
    },
    
    /**
     * Clear error messages
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Update user information and sync with localStorage
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Sync with localStorage
        const stored = localService.getUser();
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localService.setUser(JSON.stringify({ ...parsed, ...action.payload }));
          } catch {
            // ignore parse errors
          }
        }
      }
    },

    /**
     * Restore authentication state from localStorage (for app initialization)
     */
    rehydrateAuth: (state) => {
      const { token, isAuthenticated, user } = getInitialAuthState();
      state.token = token;
      state.isAuthenticated = isAuthenticated;
      state.user = user;
      state.isInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Handle Login - Pending
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Login - Fulfilled
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = localService.getToken();
        state.error = null;
      })
      // Handle Login - Rejected
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Handle Register - Pending
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Handle Register - Fulfilled
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = localService.getToken();
        state.error = null;
      })
      // Handle Register - Rejected
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, updateUser, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;