import ConversationsSidebar from "./ConversationsSidebar";
import Header from "./Header";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ConversationHistory from "./ConversationHistory";
import NewMessage from "./NewMessage";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectLoggedInUser, selectUsers } from "../app/reducers/usersSlice";
import {
  cleanMessages,
  deleteConversation,
  selectCurrentConversation,
} from "./../app/reducers/conversationsSlice";
import SearchedMessages from "./SearchedMessages";
import { MouseEvent, useRef, useState } from "react";
import { filterMessages } from "../app/reducers/messagesSlice";
import AddParticipants from "./AddParticipants";
import GroupDetails from "./GroupDetails";

import "../css/Main.css";

interface MainProps {}

export default function Main(props: MainProps) {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const selectedConversation = useAppSelector(selectCurrentConversation);
  const users = useAppSelector(selectUsers);
  const [openSearchMessages, setOpenSearchMessages] = useState(false);
  const [groupCreationStage, setGroupCreationStage] = useState("closed");
  const [openConversationMenu, setOpenConversationMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const conversationMenuIconReference = useRef(null);
  const dispatch = useAppDispatch();

  const actions: any = {
    cleanMessages: () => {
      if (selectedConversation) {
        dispatch(cleanMessages(selectedConversation._id));
      }
    },
    deleteConversation: () => {
      if (selectedConversation) {
        dispatch(deleteConversation(selectedConversation._id));
      }
    },
  };

  const onSearchMessagesClicked = () => {
    setOpenSearchMessages(!openSearchMessages);
    dispatch(filterMessages(""));
  };

  const handleGroupCreationStage = (stage: string) => {
    setGroupCreationStage(stage);
  };

  const onConversationMenuClicked = () => {
    setOpenConversationMenu(true);
    setAnchorEl(conversationMenuIconReference.current);
  };

  const handleMenuClose = (action: string) => (event: MouseEvent) => {
    setOpenConversationMenu(false);

    if (action !== "close") {
      actions[action]();
    }
  };

  const conversationButtons: JSX.Element[] = [
    <IconButton key="conversationSearch" onClick={onSearchMessagesClicked}>
      <SearchIcon />
    </IconButton>,
    <IconButton
      key="conversationMenu"
      onClick={onConversationMenuClicked}
      ref={conversationMenuIconReference}
    >
      <MoreVertIcon />
    </IconButton>,
  ];

  let selectedConversationUser;
  if (selectedConversation) {
    selectedConversationUser = users.find(
      (user) =>
        user.mobile ===
        selectedConversation.users.find(
          (mobile) => mobile !== loggedInUser.mobile
        )
    );
  }

  return (
    <>
      <div className="sidebar">
        {groupCreationStage === "closed" ? (
          <ConversationsSidebar
            handleGroupCreationStage={handleGroupCreationStage}
          />
        ) : groupCreationStage === "addParticipants" ? (
          <AddParticipants
            handleGroupCreationStage={handleGroupCreationStage}
          />
        ) : (
          <GroupDetails handleGroupCreationStage={handleGroupCreationStage} />
        )}
      </div>

      {selectedConversation ? (
        <div
          className="conversation-history"
          style={{ width: openSearchMessages ? "40%" : "70%" }}
        >
          {selectedConversation.users.length > 2 ? (
            <Header
              title={selectedConversation.name}
              imageUrl={"10"}
              buttons={conversationButtons}
              subtitle={
                selectedConversation.users.length === 2
                  ? ""
                  : users
                      .filter((usr) =>
                        selectedConversation.users.includes(usr.mobile)
                      )
                      .map((usr) => usr.firstName)
                      .join(", ")
              }
            />
          ) : (
            <Header
              title={
                selectedConversationUser?.firstName +
                " " +
                selectedConversationUser?.lastName
              }
              imageUrl={selectedConversationUser?.imageUrl.toString()}
              buttons={conversationButtons}
            />
          )}
          <Menu
            id="conversation-options-menu"
            keepMounted
            anchorEl={anchorEl}
            open={openConversationMenu}
            onClose={handleMenuClose("close")}
          >
            <MenuItem onClick={handleMenuClose("cleanMessages")}>
              נקה הודעות
            </MenuItem>
            <MenuItem onClick={handleMenuClose("deleteConversation")}>
              מחק/י צ'אט
            </MenuItem>
          </Menu>
          <ConversationHistory />
          <NewMessage />
        </div>
      ) : (
        <div
          className="no-conversation"
          style={{ width: openSearchMessages ? "40%" : "70%" }}
        ></div>
      )}

      {openSearchMessages && (
        <div className="searched-messages">
          <SearchedMessages onClose={onSearchMessagesClicked} />
        </div>
      )}
    </>
  );
}
