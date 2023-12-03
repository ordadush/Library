import { Avatar } from "@material-ui/core";
import Yair from "../images/0.jpg";
import One from "../images/1.jpg";
import Two from "../images/2.jpg";
import Three from "../images/3.jpg";
import Four from "../images/4.jpg";
import Five from "../images/5.jpg";
import Six from "../images/6.jpg";
import Seven from "../images/7.jpg";
import Eight from "../images/8.jpg";
import Group from "../images/group.png";

import "../css/Header.css";

interface HeaderProps {
  buttons?: JSX.Element[];
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const images = [One, Two, Three, Four, Five, Six, Seven, Eight];

export default function Header(props: HeaderProps) {
  const getUserImage = () => {
    return props.imageUrl && props.imageUrl !== "0" && props.imageUrl !== "10"
      ? images[parseInt(props.imageUrl)]
      : props.imageUrl === "0"
      ? Yair
      : Group;
  };

  return (
    <div className="header">
      <div className="header-details">
        <div className="avatar">
          <Avatar src={getUserImage()} />
        </div>
        {props.subtitle ? (
          <div className="title-with-subtitle">
            <span>{props.title}</span>
            <div className="subtitle">
              <span>{props.subtitle}</span>
            </div>
          </div>
        ) : (
          <div className="title">{props.title}</div>
        )}
      </div>
      <div className="header-actions">{props.buttons?.map((btn) => btn)}</div>
    </div>
  );
}
