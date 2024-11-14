import { createSlice } from '@reduxjs/toolkit';

interface ServicesState {
  availableServices: string[];
  implementedServices: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  availableServices: ['electrics', 'plumbing', 'ironwork', 'woodwork', 'architecture'],
  implementedServices: ['plumbing', 'ironwork', 'architecture'],
  status: 'idle',
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setImplementedService(state, action) {
      const service = action.payload;
      if (!state.implementedServices.includes(service)) {
        state.implementedServices.push(service);
      }
    },
  },
});

export const { setImplementedService } = servicesSlice.actions;
export default servicesSlice.reducer;