import { configureStore } from '@reduxjs/toolkit';
import emailsReducer from './slices/emailsSlice';
import servicesReducer from './slices/servicesSlice';
import explorerReducer from './slices/explorerSlice';
import documentsReducer from './slices/documentsSlice';
import settingsReducer from './slices/settingsSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    emails: emailsReducer,
    services: servicesReducer,
    explorer: explorerReducer,
    documents: documentsReducer,
    settings: settingsReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['some.path.to.ignore'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;