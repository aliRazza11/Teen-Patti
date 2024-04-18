import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useNavigate } from "react-router-dom";
import "./Loading.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux/es/exports";
import { Updateclientid } from "../../slices/userSlice";
import {
  UpdatemyFaceUpCards,
  UpdateFaceDownLen,
  UpdatemyCardsInHand,
  Updatep2FaceUpCards,
  UpdateP2FaceDownLen,
  UpdateP3FaceDownLen,
  UpdateP4FaceDownLen,
  Updatep3FaceUpCards,
  Updatep4FaceUpCards,
  UpdatePlayerNames,
  UpdateCardPile,
  UpdateTurn,
  Updatep2Id,
  Updatep3Id,
  Updatep4Id,
} from "../../slices/gameStateSlice";
import { UpdateReceived } from "../../slices/messageSlice";

interface LoadingProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
}

function Loading({ socket }: LoadingProps) {
  window.history.replaceState({}, " ", "/");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleInitialState = (data: any) => {
      const i = data.you;
      dispatch(UpdatemyFaceUpCards(data.state[i].faceup));
      dispatch(UpdateFaceDownLen(data.state[i].facedown));
      dispatch(UpdatemyCardsInHand(data.state[i].inhand));
      console.log("My state: ", data.state[i].faceup);
      data.state.splice(i, 1);
      let player = 2;
      for (let i = 0; i < 3; i++) {
        if (player === 2) {
          dispatch(Updatep2FaceUpCards(data.state[i].faceup));
          dispatch(UpdateP2FaceDownLen(data.state[i].facedown));
          dispatch(Updatep2Id(data.state[i].id));
        }
        if (player === 3) {
          dispatch(Updatep3FaceUpCards(data.state[i].faceup));
          dispatch(UpdateP3FaceDownLen(data.state[i].facedown));
          dispatch(Updatep3Id(data.state[i].id));
        }
        if (player === 4) {
          dispatch(Updatep4FaceUpCards(data.state[i].faceup));
          dispatch(UpdateP4FaceDownLen(data.state[i].facedown));
          dispatch(Updatep4Id(data.state[i].id));
        }
        console.log("State for", player, " ", data.state[i].faceup);
        player += 1;
      }
      const otherUsernames: String[] = [];
      for (let x = 0; x < 4; x++) {
        if (x !== i) {
          otherUsernames.push(data.usernames[x]);
        }
      }
      console.log("Other usernames", otherUsernames);
      dispatch(UpdatePlayerNames(otherUsernames));
      dispatch(UpdateCardPile(data.cardpile));
      dispatch(UpdateTurn(data.turn));
    };

    const handleRedirect = () => {
      navigate("/teenpatti");
    };

    socket.on("yourid", (data: any) => {
      dispatch(Updateclientid(data.id));
    });

    socket.on("noStartGame", () => {
      alert('A game is already in progress. Please Wait!');
      navigate('/');
    })

    socket.on("yourinitialState", handleInitialState);

    socket.on("redirect", handleRedirect);

    socket.on("message", (data: any) => {
      dispatch(UpdateReceived(data.msg));
    });

    return () => {
      socket.off("yourid");
      socket.off("yourinitialState", handleInitialState);
      socket.off("redirect", handleRedirect);
      socket.off("message");
    };
  }, [dispatch, navigate, socket]);

  return (
    <div className="loadingPage">
      <div className="loadingMsg">Waiting For Other Players</div>
      <span className="loadingDots">⏳</span>
    </div>
  );
}

export default Loading;
