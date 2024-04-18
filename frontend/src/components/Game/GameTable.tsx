import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useSelector, useDispatch } from "react-redux/es/exports";
import Card from "./TableCard";
import { useEffect } from "react";
import {
  UpdateCardPile,
  UpdateFaceDownLen,
  UpdateP2FaceDownLen,
  UpdateP3FaceDownLen,
  UpdateP4FaceDownLen,
  UpdatemyFaceUpCards,
  Updatep2FaceUpCards,
  Updatep3FaceUpCards,
  Updatep4FaceUpCards,
} from "../../slices/gameStateSlice";
import "./teenpatti.css";
import "./playing-cards.css";
import FaceDownCard from "./FaceDownCard";

interface GameTableProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

function GameTable({ socket }: GameTableProps) {
  const username = useSelector((state: any) => state.user.username);

  const clientId = useSelector((state: any) => state.user.clientid);

  const faceupCards = useSelector((state: any) => state.game.myFaceUpCards);

  const facedownlen = useSelector((state: any) => state.game.facedownlength);

  const p2faceupCards = useSelector((state: any) => state.game.p2FaceUpCards);

  const p2facedownlen = useSelector(
    (state: any) => state.game.p2facedownlength
  );

  const p2id = useSelector((state: any) => state.game.p2id);

  const p3id = useSelector((state: any) => state.game.p3id);

  const p4id = useSelector((state: any) => state.game.p4id);

  const p3faceupCards = useSelector((state: any) => state.game.p3FaceUpCards);

  const p3facedownlen = useSelector(
    (state: any) => state.game.p3facedownlength
  );

  const p4faceupCards = useSelector((state: any) => state.game.p4FaceUpCards);

  const p4facedownlen = useSelector(
    (state: any) => state.game.p4facedownlength
  );

  const cardPile = useSelector((state: any) => state.game.cardPile);

  const usernames = useSelector((state: any) => state.game.playerNames);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleCardPile = (data: any) => {
      dispatch(UpdateCardPile(data.cardpile));
    };

    const handleFaceUp = (data: any) => {
      if (data.id === clientId) {
        dispatch(UpdatemyFaceUpCards(data.faceup));
      } else if (data.id === p2id) {
        dispatch(Updatep2FaceUpCards(data.faceup));
      } else if (data.id === p3id) {
        dispatch(Updatep3FaceUpCards(data.faceup));
      } else if (data.id === p4id) {
        dispatch(Updatep4FaceUpCards(data.faceup));
      }
    };

    const handleFaceDown = (data: any) => {
      if (data.id === clientId) {
        dispatch(UpdateFaceDownLen(data.facedown));
      } else if (data.id === p2id) {
        dispatch(UpdateP2FaceDownLen(data.facedown));
      } else if (data.id === p3id) {
        dispatch(UpdateP3FaceDownLen(data.facedown));
      } else if (data.id === p4id) {
        dispatch(UpdateP4FaceDownLen(data.facedown));
      }
    };

    socket.on("updatePile", handleCardPile);
    socket.on("updateFaceUp", handleFaceUp);
    socket.on("updateFaceDown", handleFaceDown);

    return () => {
      socket.off("updatePile", handleCardPile);
      socket.off("updateFaceUp", handleFaceUp);
      socket.off("updateFaceDown", handleFaceDown);
    };
  }, []);

  return (
    <div className="game-table-container">
      <div className="game-table">
        <div className="card-area">
          <div className="custom1">
            <ul className="hand remove-margin">
              {cardPile.map((item: any) => {
                const rank = item.split(" ")[0];
                const suit = item.split(" ")[1];
                return <Card rank={rank} suit={suit} />;
              })}
            </ul>
          </div>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-one">{username}</div>
          <ul className="hand remove-margin player-one-cards">
            {Array(facedownlen)
              .fill(0)
              .map((_, i) => (
                <FaceDownCard key={i} />
              ))}
            {faceupCards.map((item: any) => {
              const rank = item.split(" ")[0];
              const suit = item.split(" ")[1];
              return <Card rank={rank} suit={suit} />;
            })}
          </ul>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-two">{usernames[0]}</div>
          <ul className="hand remove-margin player-two-cards">
            {Array(p2facedownlen)
              .fill(0)
              .map((_, i) => (
                <FaceDownCard key={i} />
              ))}
            {p2faceupCards.map((item: any) => {
              const rank = item.split(" ")[0];
              const suit = item.split(" ")[1];
              return <Card rank={rank} suit={suit} />;
            })}
          </ul>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-three">{usernames[1]}</div>
          <ul className="hand remove-margin player-three-cards">
            {Array(p3facedownlen)
              .fill(0)
              .map((_, i) => (
                <FaceDownCard key={i} />
              ))}
            {p3faceupCards.map((item: any) => {
              const rank = item.split(" ")[0];
              const suit = item.split(" ")[1];
              return <Card rank={rank} suit={suit} />;
            })}
          </ul>
        </div>
        <div className="game-players-container">
          <div className="player-tag player-four">{usernames[2]}</div>
          <ul className="hand remove-margin player-four-cards">
            {Array(p4facedownlen)
              .fill(0)
              .map((_, i) => (
                <FaceDownCard key={i} />
              ))}
            {p4faceupCards.map((item: any) => {
              const rank = item.split(" ")[0];
              const suit = item.split(" ")[1];
              return <Card rank={rank} suit={suit} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default GameTable;
