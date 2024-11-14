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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
      });
  },
});

export default businessSlice.reducer;