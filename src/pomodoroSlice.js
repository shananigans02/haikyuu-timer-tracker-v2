import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pomodoroList: [],
  timeLeft: 0,
  isRunning: false,
  startTime: null,
  lastStartTime: null,
  totalElapsedTime: 0,
  currentCategory: '',
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    addPomodoro: (state, action) => {
      state.pomodoroList.push(action.payload);
    },
    deletePomodoro: (state, action) => {
      state.pomodoroList.splice(action.payload, 1);
    },
    updateTimerState: (state, action) => {
      return { ...state, ...action.payload };
    },
    updatePomodoroGoal: (state, action) => {
      const { category, goal } = action.payload;
      state.pomodoroList = state.pomodoroList.map(pomodoro => 
        pomodoro.category === category ? { ...pomodoro, goal } : pomodoro
      );
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { 
  addPomodoro, 
  deletePomodoro, 
  updateTimerState, 
  updatePomodoroGoal,
  setCurrentCategory
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;