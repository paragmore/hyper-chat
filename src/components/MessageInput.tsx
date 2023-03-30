import React from "react";
import { MessageInputStylesProvider } from "./MessageInput.styles";

export const MessageInput = (props) => {
  const { message, setMessage, sendMessage } = props;
  return (
    <MessageInputStylesProvider>
      <form className="form">
        <input
          className="input"
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        />
        <button className="sendButton" onClick={(e) => sendMessage(e)}>
          Send
        </button>
      </form>
    </MessageInputStylesProvider>
  );
};
