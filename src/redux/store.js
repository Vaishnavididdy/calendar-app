import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './slices/eventSlice';
import goalReducer from './slices/goalSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    goals: goalReducer,
  },
});