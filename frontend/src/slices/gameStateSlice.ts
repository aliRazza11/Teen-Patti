import { createSlice } from "@reduxjs/toolkit";
export interface GameState {
  myFaceUpCards: [];
  // myFaceDownCards: [];
  facedownlength: Number;
  myCardsInHand: [];
  cardPile: [];
  p2FaceUpCards: [];
  p2facedownlength: Number;
  p2id: Number;
  p3FaceUpCards: [];
  p3facedownlength: Number;
  p3id: Number;
  p4FaceUpCards: [];
  p4facedownlength: Number;
  p4id: Number;
  playerNames: [];
  turn: String;
  decklength: Number;
}
const initialState: GameState = {
  myFaceUpCards: [],
  // myFaceDownCards: [],
  facedownlength: 0,
  myCardsInHand: [],
  cardPile: [],
  p2FaceUpCards: [],
  p2facedownlength: 0,
  p2id: -1,
  p3FaceUpCards: [],
  p3facedownlength: 0,
  p3id: -1,
  p4FaceUpCards: [],
  p4facedownlength: 0,
  p4id: -1,
  playerNames: [],
  turn: "",
  decklength: -1,
};
export const gameStateSlice = createSlice({
  name: "game",
  initialState,

  reducers: {
    UpdatemyFaceUpCards: (state, action) => {
      state.myFaceUpCards = action.payload;
    },

    UpdateFaceDownLen: (state, action) => {
      state.facedownlength = action.payload;
    },

    UpdateP2FaceDownLen: (state, action) => {
      state.p2facedownlength = action.payload;
    },

    UpdateP3FaceDownLen: (state, action) => {
      state.p3facedownlength = action.payload;
    },
    UpdateP4FaceDownLen: (state, action) => {
      console.log("P4LENUPD");
      state.p4facedownlength = action.payload;
    },

    UpdatemyCardsInHand: (state, action) => {
      state.myCardsInHand = action.payload;
    },

    Updatep2FaceUpCards: (state, action) => {
      state.p2FaceUpCards = action.payload;
    },

    Updatep2Id: (state, action) => {
      state.p2id = action.payload;
    },

    Updatep3Id: (state, action) => {
      state.p3id = action.payload;
    },

    Updatep4Id: (state, action) => {
      state.p4id = action.payload;
    },

    Updatep3FaceUpCards: (state, action) => {
      state.p3FaceUpCards = action.payload;
    },

    Updatep4FaceUpCards: (state, action) => {
      state.p4FaceUpCards = action.payload;
    },

    UpdateCardPile: (state, action) => {
      state.cardPile = action.payload;
    },

    UpdatePlayerNames: (state, action) => {
      state.playerNames = action.payload;
    },

    UpdateTurn: (state, action) => {
      state.turn = action.payload;
    },

    UpdateDeckLength: (state, action) => {
      state.decklength = action.payload;
    },

    ResetGameState: (state) => {
      return initialState;
    },
  },
});
export const {
  UpdatemyFaceUpCards,
  UpdateFaceDownLen,
  UpdateP2FaceDownLen,
  Updatep2Id,
  Updatep3Id,
  Updatep4Id,
  UpdateP3FaceDownLen,
  UpdateP4FaceDownLen,
  UpdatemyCardsInHand,
  Updatep2FaceUpCards,
  Updatep3FaceUpCards,
  Updatep4FaceUpCards,
  UpdateCardPile,
  UpdatePlayerNames,
  UpdateTurn,
  UpdateDeckLength,
  ResetGameState,
} = gameStateSlice.actions;
export default gameStateSlice.reducer;
