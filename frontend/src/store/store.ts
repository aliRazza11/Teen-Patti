import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import gameStateReducer from "../slices/gameStateSlice";
import messageStateReducer from "../slices/messageSlice";

export const reduxStore = configureStore({
  reducer: {
    user: userReducer,
    game: gameStateReducer,
    message: messageStateReducer,
  },
});
