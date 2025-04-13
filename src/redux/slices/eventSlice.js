import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) state.events[index] = action.payload;
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter((e) => e._id !== action.payload);
    },
  },
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;