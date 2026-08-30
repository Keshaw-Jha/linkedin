import classes from "./Conversation.module.scss";
import type { IConversation } from "../Conversations/Conversations";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../../authentication/contexts/AuthenticationContextProvider";
import { useWebSocket } from "../../../ws/WsContext";

interface ConversationItemProps {
  conversation: IConversation;
}

export default function Conversation(props: ConversationItemProps) {
  const [conversation, setConversation] = useState<IConversation>(
    props.conversation,
  );
  const { user } = useAuthentication();
  const { id } = useParams();
  const navigate = useNavigate();
  const conversationUserToDisplay =
    conversation.recipient.id === user?.id
      ? conversation.author
      : conversation.recipient;
  const unreadMessageCount = conversation.messages.filter(
    (message) => message.receiver.id === user.id && !message.isRead,
  ).length;
  const ws = useWebSocket();

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/conversations/${conversation?.id}/messages`,
      (data) => {
        const message = JSON.parse(data.body);
        setConversation((prevConversation) => {
          const index = prevConversation.messages.findIndex(
            (m) => m.id === message.id,
          );
          if (index == -1) {
            return {
              ...prevConversation,
              messages: [...prevConversation.messages, message],
            };
          }
          return {
            ...prevConversation,
            messages: prevConversation.messages.map((m) =>
              m.id === message.id ? message : m,
            ),
          };
        });
      },
    );
    return () => subscription?.unsubscribe();
  }, [conversation?.id, ws]);

  return (
    <button
      className={`${classes.root} ${id && Number(id) === conversation.id ? classes.selected : ""}`}
      onClick={() => navigate(`/messaging/conversations/${conversation.id}`)}>
      <img
        className={classes.avatar}
        src={conversationUserToDisplay.profilePicture}
        alt=""
      />
      {unreadMessageCount > 0 && (
        <div className={classes.unread}>{unreadMessageCount}</div>
      )}
      <div>
        <div className={classes.name}>
          {conversationUserToDisplay.firstName}{" "}
          {conversationUserToDisplay.lastName}
        </div>
        <div className={classes.content}>
          {conversation.messages[conversation.messages.length - 1]?.content}
        </div>
      </div>
    </button>
  );
}
