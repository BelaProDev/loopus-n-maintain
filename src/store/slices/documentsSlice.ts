import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Document {
  id: string;
  name: string;
  path: string;
  type: string;
}

interface DocumentsState {
  items: Document[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DocumentsState = {
  items: [],
  status: 'idle',
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default documentsSlice.reducer;