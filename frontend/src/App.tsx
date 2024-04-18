import logo from "./logo.svg";
import HomePage from "./components/Home/Home";
import Loading from "./components/Loading/Loading";
import TeenPatti from "./components/Game/TeenPatti";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", { transports: ["websocket"] });
socket.connect();

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/loading" element={<Loading socket={socket} />} />
          <Route path="/teenpatti" element={<TeenPatti socket={socket} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
