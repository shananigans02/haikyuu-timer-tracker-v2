import { configureStore } from '@reduxjs/toolkit';
import pomodoroReducer from './pomodoroSlice';

export const store = configureStore({
  reducer: {
    pomodoro: pomodoroReducer,
  },
});
