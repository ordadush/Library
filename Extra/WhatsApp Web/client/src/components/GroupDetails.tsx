import {
  Avatar,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useState } from "react";
import Group from "../images/group.png";
import MoodIcon from "@material-ui/icons/Mood";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  cleanParticipants,
  selectLoggedInUser,
  selectParticipants,
} from "../app/reducers/usersSlice";
import { addConversation } from "../app/reducers/conversationsSlice";

import "../css/GroupDetails.css";

interface GroupDetailsProps {
  handleGroupCreationStage: (stage: string) => void;
}

export default function GroupDetails(props: GroupDetailsProps) {
  const [groupName, setGroupName] = useState("");
  const participants = useAppSelector(selectParticipants);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const dispatch = useAppDispatch();

  const onBackClicked = () => {
    props.handleGroupCreationStage("addParticipants");
  };

  const onNextClicked = () => {
    if (groupName) {
      dispatch(
        addConversation({
          groupName: groupName,
          participants: [
            ...participants.map((par) => par.mobile),
            loggedInUser.mobile,
          ],
        })
      );
      dispatch(cleanParticipants());
      props.handleGroupCreationStage("closed");
    }
  };

  const onGroupNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.currentTarget.value);
  };

  return (
    <div className="group-details">
      <div className="group-details-header">
        <IconButton onClick={onBackClicked} color="inherit">
          <ArrowForwardIcon />
        </IconButton>
        <span className="group-details-title">קבוצה חדשה</span>
      </div>
      <div className="group-details-body">
        <div className="group-image">
          <IconButton className="group-image-button">
            <Avatar src={Group} className="group-image-avatar" />
          </IconButton>
        </div>
        <TextField
          style={{ width: "85%" }}
          placeholder={"נושא הקבוצה"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MoodIcon></MoodIcon>
              </InputAdornment>
            ),
          }}
          onChange={onGroupNameChanged}
          type="search"
        />
        <div className="group-details-next-step">
          <div className="next-step-button">
            <IconButton
              onClick={onNextClicked}
              disabled={groupName === ""}
              color="inherit"
            >
              <ArrowBack color="inherit" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
