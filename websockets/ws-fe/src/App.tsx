import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([""]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  console.log(messages);

  return (
    <>
      <div className="flex flex-col h-[95vh] bg-gray-100">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          <div className="flex">
            <div className=" rounded-lg p-3 max-w-xs flex flex-col items-start gap-2">
              {messages.map((message) => (
                <div className="bg-gray-200 p-2 rounded-md ">{message}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => {
              const message = inputRef.current?.value;
              wsRef.current?.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: message,
                  },
                })
              );
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
