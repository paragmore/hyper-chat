import React, { useEffect, useState } from "react";
import { ChatBoxContainer, ChatBoxOuterContainer } from "./ChatBox.styles";
import { MessageInput } from "./MessageInput";
import { Messages } from "./Messages";
const { ipcRenderer } = window?.require("electron");

export interface MessageI {
  user: string;
  text: string;
  sentTo?: string;
}

export const ChatBox: React.FC<{ currentConnection }> = (props) => {
  const { currentConnection } = props;
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageI[]>([
    { user: "", text: "" },
  ]);
  const [sendMessageStatus, setSendMessageStatus] = useState("");

  useEffect(() => {
    ipcRenderer.on("SEND_MESSAGE_STATUS", (event, arg) => {
      setSendMessageStatus(arg);
    });
    ipcRenderer.on("RECIEVED_MESSAGE", (event, arg) => {
      console.log(arg);
      setMessages([...messages, arg as MessageI]);
    });
  }, []);

  const sendMessage = (e) => {
    console.log("enter pressed");
    e.preventDefault();
    console.log(message);
    if (message) {
      //   socket.emit("userMessage", message, () => {
      //     setMessage("");
      //   });
      ipcRenderer.send("SEND_MESSAGE", { currentConnection, message });
      if (sendMessageStatus === "SENT") {
        setMessages([
          ...messages,
          { user: "", text: message, sentTo: currentConnection },
        ]);
      }
    }
    setSendMessageStatus("");
  };

  console.log(messages, message);

  return (
    <ChatBoxOuterContainer>
      <ChatBoxContainer>
        <Messages
          messages={messages.filter(
            (message) =>
              message.user === currentConnection ||
              message.sentTo === currentConnection
          )}
          name={""}
        />
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </ChatBoxContainer>
    </ChatBoxOuterContainer>
  );
};
