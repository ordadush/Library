import moment from "moment";
import { DoneAll } from "@material-ui/icons";
import { selectLoggedInUser } from "../app/reducers/usersSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteMessage,
  selectMessageById,
  updateMessage,
} from "../app/reducers/messagesSlice";
import { MouseEvent, useRef, useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import StarIcon from "@material-ui/icons/Star";
import { IconButton, Menu, MenuItem } from "@material-ui/core";

import "../css/Message.css";

interface MessageProps {
  messageId: string;
}

export default function Message(props: MessageProps) {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const message = useAppSelector(selectMessageById(props.messageId));
  const [hoveredMessage, setHoveredMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const messageReference = useRef(null);
  const dispatch = useAppDispatch();

  const dispatchByAction: any = {
    delete: (messageID: string, userMobile: string) =>
      dispatch(
        deleteMessage({
          messageID: messageID,
          userMobile: userMobile,
        })
      ),
    toggleStar: (messageID: string, userMobile: string) => {
      let updatedMessage = Object.assign({}, message);
      if (updatedMessage.starredBy.includes(userMobile)) {
        updatedMessage.starredBy = updatedMessage.starredBy.filter(
          (userID) => userID !== userMobile
        );
      } else {
        updatedMessage.starredBy = [...updatedMessage.starredBy, userMobile];
      }

      dispatch(updateMessage(updatedMessage));
    },
  };

  const onMouseHovered =
    (messageID: string | undefined) => (event: MouseEvent) => {
      if (messageID) {
        setHoveredMessage(messageID);
      }
    };

  const onMouseLeft = (event: MouseEvent) => {
    !openMenu && setHoveredMessage("");
  };

  const handleMenuOpen = (event: MouseEvent) => {
    setOpenMenu(true);
    setAnchorEl(messageReference.current);
  };

  const handleMenuClose =
    (action: string, messageID: string | undefined) => (event: MouseEvent) => {
      setOpenMenu(false);
      setHoveredMessage("");

      dispatchByAction[action] &&
        dispatchByAction[action](messageID, loggedInUser.mobile);
    };

  return (
    <>
      <div
        ref={messageReference}
        className={
          message?.sender === loggedInUser.mobile
            ? "message sent"
            : "message received"
        }
        onMouseOver={onMouseHovered(message?._id)}
        onMouseLeave={onMouseLeft}
      >
        {message?._id === hoveredMessage && (
          <IconButton size="small" onClick={handleMenuOpen}>
            <ArrowDropDownIcon />
          </IconButton>
        )}
        <span className="metadata">
          {message?.starredBy.includes(loggedInUser.mobile) && (
            <span className="star">
              <StarIcon fontSize="inherit" />
            </span>
          )}
          <span className="time">
            {message && moment(new Date(message.time)).format("HH:mm")}
          </span>
          {message?.sender === loggedInUser.mobile && (
            <span className="tick">
              <DoneAll fontSize="inherit" />
            </span>
          )}
        </span>
        {message?.description}
      </div>
      <Menu
        id="message-options-menu"
        keepMounted
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose("close", message?._id)}
      >
        <MenuItem onClick={handleMenuClose("toggleStar", message?._id)}>
          {message?.starredBy.includes(loggedInUser.mobile)
            ? "הסר/י כוכב מההודעה"
            : "סמן/י הודעה בכוכב"}
        </MenuItem>
        <MenuItem onClick={handleMenuClose("delete", message?._id)}>
          מחיקת הודעה
        </MenuItem>
      </Menu>
    </>
  );
}
