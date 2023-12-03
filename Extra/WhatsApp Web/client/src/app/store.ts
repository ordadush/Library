import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./reducers/usersSlice";
import conversationsReducer from "./reducers/conversationsSlice";
import messagesReducer from "./reducers/messagesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
