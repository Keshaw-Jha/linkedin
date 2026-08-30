import { useEffect, useState, type CSSProperties } from "react";
import classes from "./Conversations.module.scss";
import type { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import type { Message } from "@stomp/stompjs";
import Conversation from "../Conversation/Conversation";
import { request } from "../../../../utils/api";
import type { IMessage } from "../Messages/Messages";

interface IConversationsProps {
  style?: CSSProperties;
}
// interface IConversationsProps extends HTMLAttributes<HTMLDivElement> {};

export interface IConversation {
  id: number;
  author: IUser;
  recipient: IUser;
  messages: IMessage[];
}

export default function Conversations(props: IConversationsProps) {
  const [conversations, setConversations] = useState<IConversation[]>([]);

  useEffect(() => {
    request<IConversation[]>({
      endpoint: "/api/v1/messaging/conversations",
      onSuccess: (data) => setConversations(data),
      onFailure: (error) => console.error(error),
    });
  }, []);

  return (
    <div className={classes.root} {...props}>
      {conversations.map((conversation) => {
        return (
          <Conversation key={conversation.id} conversation={conversation} />
        );
      })}
      {conversations.length === 0 && (
        <div className={classes.empty} style={{ padding: "1rem" }}>
          <h2>No Conversations</h2>
          <p>Start a new conversation by clicking the button above</p>
        </div>
      )}
    </div>
  );
}
