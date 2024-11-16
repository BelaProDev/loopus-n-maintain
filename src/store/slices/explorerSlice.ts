import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DropboxFile } from '@/types/dropbox';

interface ExplorerState {
  files: DropboxFile[];
  currentPath: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
}

const initialState: ExplorerState = {
  files: [],
  currentPath: '/',
  isAuthenticated: false,
  isLoading: false,
  selectedFiles: [],
  viewMode: 'grid'
};

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<DropboxFile[]>) => {
      state.files = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleFileSelection: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      const index = state.selectedFiles.indexOf(fileId);
      if (index === -1) {
        state.selectedFiles.push(fileId);
      } else {
        state.selectedFiles.splice(index, 1);
      }
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    clearSelection: (state) => {
      state.selectedFiles = [];
    }
  }
});

export const {
  setFiles,
  setCurrentPath,
  setAuthenticated,
  setLoading,
  toggleFileSelection,
  setViewMode,
  clearSelection
} = explorerSlice.actions;

export default explorerSlice.reducer;