import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  UpdateUsername,
  Updateclientid,
  ResetUserState,
} from "../../slices/userSlice";
import { DeleteReceived, ResetMsgState } from "../../slices/messageSlice";
import { ResetGameState } from "../../slices/gameStateSlice";
import "./Home.css";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const clientId = useSelector((state: any) => state.user.clientid);

  const [username, setUsername] = useState("");

  dispatch(ResetUserState());
  dispatch(ResetGameState());
  dispatch(ResetMsgState());

  //click handler
  const handleClick = (socket: Socket) => {
    dispatch(UpdateUsername(username));
    // Do something with the socket object, such as emit an event
    socket.emit("startGame", {
      socketid: socket.id,
      clientid: clientId,
      username,
    });
    navigate("/loading");
  };
  return (
    <>
      <div className="sampleHomePage">
        <h1 className="sampleTitle">Teen Patti</h1>
        <div className="sampleMessage">
          <input
            placeholder="Enter username"
            className="sampleInput"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <div>
            <button
              className="sampleButton"
              onClick={() => handleClick(socket)}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
