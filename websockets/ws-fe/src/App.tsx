import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      console.log("Received message:", message.data);
      setMessage((prevMessages) => [...prevMessages, message.data]);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <>
      <h1>WebSocket Messages</h1>
      <ul className="list-none">
        {message.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button
        onClick={() => {
          socket.send(msg);
        }}
      >
        send
      </button>
    </>
  );
}

export default App;
