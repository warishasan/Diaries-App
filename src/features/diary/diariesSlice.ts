import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Diary } from '../../Interfaces/diary.interface';
import http from '../../services/api';
import { showAlert } from '../../util';


export interface diariesState {

  diary: Diary[];
  isLoading: Boolean;
  error: Boolean;

}

const initialState: diariesState = { diary: [], isLoading: false, error: false }



export const fetchDiaryData: any = createAsyncThunk(
  'fetchDiaries',
  async (id: string, thunkAPI) => {

    try {
      const response = await http.get<null, Diary[]>(`/diaries/${id}`)
      return response
    }
    catch (err) {
      console.log(err.response.data.data.message)
      return (err.response.data.data.message)
    }


  }
)




const diaries = createSlice({
  name: 'diaries',
  initialState: initialState,
  reducers: {
    removeDiaries() {
      return ({diary: [], isLoading: false, error: false});
    },

  },

  extraReducers: {
    [fetchDiaryData.fulfilled]: (state, action) => {

      if (typeof action.payload === "object") {

        return ({
          ...state, diary: action.payload.diaries, isLoading: false, error: false
        })
      }
      
      else {
        
  
        showAlert(action.payload, 'error');

        return({
          ...state, isLoading: false
        })

        /*
        return ({
          ...state, diary: [], isLoading: false, error: action.payload


        })*/
      }

    },
    [fetchDiaryData.pending]: (state, action) => {
      return ({
        ...state, isLoading: true
      })

    },

    [fetchDiaryData.rejected]: (state, action) => {
      return ({
        ...state, isLoading: false, error: true, diary: []
      })

    },
    
  },



}
);

export const { removeDiaries } = diaries.actions;

export default diaries.reducer;