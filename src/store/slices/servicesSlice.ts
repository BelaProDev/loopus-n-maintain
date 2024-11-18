import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServicesState {
  selectedService: 'electrics' | 'plumbing' | 'ironwork' | 'woodwork' | 'architecture';
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  selectedService: 'electrics',
  loading: false,
  error: null
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<ServicesState['selectedService']>) => {
      state.selectedService = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setSelectedService, setLoading, setError } = servicesSlice.actions;
export default servicesSlice.reducer;