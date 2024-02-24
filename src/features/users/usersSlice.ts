import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export interface User {
  id: number;
  name: string;
}
const initialState: Array<User> = [];
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;
export const selectUserById = (state: RootState, userId: number) =>
  state.users.find((user) => Number(user.id) == Number(userId));

export default usersSlice.reducer;
