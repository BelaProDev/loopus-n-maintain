import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Client, Provider, Invoice } from '@/types/business';
import { businessQueries } from '@/lib/db/businessDb';

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      })
      // Fetch Providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch providers';
      })
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      });
  },
});

export default businessSlice.reducer;