import { useAppSelector } from "../app/hooks";
import Message from "./Message";
import { selectCurrentConversation } from "../app/reducers/conversationsSlice";
import { selectMessages } from "./../app/reducers/messagesSlice";
import { selectLoggedInUser } from "./../app/reducers/usersSlice";

import "../css/ConversationHistory.css";

interface ConversationHistoryProps {}

export default function ConversationHistory(props: ConversationHistoryProps) {
  const conversation = useAppSelector(selectCurrentConversation);
  const messages = useAppSelector(selectMessages);
  const loggedInUser = useAppSelector(selectLoggedInUser);

  const sortedMessages = messages.filter(
    (msg) =>
      msg._id &&
      conversation?.messages.includes(msg._id) &&
      msg.deletedBy.every((userID) => userID !== loggedInUser.mobile)
  );
  sortedMessages.sort((msg) => msg.time);

  return (
    <div className="messages">
      {sortedMessages.map(
        (msg) => msg._id && <Message key={msg._id} messageId={msg._id} />
      )}
    </div>
  );
}
