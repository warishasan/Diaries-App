import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './features/auth/userSlice';
import diariesReducer from './features/diary/diariesSlice';
import entriesReducer from './features/entry/entriesSlice';
import selectedDiary from './features/diary/diarySelectedSlice';

const rootReducer = combineReducers({
  diaries: diariesReducer,
  entries: entriesReducer,
  user: userReducer,
  selectedDiary: selectedDiary
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;