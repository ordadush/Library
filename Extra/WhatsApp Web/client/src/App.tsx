import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Main from "./components/Main";
import {
  fetchUsers,
  selectLoggedInUser,
  selectUsersDataStatus,
} from "./app/reducers/usersSlice";
import {
  fetchMessages,
  selectMessagesDataStatus,
} from "./app/reducers/messagesSlice";
import {
  fetchConversations,
  selectConversationsDataStatus,
} from "./app/reducers/conversationsSlice";
import { CircularProgress } from "@material-ui/core";

function App() {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const dispatch = useAppDispatch();

  dispatch(fetchUsers());
  dispatch(fetchConversations());
  dispatch(fetchMessages(loggedInUser.mobile));

  const initialDataStatuses = [
    useAppSelector(selectUsersDataStatus),
    useAppSelector(selectConversationsDataStatus),
    useAppSelector(selectMessagesDataStatus),
  ];

  return (
    <>
      {initialDataStatuses.every((status) => status === "fulfilled") ? (
        <Main />
      ) : (
        <div className="circular-progress">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default App;
