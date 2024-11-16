import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileMetadata } from '@/lib/document/documentUtils';

interface DocumentsState {
  files: FileMetadata[];
  currentPath: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  files: [],
  currentPath: '/',
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileMetadata[]>) => {
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setFiles, 
  setCurrentPath, 
  setAuthenticated, 
  setLoading, 
  setError 
} = documentsSlice.actions;

export default documentsSlice.reducer;