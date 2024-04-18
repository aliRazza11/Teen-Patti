import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useSelector, useDispatch } from "react-redux";
import {
  UpdateTurn,
  UpdatemyCardsInHand,
  UpdateDeckLength,
} from "../../slices/gameStateSlice";
import { useNavigate } from "react-router-dom";
import HandCard from "./HandCard";
import { useEffect, useRef } from "react";
import "./teenpatti.css";
import "./playing-cards.css";
import PlayableFaceDownCard from "./PlayableFaceDownCard";
interface MyCardsProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

function MyCardsContainer({ socket }: MyCardsProps) {
  const cardsInHand = useSelector((state: any) => state.game.myCardsInHand);

  const faceupCards = useSelector((state: any) => state.game.myFaceUpCards);

  const facedownlen = useSelector((state: any) => state.game.facedownlength);

  const turn = useSelector((state: any) => state.game.turn);

  const clientId = useSelector((state: any) => state.user.clientid);

  const decklength = useSelector((state: any) => state.game.decklength);

  let canPlay = useRef(false);

  let canPlayTableCards = useRef(false);

  let faceDownPlayable = useRef(false);

  turn === clientId ? (canPlay.current = true) : (canPlay.current = false);

  cardsInHand.length === 0 && decklength === 0 && canPlay.current
    ? (canPlayTableCards.current = true)
    : (canPlayTableCards.current = false);

  faceupCards.length === 0 && canPlay.current
    ? (faceDownPlayable.current = true)
    : (faceDownPlayable.current = false);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleCardsInHand = (data: any) => {
      dispatch(UpdatemyCardsInHand(data.inhand));
    };

    const handleTurn = (data: any) => {
      dispatch(UpdateTurn(data.turn));
      dispatch(UpdateDeckLength(data.decklength));
    };

    const handleGameOver = () => {
      canPlay.current = false;
      console.log("In game over, canPlay: ", canPlay.current);
    };

    socket.on("updateHand", handleCardsInHand);

    socket.on("changeTurn", handleTurn);

    socket.on("GameOver", handleGameOver);

    return () => {
      socket.off("updateHand", handleCardsInHand);
      socket.off("changeTurn", handleTurn);
      socket.off("GameOver", handleGameOver);
    };
  }, []);

  const handleClick = () => {
    console.log("In handle Click: canPlay:", canPlay.current);
    if (canPlay.current) {
      socket.emit("pickPile", { id: clientId });
    }
  };

  return (
    <div className="right-side-container my-cards-container">
      <div className="custom2">
        <button onClick={handleClick}>Pick Pile</button>
      </div>
      <h1 className="titlecustom2">My Cards</h1>
      <div className="my-cards-inner-container">
        <ul className="hand remove-margin">
          {cardsInHand.map((item: any) => {
            const rank = item.split(" ")[0];
            const suit = item.split(" ")[1];
            return (
              <HandCard
                rank={rank}
                suit={suit}
                playable={canPlay.current}
                id={clientId}
                socket={socket}
                tableCard={false}
              />
            );
          })}
        </ul>
      </div>
      <div className="my-fixed-cards-container">
        <ul className="hand remove-margin">
          {Array(facedownlen)
            .fill(0)
            .map((_, i) => (
              <PlayableFaceDownCard
                key={i}
                index={i}
                socket={socket}
                playable={faceDownPlayable.current}
                id={clientId}
              />
            ))}
          {faceupCards.map((item: any) => {
            const rank = item.split(" ")[0];
            const suit = item.split(" ")[1];
            return (
              <HandCard
                rank={rank}
                suit={suit}
                playable={canPlayTableCards.current}
                id={clientId}
                socket={socket}
                tableCard={true}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default MyCardsContainer;
