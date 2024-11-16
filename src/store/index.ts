import { configureStore } from '@reduxjs/toolkit';
import emailsReducer from './slices/emailsSlice';
import businessReducer from './slices/businessSlice';
import servicesReducer from './slices/servicesSlice';
import explorerReducer from './slices/explorerSlice';

export const store = configureStore({
  reducer: {
    emails: emailsReducer,
    business: businessReducer,
    services: servicesReducer,
    explorer: explorerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;