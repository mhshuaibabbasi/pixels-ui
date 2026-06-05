import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../reducer/authSlice'
import uiReducer from '../reducer/uiSlice'

/**
 * Redux Store Configuration
 * Combines all reducers and configures store with proper middleware
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks if needed
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
})

/**
 * Infer the `RootState` type from the store itself
 */
export type RootState = ReturnType<typeof store.getState>

/**
 * Inferred type for dispatch
 */
export type AppDispatch = typeof store.dispatch
