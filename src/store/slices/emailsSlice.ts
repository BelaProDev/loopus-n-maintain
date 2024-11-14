import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emailQueries } from '@/lib/fauna/emailQueries';
import type { Email } from '@/hooks/useEmails';

interface EmailsState {
  items: Email[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmailsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async () => {
    const response = await emailQueries.getAllEmails();
    return response;
  }
);

export const createEmail = createAsyncThunk(
  'emails/createEmail',
  async (emailData: any) => {
    const response = await emailQueries.createEmail(emailData);
    return response;
  }
);

const emailsSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createEmail.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default emailsSlice.reducer;