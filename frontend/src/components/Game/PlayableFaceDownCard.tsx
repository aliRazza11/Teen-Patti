import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
interface FaceDownCardProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  index: Number;
  playable: Boolean;
  id: String;
}
function PlayableFaceDownCard({
  socket,
  index,
  playable,
  id,
}: FaceDownCardProps) {
  const handleClick = () => {
    if (playable) {
      socket.emit("playFaceDownCard", { index: index, id: id });
    }
  };

  return (
    <li>
      <div className="card back" onClick={handleClick}>
        *
      </div>
    </li>
  );
}
export default PlayableFaceDownCard;
