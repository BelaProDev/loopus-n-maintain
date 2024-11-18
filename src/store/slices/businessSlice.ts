import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessQueries } from '@/lib/fauna/business';
import type { Client, Provider, Invoice } from '@/types/business';

interface BusinessState {
  clients: Client[];
  providers: Provider[];
  invoices: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BusinessState = {
  clients: [],
  providers: [],
  invoices: [],
  status: 'idle',
  error: null,
};

export const fetchClients = createAsyncThunk('business/fetchClients', async () => {
  return await businessQueries.getClients();
});

export const fetchProviders = createAsyncThunk('business/fetchProviders', async () => {
  return await businessQueries.getProviders();
});

export const fetchInvoices = createAsyncThunk('business/fetchInvoices', async () => {
  return await businessQueries.getInvoices();
});

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
      });
  },
});

export const { resetState } = businessSlice.actions;
export default businessSlice.reducer;