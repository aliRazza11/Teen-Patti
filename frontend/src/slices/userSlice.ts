import { createSlice } from "@reduxjs/toolkit";
export interface UserState {
  clientid: String;
  username: String;
}
const initialState: UserState = {
  clientid: "",
  username: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    Updateclientid: (state, action) => {
      state.clientid = action.payload;
    },

    UpdateUsername: (state, action) => {
      state.username = action.payload;
    },

    ResetUserState: (state) => {
      return initialState;
    },
  },
});
export const { Updateclientid, UpdateUsername, ResetUserState } =
  userSlice.actions;
export default userSlice.reducer;
