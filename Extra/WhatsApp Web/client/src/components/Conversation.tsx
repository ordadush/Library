import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { useAppDispatch } from "../app/hooks";
import { selectConversation } from "../app/reducers/conversationsSlice";
import One from "../images/1.jpg";
import Two from "../images/2.jpg";
import Three from "../images/3.jpg";
import Four from "../images/4.jpg";
import Five from "../images/5.jpg";
import Six from "../images/6.jpg";
import Seven from "../images/7.jpg";
import Eight from "../images/8.jpg";
import Group from "../images/group.png";
import "../css/Conversation.css";

const images = [
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  One,
  Two,
  Group,
];

interface ConversationProps {
  imageUrl: number;
  userName: string;
  lastMessage: string;
  conversationId?: string;
  lastMessageTime: string;
}

export default function Conversation(props: ConversationProps) {
  const dispatch = useAppDispatch();

  const getImage = (index: number) => {
    return images[index];
  };

  const onConversationClicked = () => {
    props.conversationId && dispatch(selectConversation(props.conversationId));
  };

  return (
    <div className="conversation">
      <ListItem button={true} onClick={onConversationClicked}>
        <ListItemAvatar>
          <Avatar src={getImage(props.imageUrl)} />
        </ListItemAvatar>
        <ListItemText primary={props.userName} secondary={props.lastMessage} />
        <div className="last-message-time">
          <ListItemSecondaryAction>
            {props.lastMessageTime}
          </ListItemSecondaryAction>
        </div>
      </ListItem>
      <Divider />
    </div>
  );
}
