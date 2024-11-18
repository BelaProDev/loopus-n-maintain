import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Client, Provider, Invoice } from '@/types/business';
import { businessQueries } from '@/lib/db/businessDb';

// Simple async thunks
export const fetchClients = createAsyncThunk('business/fetchClients', businessQueries.getClients);
export const fetchProviders = createAsyncThunk('business/fetchProviders', businessQueries.getProviders);
export const fetchInvoices = createAsyncThunk('business/fetchInvoices', businessQueries.getInvoices);

interface BusinessState {
  clients: Client[];
  providers: Provider[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  clients: [],
  providers: [],
  invoices: [],
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false;
          const actionType = action.type.split('/')[1];
          switch (actionType) {
            case 'fetchClients':
              state.clients = action.payload;
              break;
            case 'fetchProviders':
              state.providers = action.payload;
              break;
            case 'fetchInvoices':
              state.invoices = action.payload;
              break;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || 'An error occurred';
        }
      );
  },
});

export const { resetState } = businessSlice.actions;
export default businessSlice.reducer;