const { Socket } = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

let clientIdList = new Array();
let socketIdList = new Array();
let sockets = new Array();
let usernameList = new Array();

let cardsByValue = [
  "a",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k",
];
let suits = ["clubs", "hearts", "spades", "diams"];
let cardPile: String[] = [];
let powerCards = ["2", "7", "8", "10"];

class Deck {
  public deck: String[];
  public constructor() {
    this.deck = [];
  }
  public initializeDeck() {
    let temp_deck: String[] = [];
    for (let x in suits) {
      for (let y in cardsByValue) {
        temp_deck.push(cardsByValue[y] + " " + suits[x]);
      }
    }
    this.deck = temp_deck.sort((a, b) => 0.5 - Math.random());
  }
  public getTopCard() {
    return this.deck.pop();
  }
  public initialNineCards() {
    let faceupCards: String[] = [];
    let facedownCards: String[] = [];
    let cardsinHand: String[] = [];
    for (let i = 0; i < 3; i++) {
      faceupCards.push(this.getTopCard()!);
      facedownCards.push(this.getTopCard()!);
      cardsinHand.push(this.getTopCard()!);
    }
    return {
      faceup: faceupCards,
      facedown: facedownCards,
      inhand: cardsinHand,
    };
  }
  public getLength() {
    return this.deck.length;
  }
}

let deck = new Deck();

class Player {
  public faceUpCards: String[];
  public faceDownCards: String[];
  public cardsInHand: String[];
  public id: Number;
  public constructor() {
    this.faceUpCards = [];
    this.faceDownCards = [];
    this.cardsInHand = [];
    this.id = -1;
  }

  public setFaceUpCards(data: any) {
    this.faceUpCards = data;
  }

  public setFaceDownCards(data: any) {
    this.faceDownCards = data;
  }

  public setCardsInHand(data: any) {
    this.cardsInHand = data;
  }

  public setState(data: any, id: any) {
    const { faceup, facedown, inhand } = data;
    this.faceUpCards = faceup;
    this.faceDownCards = facedown;
    this.cardsInHand = inhand;
    this.id = id;
  }

  public getState() {
    return {
      faceup: this.faceUpCards,
      facedown: this.faceDownCards.length,
      inhand: this.cardsInHand,
      id: this.id,
    };
  }
}

const p1 = new Player();
const p2 = new Player();
const p3 = new Player();
const p4 = new Player();

const initializePlayers = () => {
  p1.setState(deck.initialNineCards(), 1);
  p2.setState(deck.initialNineCards(), 2);
  p3.setState(deck.initialNineCards(), 3);
  p4.setState(deck.initialNineCards(), 4);

  const result: any[] = [];
  result.push(p1.getState());
  result.push(p2.getState());
  result.push(p3.getState());
  result.push(p4.getState());

  return result;
};

const addClient = (data: any, socket: any) => {
  const clientid = data.clientid;
  const socketid = data.socketid;
  const username = data.username;
  if (clientIdList.includes(clientid)) {
    const index = clientIdList.indexOf(clientid);
    socketIdList[index] = socketid;
    sockets[index] = socket;
    usernameList[index] = username;
  } else {
    clientIdList.push(clientid);
    socketIdList.push(socketid);
    sockets.push(socket);
    usernameList.push(username);
  }
};

const removeClient = (socketid: any) => {
  const clientid = clientIdList[socketIdList.indexOf(socketid)];
  socketIdList = socketIdList.filter((item) => item != socketid);
  clientIdList = clientIdList.filter((item) => item != clientid);
};

const checkAllConnected = () => {
  if (clientIdList.length == 4) {
    return true;
  }
  return false;
};

let counter = 1;
let gameStarted = false;
let turn = -1;
let lowTurn = false;
let anyCard = false;
let globalmsg = "";

const calcTurn = () => {
  return ((turn + 1) % 4) + 1;
};

const generateMessage = (input: any) => {
  return [input];
};

const compareCardValues = (card1: any, card2: any) => {
  if (!lowTurn) {
    if (cardsByValue.indexOf(card1) >= cardsByValue.indexOf(card2)) {
      return true;
    }
    return false;
  } else {
    if (cardsByValue.indexOf(card1) <= cardsByValue.indexOf(card2)) {
      return true;
    }
    return false;
  }
};

const checkMoveLegality = (cardPlayed: any) => {
  if (anyCard || cardPile.length == 0) {
    return true;
  }
  let i = cardPile.length - 1;
  let cardOnTopofPile = cardPile[i];
  if (cardOnTopofPile == undefined) {
    cardOnTopofPile = "";
  }
  try {
    while (cardOnTopofPile.split(" ")[0] == "8") {
      i--;
      try {
        cardOnTopofPile = cardPile[i];
      } catch (_) {
        cardOnTopofPile = "";
      }
    }
  } catch (_) {
    cardOnTopofPile = "";
  }
  if (
    compareCardValues(cardPlayed.split(" ")[0], cardOnTopofPile.split(" ")[0])
  ) {
    return true;
  }
  return false;
};

const playerToUpdate = (id: any) => {
  if (id == 1) {
    return p1;
  } else if (id == 2) {
    return p2;
  } else if (id == 3) {
    return p3;
  } else if (id == 4) {
    return p4;
  }
};

const removeCard = (list: any, card: any) => {
  const index = list.indexOf(card);
  list.splice(index, 1);
};

const addCard = (list: any, card: any) => {
  list.push(card);
};

const checkPowerCard = (card: any) => {
  if (powerCards.includes(card)) {
    return true;
  }
  return false;
};

const checkIfAnyPlayableCardInHand = (player: any) => {
  const cardsInHand = player.cardsInHand;
  for (const card of cardsInHand) {
    if (powerCards.includes(card)) {
      return true;
    }
    if (checkMoveLegality(card)) {
      return true;
    }
  }
  return false;
};
const cardPlayMsg = (card: any) => {
  let msg = card.split(" ")[0] + " of " + card.split(" ")[1];
  return msg;
};
const playPowerCard = (card: any, player: any, cardtype: any) => {
  if (card.split(" ")[0] == "2") {
    anyCard = true;
    cardPile.push(card);
    if (cardtype == "inhand") {
      removeCard(player?.cardsInHand, card);
      if (player?.cardsInHand.length < 3 && deck.getLength() != 0) {
        const newCard = deck.getTopCard();
        addCard(player?.cardsInHand, newCard);
      }
    } else if (cardtype == "faceup") {
      removeCard(player?.faceUpCards, card);
    } else if (cardtype == "facedown") {
      removeCard(player?.faceDownCards, card);
    }
    if (player?.faceDownCards != 0) {
      turn--;
    }
    globalmsg = "Refresh Card Played";
  } else if (card.split(" ")[0] == "7") {
    lowTurn = true;
    cardPile.push(card);
    if (cardtype == "inhand") {
      removeCard(player?.cardsInHand, card);
      if (player?.cardsInHand.length < 3 && deck.getLength() != 0) {
        const newCard = deck.getTopCard();
        addCard(player?.cardsInHand, newCard);
      }
    } else if (cardtype == "faceup") {
      removeCard(player?.faceUpCards, card);
    } else if (cardtype == "facedown") {
      removeCard(player?.faceDownCards, card);
    }
    globalmsg = "Low Card Played";
  } else if (card.split(" ")[0] == "8") {
    cardPile.push(card);
    if (cardtype == "inhand") {
      removeCard(player?.cardsInHand, card);
      if (player?.cardsInHand.length < 3 && deck.getLength() != 0) {
        const newCard = deck.getTopCard();
        addCard(player?.cardsInHand, newCard);
      }
    } else if (cardtype == "faceup") {
      removeCard(player?.faceUpCards, card);
    } else if (cardtype == "facedown") {
      removeCard(player?.faceDownCards, card);
    }
    globalmsg = "Invisible Card Played";
  } else if (card.split(" ")[0] == "10") {
    cardPile = [];
    if (cardtype == "inhand") {
      removeCard(player?.cardsInHand, card);
      if (player?.cardsInHand.length < 3 && deck.getLength() != 0) {
        const newCard = deck.getTopCard();
        addCard(player?.cardsInHand, newCard);
      }
    } else if (cardtype == "faceup") {
      removeCard(player?.faceUpCards, card);
    } else if (cardtype == "facedown") {
      removeCard(player?.faceDownCards, card);
    }
    globalmsg = "Burn Card Played";
  }
};

const playCardFromHand = (input: any) => {
  if (checkPowerCard(input.card.split(" ")[0])) {
    let player = playerToUpdate(input.id);
    playPowerCard(input.card, player, "inhand");

    return {
      inhand: player?.cardsInHand,
    };
  } else if (checkMoveLegality(input.card)) {
    // add played card to pile
    cardPile.push(input.card);
    // get player to update
    let player = playerToUpdate(input.id);
    // remove played card from hand
    removeCard(player?.cardsInHand, input.card);
    // get card from top of deck and add to hand
    if (player?.cardsInHand.length! < 3 && deck.getLength() != 0) {
      const newCard = deck.getTopCard();
      addCard(player?.cardsInHand, newCard);
    }
    return {
      inhand: player?.cardsInHand,
    };
  }

  return {
    Error: "Illegal",
  };
};
const playFaceUpCard = (input: any) => {
  if (checkPowerCard(input.card.split(" ")[0])) {
    let player = playerToUpdate(input.id);
    playPowerCard(input.card, player, "faceup");

    return {
      faceup: player?.faceUpCards,
    };
  } else if (checkMoveLegality(input.card)) {
    // add played card to pile
    cardPile.push(input.card);
    // get player to update
    let player = playerToUpdate(input.id);
    // remove played card from hand
    removeCard(player?.faceUpCards, input.card);
    // get card from top of deck and add to hand
    return {
      faceup: player?.faceUpCards,
    };
  }
  return {
    Error: "Illegal",
  };
};
const playFaceDownCard = (input: any) => {
  let player = playerToUpdate(input.id);
  let card = player!.faceDownCards[input.index];
  if (checkPowerCard(card.split(" ")[0])) {
    playPowerCard(card, player, "facedown");

    return {
      facedown: player?.faceDownCards.length,
      card: card,
    };
  }
  if (checkMoveLegality(card)) {
    cardPile.push(card);
    removeCard(player?.faceDownCards, card);
    return {
      facedown: player?.faceDownCards.length,
      card: card,
    };
  }

  return {
    Error: "Illegal",
  };
};

server.listen(3001, () => {
  console.log("SERVER IS LISTENING ON PORT 3001");
});
io.on("connection", (socket: any) => {
  console.log("user connected with a socket id", socket.id);
  socket.on("startGame", (myData: any) => {
    if (!gameStarted) {
      console.log("Recieved data", myData);
      if (myData.clientid == "") {
        console.log("Sending id", counter, " to ", myData.username);
        socket.emit("yourid", { id: counter });
        myData["clientid"] = counter;
        counter++;
      }
      addClient(myData, socket);
      if (checkAllConnected()) {
        deck.initializeDeck();
        cardPile.push(deck.getTopCard()!);
        const res = initializePlayers();
        sockets.forEach((conn, i) => {
          const toReturn = {
            you: i,
            state: res,
            usernames: usernameList,
            cardpile: cardPile,
            turn: calcTurn(),
            decklength: deck.getLength(),
          };
          console.log("Sending initial state to ", usernameList[i]);
          conn.emit("yourinitialState", toReturn);
        });
        const initMessage = `${usernameList[calcTurn() - 1]}'s Turn`;
        const msgToSend = generateMessage(initMessage);
        io.emit("redirect", function () {
          io.emit("message", { msg: msgToSend });
        });
        gameStarted = true;
      }
    } else {
      socket.emit("noStartGame");
    }
  });
  socket.on("playCard", (data: any) => {
    let oldgmsg = globalmsg;
    globalmsg = "";
    const result = playCardFromHand(data);
    if (result.hasOwnProperty("Error")) {
      socket.emit("message", { msg: generateMessage("Illegal Move") });
      globalmsg = oldgmsg;
    } else {
      socket.emit("updateHand", result);
      io.emit("message", {
        msg: generateMessage(
          `${cardPlayMsg(data.card)} played by ${usernameList[data.id - 1]}`
        ),
      });
      io.emit("updatePile", { cardpile: cardPile });
      turn += 1;
      if (globalmsg != "") {
        io.emit("message", { msg: generateMessage(globalmsg) });
      }
      const turnMessage = `${usernameList[calcTurn() - 1]}'s Turn`;
      io.emit("message", { msg: generateMessage(turnMessage) });
      io.emit("changeTurn", { turn: calcTurn(), decklength: deck.getLength() });
    }
    if (globalmsg != "Low Card Played") {
      lowTurn = false;
    }
    if (globalmsg != "Refresh Card Played") {
      anyCard = false;
    }
  });
  socket.on("pickPile", (data: any) => {
    const player = playerToUpdate(calcTurn());
    if (!checkIfAnyPlayableCardInHand(player)) {
      globalmsg = "";
      for (const card of cardPile) {
        addCard(player?.cardsInHand, card);
      }
      cardPile = [];
      let result = {
        inhand: player?.cardsInHand,
      };
      socket.emit("updateHand", result);
      io.emit("updatePile", { cardpile: cardPile });
      io.emit("message", {
        msg: generateMessage(
          `${
            usernameList[calcTurn() - 1]
          } had no playable cards so has picked up the pile!`
        ),
      });
      turn++;
      io.emit("changeTurn", { turn: calcTurn(), decklength: deck.getLength() });
      const turnMessage = `${usernameList[calcTurn() - 1]}'s Turn`;
      io.emit("message", { msg: generateMessage(turnMessage) });
    } else {
      socket.emit("message", { msg: generateMessage("Illegal Move") });
    }
  });
  socket.on("playFaceUpCard", (data: any) => {
    let oldgmsg = globalmsg;
    globalmsg = "";
    const result = playFaceUpCard(data);
    if (result.hasOwnProperty("Error")) {
      socket.emit("message", { msg: generateMessage("Illegal Move") });
      globalmsg = oldgmsg;
    } else {
      (result as any).id = data.id;
      io.emit("updateFaceUp", result);
      io.emit("message", {
        msg: generateMessage(
          `${cardPlayMsg(data.card)} played by ${usernameList[data.id - 1]}`
        ),
      });
      io.emit("updatePile", { cardpile: cardPile });
      turn += 1;
      if (globalmsg != "") {
        io.emit("message", { msg: generateMessage(globalmsg) });
      }
      const turnMessage = `${usernameList[calcTurn() - 1]}'s Turn`;
      io.emit("message", { msg: generateMessage(turnMessage) });
      io.emit("changeTurn", { turn: calcTurn(), decklength: deck.getLength() });
    }
    if (globalmsg != "Low Card Played") {
      lowTurn = false;
    }
    if (globalmsg != "Refresh Card Played") {
      anyCard = false;
    }
  });
  socket.on("playFaceDownCard", (data: any) => {
    let oldgmsg = globalmsg;
    globalmsg = "";
    const result = playFaceDownCard(data);
    if (result.hasOwnProperty("Error")) {
      socket.emit("message", { msg: generateMessage("Illegal Move") });
      globalmsg = oldgmsg;
    } else {
      (result as any).id = data.id;
      let player = playerToUpdate(data.id);
      io.emit("updateFaceDown", result);
      io.emit("message", {
        msg: generateMessage(
          `${cardPlayMsg(result.card)} played by ${usernameList[data.id - 1]}`
        ),
      });
      io.emit("updatePile", { cardpile: cardPile });
      if (player?.faceDownCards.length == 0) {
        io.emit("GameOver", { winner: `${usernameList[calcTurn() - 1]}` });
        io.emit("message", {
          msg: `${usernameList[calcTurn() - 1]} has won the game!`,
        });
        gameStarted = false;
        clientIdList = new Array();
        socketIdList = new Array();
        sockets = new Array();
        usernameList = new Array();
        counter = 1;
        turn = -1;
        lowTurn = false;
        anyCard = false;
        globalmsg = "";
        cardPile = [];
      } else {
        turn += 1;
        if (globalmsg != "") {
          io.emit("message", { msg: generateMessage(globalmsg) });
        }
        const turnMessage = `${usernameList[calcTurn() - 1]}'s Turn`;
        io.emit("message", { msg: generateMessage(turnMessage) });
        io.emit("changeTurn", {
          turn: calcTurn(),
          decklength: deck.getLength(),
        });
      }
    }
    if (globalmsg != "Low Card Played") {
      lowTurn = false;
    }
    if (globalmsg != "Refresh Card Played") {
      anyCard = false;
    }
  });
});
