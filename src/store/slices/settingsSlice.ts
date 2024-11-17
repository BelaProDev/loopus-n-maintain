import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  offlineMode: boolean;
  lastSync: string | null;
  performance: {
    enableAnimations: boolean;
    lowBandwidthMode: boolean;
    prefetchResources: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  storage: {
    cacheSize: number;
    lastCacheClear: string | null;
    autoCleanup: boolean;
  };
}

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: true,
  offlineMode: false,
  lastSync: null,
  performance: {
    enableAnimations: true,
    lowBandwidthMode: false,
    prefetchResources: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
  },
  storage: {
    cacheSize: 0,
    lastCacheClear: null,
    autoCleanup: true,
  }
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
    updatePerformanceSettings: (state, action: PayloadAction<Partial<SettingsState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    updateAccessibilitySettings: (state, action: PayloadAction<Partial<SettingsState['accessibility']>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    updateStorageSettings: (state, action: PayloadAction<Partial<SettingsState['storage']>>) => {
      state.storage = { ...state.storage, ...action.payload };
    },
    clearCache: (state) => {
      state.storage.lastCacheClear = new Date().toISOString();
      state.storage.cacheSize = 0;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotifications,
  setOfflineMode,
  updateLastSync,
  updatePerformanceSettings,
  updateAccessibilitySettings,
  updateStorageSettings,
  clearCache,
} = settingsSlice.actions;

export default settingsSlice.reducer;