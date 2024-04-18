import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import GameTable from "./GameTable";
import MessagesContainer from "./MessagesContainer";
import "./teenpatti.css";
import "./playing-cards.css";
import MyCardsContainer from "./MyCardsContainer";

interface TeenPattiProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
}

function TeenPatti({ socket }: TeenPattiProps) {
  return (
    <div className="div">
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Teen Patti</title>
      <div className="main-container playingCards">
        <div className="game-container">
          <div className="heading-container">
            <h1 className="titlecustom">Teen Patti</h1>
          </div>
          <GameTable socket={socket} />
        </div>
        <div className="messages-and-cards-container">
          <MessagesContainer socket={socket} />
          <MyCardsContainer socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default TeenPatti;
