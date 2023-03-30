import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { CHANNELS } from "./constants";
import { ChatBox } from "./components/ChatBox";

const { ipcRenderer } = window?.require("electron");

function App() {
  const [message, setMessage] = useState("");
  const [connections, setConnections] = useState([]);
  const [currentConnection, setCurrentConnection] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [sendMessageStatus, setSendMessageStatus] = useState("");
  const sendMessage = () => {
    ipcRenderer.send("SEND_MESSAGE", { currentConnection, message });
  };
  // const sendCurrentConnection = () => {
  //   ipcRenderer.send("CURRENT_CONNECTION", message);
  // };

  // const getData = () => {
  //   // Send the event to get the data
  //   ipcRenderer.send(CHANNELS.CONNECTIONS, { connections: [] });
  // };
  useEffect(() => {
    // getData();
    // Listen for the event
    ipcRenderer.on(CHANNELS.CONNECTIONS, (event, arg) => {
      console.log(arg);
      setConnections(arg);
      setCurrentConnection(arg[0]);
    });

    ipcRenderer.on("CONNECTION_STATUS", (event, arg) => {
      setConnectionStatus(arg);
    });

    ipcRenderer.on("SEND_MESSAGE_STATUS", (event, arg) => {
      setSendMessageStatus(arg);
    });
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  const selectCurrentConnection = (connection: string) => {
    setCurrentConnection(connection);
  };

  return (
    <div className="App" style={{height: "96.5vh"}}>
      <div>CONNECTION STATUS : {connectionStatus}</div>
      <div style={{ display: "flex", flexDirection: "row", height:"100%" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxWidth: "300px",
          }}
        >
          <div>CONNECTIONS:</div>
          {connections?.map((connection) => (
            <div
              style={
                currentConnection === connection
                  ? {
                      backgroundColor: "green",
                      padding: "10px",
                      marginBottom: "10px",
                      overflowX: "hidden",
                      overflowWrap: "break-word",
                      display: "flex",
                    }
                  : {
                      padding: "10px",
                      marginBottom: "10px",
                      overflowX: "hidden",
                      overflowWrap: "break-word",
                      display: "flex",
                    }
              }
              onClick={() => selectCurrentConnection(connection)}
            >
              {connection}
            </div>
          ))}
        </div>

        <div style={{ flex: 2, height:"100%" }}>
          <ChatBox currentConnection={currentConnection} />
        </div>
      </div>
    </div>
  );
}

export default App;
