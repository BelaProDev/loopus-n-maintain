import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessQueries } from '@/lib/db/businessDb';
import type { Client, Provider, Invoice } from '@/types/business';

// Define the state interface
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

// Create async thunks with explicit return types
export const fetchClients = createAsyncThunk<Client[]>(
  'business/fetchClients',
  async () => {
    const clients = await businessQueries.getClients();
    return clients;
  }
);

export const fetchProviders = createAsyncThunk<Provider[]>(
  'business/fetchProviders',
  async () => {
    const providers = await businessQueries.getProviders();
    return providers;
  }
);

export const fetchInvoices = createAsyncThunk<Invoice[]>(
  'business/fetchInvoices',
  async () => {
    const invoices = await businessQueries.getInvoices();
    return invoices;
  }
);

// Create the slice with properly typed reducers
const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    resetBusinessState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Client cases
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.clients = payload;
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch clients';
      })
      // Provider cases
      .addCase(fetchProviders.fulfilled, (state, { payload }) => {
        state.providers = payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to fetch providers';
      })
      // Invoice cases
      .addCase(fetchInvoices.fulfilled, (state, { payload }) => {
        state.invoices = payload;
        state.error = null;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to fetch invoices';
      });
  },
});

export const { resetBusinessState } = businessSlice.actions;
export default businessSlice.reducer;