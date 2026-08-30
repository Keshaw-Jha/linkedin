import classes from "./Messages.module.scss";
import type { IUser } from "../../../authentication/contexts/AuthenticationContextProvider";
import Message from "./components/Message";

export interface IMessage {
  id: number;
  sender: IUser;
  receiver: IUser;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface IMessagesProps {
  messages: IMessage[];
  user: IUser | null;
  conversationId: number;
}

export default function Messages({ messages, user }: IMessagesProps) {
  return (
    <div className={classes.root}>
      {messages.map((message) => (
        <Message key={message.id} message={message} user={user} />
      ))}
    </div>
  );
}
