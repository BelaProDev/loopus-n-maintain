import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContactMessage } from '@/lib/fauna/types';

type ServiceName = ContactMessage['service'];

interface ServicesState {
  availableServices: ServiceName[];
  implementedServices: ServiceName[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  availableServices: ['electrical', 'plumbing', 'ironwork', 'woodwork', 'architecture'],
  implementedServices: ['plumbing', 'ironwork', 'architecture', 'electrical', 'woodwork'],
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