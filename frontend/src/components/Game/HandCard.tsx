import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface MyHCardsProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  rank: String;
  suit: String;
  playable: Boolean;
  id: String;
  tableCard: Boolean;
}
function HandCard({
  rank,
  suit,
  playable,
  id,
  socket,
  tableCard,
}: MyHCardsProps) {
  const handleClick = () => {
    if (playable && !tableCard) {
      socket.emit("playCard", { id, card: `${rank} ${suit}` });
    } else if (playable && tableCard) {
      socket.emit("playFaceUpCard", { id, card: `${rank} ${suit}` });
    }
  };

  return (
    <li>
      <a className={"card rank-" + rank + " " + suit} onClick={handleClick}>
        <span className="rank">{rank}</span>
        <span className="suit"></span>
      </a>
    </li>
  );
}
export default HandCard;
