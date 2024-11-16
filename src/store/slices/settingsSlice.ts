import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  offlineMode: boolean;
  lastSync: string | null;
}

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: true,
  offlineMode: false,
  lastSync: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.offlineMode = action.payload;
    },
    updateLastSync: (state) => {
      state.lastSync = new Date().toISOString();
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotifications,
  setOfflineMode,
  updateLastSync,
} = settingsSlice.actions;

export default settingsSlice.reducer;