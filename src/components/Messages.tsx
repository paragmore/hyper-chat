import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageI } from "./ChatBox";
import { MessageBubble } from "./MessageBubble";

export const Messages: React.FC<{
  messages: MessageI[];
  name: string;
}> = (props) => {
  const { messages, name } = props;
  return (
    <ScrollToBottom style={{ overflow: "auto", flex: "auto" }}>
      {messages.map((message, i) => (
        <div key={i}>
          {" "}
          <MessageBubble message={message} name={name} />{" "}
        </div>
      ))}
    </ScrollToBottom>
  );
};
