import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React, { KeyboardEvent, MouseEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { saveMessage } from "../app/reducers/messagesSlice";
import { selectLoggedInUser } from "../app/reducers/usersSlice";
import {
  addMessage,
  selectCurrentConversation,
} from "./../app/reducers/conversationsSlice";

import "../css/NewMessage.css";

interface NewMessageProps {}

export default function NewMessage(props: NewMessageProps) {
  const [message, setMessage] = useState("");
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const currentConversation = useAppSelector(selectCurrentConversation);
  const dispatch = useAppDispatch();

  const onSendMessageClicked = (event: MouseEvent) => {
    sendMessage();
  };

  const onKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  };

  const sendMessage = () => {
    if (message) {
      const temporaryUniqueID = Date.now().toString();

      const newMessage = {
        description: message,
        _id: temporaryUniqueID.toString(),
        sender: loggedInUser.mobile,
        time: new Date().getTime(),
        deletedBy: [],
        starredBy: [],
        conversationID: currentConversation?._id,
      };

      dispatch(saveMessage(newMessage));
      dispatch(addMessage(temporaryUniqueID));
      setMessage("");
    }
  };

  return (
    <div className="new-message">
      <div
        style={{
          width: "96%",
          backgroundColor: "#f6f6f6",
          borderRadius: "20px",
          textAlign: "center",
          padding: "8px",
        }}
      >
        <TextField
          style={{ width: "100%" }}
          placeholder="הקלד/י הודעה"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onSendMessageClicked} disabled={!message}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={onInputChange}
          value={message}
          onKeyPress={onKeyPressed}
          type="text"
        />
      </div>
    </div>
  );
}
