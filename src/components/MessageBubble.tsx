import React from "react";
import ReactEmoji from "react-emoji";
import { MessageBubbleStylesProvider } from "./MessageBubble.styles";

export const MessageBubble = (props) => {
  const {
    message: { user, text },
    name,
  } = props;
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  if (!text) {
    return <></>;
  }

  return (
    <MessageBubbleStylesProvider>
      {isSentByCurrentUser ? (
        <div className="messageContainer justifyEnd">
          {/* <p className="sentText pr-10">{trimmedName}</p> */}
          <div className="messageBox backgroundBlue">
            <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
      ) : (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          </div>
          {/* <p className="sentText pl-10">{user}</p> */}
        </div>
      )}
    </MessageBubbleStylesProvider>
  );
};
