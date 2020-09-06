import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Diary } from '../../Interfaces/diary.interface';







const selectedDiary = createSlice({
  name: 'selectedDiary',
  initialState: null as Diary | null,
  reducers: {
    selectDiary(state, { payload }: PayloadAction<Diary | null>) {
      return payload;
    },


  },


}
);


export default selectedDiary.reducer;
export const { selectDiary } = selectedDiary.actions;
