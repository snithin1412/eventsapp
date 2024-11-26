import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const login = createAsyncThunk(
  "auth/login",
  async (loginObj, thunkAPI) => {
    console.log(loginObj);
    return api
      .loginApi(loginObj, 1000)
      .then((res) => res)
      .catch((err) => {
        console.log("err", err);
        return thunkAPI.rejectWithValue("fail");
      });
  }
);

const authSlice = createSlice({
  initialState: {
    user: null,
    error: null,
    status: "",
    bookingHistory: [],
  },
  name: "auth",
  reducers: {
    addBookingHistory: (state, action) => {
      state.bookingHistory.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "completed";
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const { logout, addBookingHistory } = authSlice.actions;
export default authSlice.reducer;
