import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { businessQueries } from '@/lib/db/businessDb';
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

// Async thunks
export const fetchClients = createAsyncThunk(
  'business/fetchClients',
  async () => {
    const response = await businessQueries.getClients();
    return response;
  }
);

export const fetchProviders = createAsyncThunk(
  'business/fetchProviders',
  async () => {
    const response = await businessQueries.getProviders();
    return response;
  }
);

export const fetchInvoices = createAsyncThunk(
  'business/fetchInvoices',
  async () => {
    const response = await businessQueries.getInvoices();
    return response;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    resetBusinessState: () => initialState,
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

export const { resetBusinessState } = businessSlice.actions;
export default businessSlice.reducer;