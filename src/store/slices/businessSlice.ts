import { createSlice } from '@reduxjs/toolkit';
import type { Client, Provider, Invoice } from '@/types/business';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { businessQueries } from '@/lib/db/businessDb';

// Simple async thunks
export const fetchClients = createAsyncThunk('business/fetchClients', businessQueries.getClients);
export const fetchProviders = createAsyncThunk('business/fetchProviders', businessQueries.getProviders);
export const fetchInvoices = createAsyncThunk('business/fetchInvoices', businessQueries.getInvoices);

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    clients: [] as Client[],
    providers: [] as Provider[],
    invoices: [] as Invoice[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    resetState: (state) => {
      state.clients = [];
      state.providers = [];
      state.invoices = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle all pending states
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Handle all fulfilled states
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state, action) => {
        state.loading = false;
        if (action.type.startsWith('business/fetchClients')) {
          state.clients = action.payload;
        } else if (action.type.startsWith('business/fetchProviders')) {
          state.providers = action.payload;
        } else if (action.type.startsWith('business/fetchInvoices')) {
          state.invoices = action.payload;
        }
      }
    );

    // Handle all rejected states
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      }
    );
  },
});

export const { resetState } = businessSlice.actions;
export default businessSlice.reducer;