import { List } from "@material-ui/core";
import Conversation from "./Conversation";
import { useAppSelector } from "../app/hooks";
import {
  selectFilteredUsers,
  selectLoggedInUser,
  selectSearchCriteria,
  selectUsers,
} from "./../app/reducers/usersSlice";
import { selectConversations } from "../app/reducers/conversationsSlice";
import { selectMessages } from "./../app/reducers/messagesSlice";
import moment from "moment";
import User from "../types/User";

import "../css/Conversations.css";

interface ConversationsProps {}

export default function Conversations(props: ConversationsProps) {
  const filteredUsers = useAppSelector(selectFilteredUsers);
  const users = useAppSelector(selectUsers);
  const conversations = useAppSelector(selectConversations);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const messages = useAppSelector(selectMessages);
  const searchCriteria = useAppSelector(selectSearchCriteria);

  return (
    <List className="conversations">
      {conversations
        .filter((conversation) => {
          if (conversation.users.length === 2) {
            let user = conversation.users.find(
              (userMobile) => userMobile !== loggedInUser.mobile
            );
            return user && filteredUsers.find((usr) => usr.mobile === user);
          }

          return conversation.name?.includes(searchCriteria);
        })
        .map((conversation) => {
          let user: User | undefined;

          if (conversation.users.length === 2) {
            let userMobile = conversation.users.find(
              (mobile) => mobile !== loggedInUser.mobile
            );

            if (userMobile) {
              user = users.find((user) => user.mobile === userMobile);
            }
          }

          // Filter only messages who have not been deleted by the user
          const filteredSortedMessages = messages.filter(
            (msg) =>
              msg._id &&
              conversation?.messages.includes(msg._id) &&
              msg.deletedBy.every((userID) => userID !== loggedInUser.mobile)
          );
          filteredSortedMessages.sort((msg) => msg.time);

          // Gets the current conversation latest message
          let message;
          if (filteredSortedMessages.length > 0) {
            message = filteredSortedMessages[filteredSortedMessages.length - 1];
          }

          return (
            <Conversation
              conversationId={conversation ? conversation._id : ""}
              key={user ? user.mobile : conversation.name}
              imageUrl={user ? user.imageUrl : 10}
              lastMessage={message ? message.description : ""}
              userName={
                user
                  ? user.firstName + " " + user.lastName
                  : conversation.name
                  ? conversation.name
                  : ""
              }
              lastMessageTime={
                message ? moment(new Date(message.time)).format("HH:mm") : ""
              }
            />
          );
        })}
    </List>
  );
}
