import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { Entry } from '../../Interfaces/entry.interface';
import http from '../../services/api';
import { showAlert } from '../../util';




export interface entryState {

  entries: Entry[];
  isLoading: boolean;
  error: boolean;


}

const intialState = { entries: [], isLoading: false, error: false }

export const fetchEntriesData: any = createAsyncThunk(
  'fetchEntries',
  async (id: string, thunkAPI) => {

    try {
      const response = await http.get<null, Entry[]>(`/diaries/entries/${id}`)
      return response
    }
    catch (err) {
      console.log(err.response.data.data.message)
      return (err.response.data.data.message)
    }


  }
)




const entries = createSlice({
  name: 'entries',
  initialState: intialState,
  reducers: {
    removeEntries() {
      return ({entries: [], isLoading: false, error: false});
    },

  },

  extraReducers: {

    [fetchEntriesData.fulfilled]: (state, action) => {

      if (typeof action.payload === "object") {
        return ({
          ...state, entries: action.payload.entries, isLoading: false, error: false
        })
      }
      
      
      else {

        
        showAlert(action.payload, 'error');

        return({
          ...state, isLoading: false
        })
/*
        return ({
          ...state, entries: [], isLoading: false, error: action.payload

        })
        */
      }
      

    },


    [fetchEntriesData.pending]: (state, action) => {


      return ({
        ...state, isLoading: true
      })


    },




    [fetchEntriesData.rejected]: (state, action) => {

      return ({
        ...state, entries:[], isLoading: false, error: true
      })

    },
    


  }

});

export const { removeEntries } = entries.actions;

export default entries.reducer;