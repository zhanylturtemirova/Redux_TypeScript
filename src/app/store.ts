import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import postReducer from "../features/post/postSlice";
import userReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: { counter: counterReducer, posts: postReducer, users: userReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
