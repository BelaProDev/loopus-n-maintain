import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { businessQueries } from '@/lib/db/businessDb';
import type { Client, Provider, Invoice } from '@/types/business';

interface BusinessState {
  clients: Client[];
  providers: Provider[];
  invoices: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: SerializedError | null;
}

const initialState: BusinessState = {
  clients: [],
  providers: [],
  invoices: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchClients = createAsyncThunk(
  'business/fetchClients',
  async () => {
    return await businessQueries.getClients();
  }
);

export const fetchProviders = createAsyncThunk(
  'business/fetchProviders',
  async () => {
    return await businessQueries.getProviders();
  }
);

export const fetchInvoices = createAsyncThunk(
  'business/fetchInvoices',
  async () => {
    return await businessQueries.getInvoices();
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    resetBusinessState: () => initialState,
  },
  extraReducers: (builder) => {
    // Client cases
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      })
      // Provider cases
      .addCase(fetchProviders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.error = action.error;
      })
      // Invoice cases  
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export const { resetBusinessState } = businessSlice.actions;
export default businessSlice.reducer;