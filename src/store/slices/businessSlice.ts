import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
    resetState: (state) => {
      state.clients = [];
      state.providers = [];
      state.invoices = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Clients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch clients';
      })
      // Providers
      .addCase(fetchProviders.fulfilled, (state, action: PayloadAction<Provider[]>) => {
        state.providers = action.payload;
      })
      // Invoices
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.invoices = action.payload;
      });
  },
});

export const { resetState } = businessSlice.actions;
export default businessSlice.reducer;