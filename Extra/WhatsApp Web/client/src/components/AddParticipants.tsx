import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { MouseEvent } from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Search from "./Search";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addParticipant,
  filterUsers,
  removeParticipant,
  selectFilteredUsers,
  selectParticipants,
  selectSearchCriteria,
} from "../app/reducers/usersSlice";
import One from "../images/1.jpg";
import Two from "../images/2.jpg";
import Three from "../images/3.jpg";
import Four from "../images/4.jpg";
import Five from "../images/5.jpg";
import Six from "../images/6.jpg";
import Seven from "../images/7.jpg";
import Eight from "../images/8.jpg";
import "../css/AddParticipants.css";

const images = [One, Two, Three, Four, Five, Six, Seven, Eight, One, Two];

interface AddParticipantsProps {
  handleGroupCreationStage: (stage: string) => void;
}

export default function AddParticipants(props: AddParticipantsProps) {
  const dispatch = useAppDispatch();
  const filteredUsers = useAppSelector(selectFilteredUsers);
  const participants = useAppSelector(selectParticipants);

  const onBackClicked = (event: MouseEvent) => {
    props.handleGroupCreationStage("closed");
  };

  const onNextClicked = (event: MouseEvent) => {
    props.handleGroupCreationStage("groupDetails");
  };

  const getImage = (index: number) => {
    return images[index];
  };

  const onParticipantClicked = (mobile: string) => () => {
    dispatch(addParticipant(mobile));
  };

  const onRemoveParticipantClicked = (mobile: string) => () => {
    dispatch(removeParticipant(mobile));
  };

  return (
    <div className="add-participants">
      <div className="add-participants-header">
        <IconButton onClick={onBackClicked} color="inherit">
          <ArrowForwardIcon />
        </IconButton>
        <span className="add-participants-title">הוספת משתמשים לקבוצה</span>
      </div>
      <Search
        filterAction={filterUsers}
        autoFocus={true}
        placeHolder="הזנ/י שם איש קשר"
        selectSearchCriteria={selectSearchCriteria}
      />
      {participants.length > 0 && (
        <div className="selected-participants">
          {participants.map((usr) => (
            <div key={usr.mobile} className="participant-chip">
              <Chip
                avatar={<Avatar src={getImage(usr.imageUrl)} />}
                label={usr.firstName + " " + usr.lastName}
                onDelete={onRemoveParticipantClicked(usr.mobile)}
                variant="outlined"
              />
            </div>
          ))}
        </div>
      )}
      <Divider />
      <List className="users">
        {filteredUsers
          .filter((usr) => !participants.includes(usr))
          .map((usr) => {
            return (
              <div key={usr.mobile}>
                <ListItem
                  button={true}
                  onClick={onParticipantClicked(usr.mobile)}
                >
                  <ListItemAvatar>
                    <Avatar src={getImage(usr.imageUrl)} />
                  </ListItemAvatar>
                  <ListItemText primary={usr.firstName + " " + usr.lastName} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
      </List>
      {participants.length > 0 && (
        <div className="next-step">
          <div className="next-step-button">
            <IconButton
              onClick={onNextClicked}
              color="inherit"
              disabled={participants.length < 2}
            >
              <ArrowBack color="inherit" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}
