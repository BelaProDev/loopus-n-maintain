import { configureStore } from '@reduxjs/toolkit';
import emailsReducer from './slices/emailsSlice';
import businessReducer from './slices/businessSlice';
import documentsReducer from './slices/documentsSlice';
import servicesReducer from './slices/servicesSlice';

export const store = configureStore({
  reducer: {
    emails: emailsReducer,
    business: businessReducer,
    documents: documentsReducer,
    services: servicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;