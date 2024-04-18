import { createSlice } from "@reduxjs/toolkit";
export interface MessageState {
  received: String[];
}
const initialState: MessageState = {
  received: [],
};
export const messageSlice = createSlice({
  name: "message",
  initialState,

  reducers: {
    UpdateReceived: (state, action) => {
      state.received.push(action.payload);
    },

    DeleteReceived: (state) => {
      state.received = [];
    },

    ResetMsgState: (state) => {
      return initialState;
    },
  },
});
export const { UpdateReceived, DeleteReceived, ResetMsgState } =
  messageSlice.actions;
export default messageSlice.reducer;
