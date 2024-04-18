import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useSelector, useDispatch } from "react-redux";
import { UpdateReceived } from "../../slices/messageSlice";
import Message from "./Message";
import { useEffect, useRef } from "react";
import "./teenpatti.css";
import "./playing-cards.css";
interface MessagesProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

function MessagesContainer({ socket }: MessagesProps) {
  const messagesReceived = useSelector((state: any) => state.message.received);
  const dispatch = useDispatch();
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleReceivedMessage = (data: any) => {
      dispatch(UpdateReceived(data.msg));
    };

    socket.on("message", handleReceivedMessage);

    return () => {
      socket.off("message", handleReceivedMessage);
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  return (
    <div className="right-side-container messages-container">
      <h1 className="titlecustom">Messages</h1>
      <div className="message-box">
        {[...messagesReceived].reverse().map((item: any) => {
          return (
            <Message
              key={messagesReceived.indexOf(item)}
              message={item}
              className="slide-in"
            />
          );
        })}
      </div>
    </div>
  );
}
export default MessagesContainer;
