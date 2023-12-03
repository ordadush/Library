import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import Message from "../../types/Message";
import axios from "axios";
import { addMessage, removeMessage } from "./conversationsSlice";

interface MessagesState {
  messages: Message[];
  filteredMessage: Message[];
  initialDataStatus: string;
  searchCriteria: string;
}

const initialState: MessagesState = {
  messages: [],
  filteredMessage: [],
  searchCriteria: "",
  initialDataStatus: "pending",
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (userMobile: string) => {
    const response = await axios.get("http://localhost:8000/messages", {
      params: {
        userMobile: userMobile,
      },
    });
    return response.data;
  }
);

export const saveMessage = createAsyncThunk(
  "messages/saveMessage",
  async (message: Message, thunkAPI) => {
    message._id && thunkAPI.dispatch(removeMessage(message._id));

    let newMessage = { ...message };
    delete newMessage._id;

    const response = await axios.put(
      "http://localhost:8000/messages/saveMessage",
      { newMessage: newMessage }
    );

    thunkAPI.dispatch(addMessage(response.data._id));
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (props: any) => {
    const response = await axios.put(
      "http://localhost:8000/messages/deleteMessage",
      { messageID: props.messageID, userMobile: props.userMobile }
    );

    return response.data;
  }
);

export const updateMessage = createAsyncThunk(
  "messages/updateMessage",
  async (message: Message) => {
    const response = await axios.put(
      "http://localhost:8000/messages/updateMessage",
      { message: message }
    );

    return response.data;
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    filterMessages: (state, action: PayloadAction<string>) => {
      state.filteredMessage = action.payload
        ? state.messages.filter((msg) =>
            msg.description.includes(action.payload)
          )
        : [];
      state.searchCriteria = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = [...action.payload];
      state.initialDataStatus = "fulfilled";
    });
    builder.addCase(saveMessage.pending, (state, action) => {
      state.messages = [
        ...state.messages,
        {
          ...action.meta.arg,
          _id: action.meta.arg._id,
        },
      ];
    });
    builder.addCase(saveMessage.fulfilled, (state, action) => {
      state.messages = [
        ...state.messages.filter((msg) => msg._id !== action.meta.arg._id),
        action.payload,
      ];
    });
    builder.addCase(deleteMessage.pending, (state, action) => {
      const { messageID, userMobile } = action.meta.arg;

      let deletedMessage = state.messages.find((msg) => msg._id === messageID);

      if (deletedMessage) {
        deletedMessage.deletedBy.push(userMobile);
        state.messages = [
          ...state.messages.filter((msg) => msg._id !== messageID),
          deletedMessage,
        ];
      }
    });
    builder.addCase(updateMessage.pending, (state, action) => {
      let updatedMessages = [...state.messages];
      updatedMessages.forEach((msg) => {
        if (msg._id === action.meta.arg._id) {
          msg.starredBy = [...action.meta.arg.starredBy];
        }
      });
      state.messages = updatedMessages;
    });
  },
});

export const { filterMessages } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages.messages;

export const selectSearchCriteria = (state: RootState) =>
  state.messages.searchCriteria;

export const selectFilteredMessages = (state: RootState) =>
  state.messages.filteredMessage;

export const selectMessageById = (messageId: string) => (state: RootState) =>
  state.messages.messages.find((msg) => msg._id === messageId);

export const selectMessagesDataStatus = (state: RootState) =>
  state.messages.initialDataStatus;

export default messagesSlice.reducer;
