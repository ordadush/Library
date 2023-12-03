import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import Header from "./Header";
import Search from "./Search";
import Conversations from "./Conversations";
import { useAppSelector } from "../app/hooks";
import {
  selectLoggedInUser,
  selectSearchCriteria,
} from "../app/reducers/usersSlice";
import { filterUsers } from "../app/reducers/usersSlice";
import { MouseEvent, useRef, useState } from "react";

import "../css/ConversationsSidebar.css";

interface ConversationSidebarProps {
  handleGroupCreationStage: (stage: string) => void;
}

export default function ConversationsSidebar(props: ConversationSidebarProps) {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const [focusOnSearch, setFocusOnSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const moreIconReference = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const onSearchConversationClicked = (event: MouseEvent) => {
    setFocusOnSearch(true);
  };

  const handleMenuOpen = (event: MouseEvent) => {
    setOpenMenu(true);
    setAnchorEl(moreIconReference.current);
  };

  const actions: any = {
    newGroup: () => {
      props.handleGroupCreationStage("addParticipants");
    },
    logOut: () => {},
  };

  const handleMenuClose = (action: string) => (event: MouseEvent) => {
    setOpenMenu(false);

    if (action !== "close") {
      actions[action]();
    }
  };

  const sidebarHeaderButtons: JSX.Element[] = [
    <IconButton key="sidebarChat" onClick={onSearchConversationClicked}>
      <ChatIcon />
    </IconButton>,
    <IconButton
      key="sidebarMore"
      onClick={handleMenuOpen}
      ref={moreIconReference}
    >
      <MoreVertIcon />
    </IconButton>,
  ];

  return (
    <div className="conversations-sidebar">
      <Header
        title={loggedInUser.firstName + " " + loggedInUser.lastName}
        imageUrl={loggedInUser.imageUrl.toString()}
        buttons={sidebarHeaderButtons}
      />
      <Search
        filterAction={filterUsers}
        placeHolder="חפש/י או התחל/י צ'אט חדש"
        autoFocus={focusOnSearch}
        selectSearchCriteria={selectSearchCriteria}
      />
      <Conversations />
      <Menu
        id="sidebar-options-menu"
        keepMounted
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose("close")}
      >
        <MenuItem onClick={handleMenuClose("newGroup")}>קבוצה חדשה</MenuItem>
        <MenuItem onClick={handleMenuClose("logOut")}>התנתק/י</MenuItem>
      </Menu>
    </div>
  );
}
