import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServicesState {
  availableServices: string[];
  implementedServices: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  availableServices: ['electrics', 'plumbing', 'ironwork', 'woodwork', 'architecture'],
  implementedServices: ['plumbing', 'ironwork', 'architecture', 'electrics', 'woodwork'],
  status: 'idle',
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<ServicesState['status']>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setStatus, setError, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;