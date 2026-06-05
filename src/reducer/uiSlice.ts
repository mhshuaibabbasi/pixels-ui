import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoginModalOpen: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isLoginModalOpen: false,
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isLoginModalOpen = action.payload;
    },
    toggleLoginModal: (state) => {
      state.isLoginModalOpen = !state.isLoginModalOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeAllModals: (state) => {
      state.isLoginModalOpen = false;
      state.isMobileMenuOpen = false;
    },
  },
});

export const { 
  setLoginModalOpen, 
  toggleLoginModal, 
  setMobileMenuOpen, 
  toggleMobileMenu,
  closeAllModals 
} = uiSlice.actions;

export default uiSlice.reducer;
