import { createSlice } from '@reduxjs/toolkit';

const goalSlice = createSlice({
  name: 'goals',
  initialState: {
    goals: [
      { name: 'Be fit', tasks: ['Workout', 'Yoga', 'Running'], color: '#FFCCBC' }, // Light peach
      { name: 'Academics', tasks: ['Study Math', 'Write Essay', 'Revise Notes'], color: '#BBDEFB' }, // Light blue
      { name: 'Learn', tasks: ['AI based agents', 'MLE', 'DE related', 'Basics'], color: '#C8E6C9' }, // Light green
      { name: 'Sports', tasks: ['Soccer', 'Basketball', 'Swimming'], color: '#DCCCEC' }, // Your chosen pastel purple
    ],
    selectedGoal: null,
  },
  reducers: {
    selectGoal: (state, action) => {
      state.selectedGoal = action.payload;
    },
  },
});

export const { selectGoal } = goalSlice.actions;
export default goalSlice.reducer;