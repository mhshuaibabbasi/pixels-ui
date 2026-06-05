import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

/**
 * Pre-typed useDispatch hook
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Pre-typed useSelector hook
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Custom hook to access authentication state
 */
export const useAuth = () => {
  const { isAuthenticated, user, token, isLoading, error } = useAppSelector(state => state.auth)
  return { isAuthenticated, user, token, isLoading, error }
}

/**
 * Custom hook to access UI state
 */
export const useUI = () => {
  const { isLoginModalOpen, isMobileMenuOpen } = useAppSelector(state => state.ui)
  return { isLoginModalOpen, isMobileMenuOpen }
}
