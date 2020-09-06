import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../Interfaces/user.interface';
import http from '../../services/api';
import { AuthResponse } from '../../services/mirage/routes/user';
import { showAlert } from '../../util';


export interface userState {

  user: User | null;
  isLoading: Boolean;
  error: Boolean;
  token: string | null;
  isAuthenticated: boolean;

}



const initialState: userState = { user: null, isLoading: false, error: false, token: null, isAuthenticated: false }

export const fetchUser: any = createAsyncThunk(
  'login',
  async (user: Partial<User>, thunkAPI) => {

    try {
      const response = await http.post<User, AuthResponse>("/auth/login", { username: user.username, password: user.password })
      return response
    }
    catch (err) {
      console.log(err.response.data.data.message)

     return (err.response.data.data.message)
    }


  }
)



const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User | null>) {
      return { ...state, user: (payload != null) ? payload : null };
    },
    saveToken(state, { payload }: PayloadAction<string | null>) {

      return ({ ...state, token: payload })

    },
    setAuthState(state, { payload }: PayloadAction<boolean>) {
      return ({ ...state, isAuthenticated: payload })
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [fetchUser.fulfilled]: (state, action) => {

      if (typeof action.payload === "object") {
        return ({

          ...state, user: action.payload.user, isLoading: false, error: false, token: action.payload.token, isAuthenticated: true
        }
        )

      }
      
      else {

  
        showAlert(action.payload, 'error');

        return({
          ...state, isLoading: false
        })
/*
        return ({

          ...state, user: null, isLoading: false, error: action.payload, token: null, isAuthenticated: false
        }
        )
*/
      }
      
    },
    [fetchUser.pending]: (state, action) => {
      return ({
        ...state, isLoading: true
      }
      )

    },

    
    [fetchUser.rejected]: (state, action) => {
      return ({
        ...state, isLoading: false, error: true, token: null, isAuthenticated: false
      }
      )

    },
    
  }
});

export const { setUser, saveToken, setAuthState } = user.actions;

export default user.reducer;
