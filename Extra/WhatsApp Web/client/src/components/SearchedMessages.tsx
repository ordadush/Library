import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import { useAppSelector } from "../app/hooks";
import {
  filterMessages,
  selectFilteredMessages,
  selectSearchCriteria,
} from "../app/reducers/messagesSlice";
import { selectLoggedInUser } from "../app/reducers/usersSlice";
import Search from "./Search";
import { selectCurrentConversation } from "../app/reducers/conversationsSlice";

import "../css/SearchedMessages.css";

interface SearchedMessagesProps {
  onClose: () => void;
}

export default function SearchedMessages(props: SearchedMessagesProps) {
  const filteredMessages = useAppSelector(selectFilteredMessages);
  const selectedConversaion = useAppSelector(selectCurrentConversation);
  const loggedInUser = useAppSelector(selectLoggedInUser);

  return (
    <>
      <div className="message-search-header">
        <IconButton key="conversationSearch" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
        <div className="message-search-title">חפש הודעות</div>
      </div>
      <Search
        filterAction={filterMessages}
        placeHolder="חפש/י הודעה"
        autoFocus={true}
        selectSearchCriteria={selectSearchCriteria}
      />
      <List className="filtered-messages">
        {filteredMessages
          .filter(
            (msg) =>
              !msg.deletedBy.includes(loggedInUser.mobile) &&
              msg._id &&
              selectedConversaion?.messages.includes(msg._id)
          )
          .map((msg) => (
            <>
              <ListItem>
                <ListItemText
                  primary={msg.description}
                  secondary={moment(new Date(msg.time)).format("HH:mm")}
                />
              </ListItem>
              <Divider />
            </>
          ))}
      </List>
    </>
  );
}
