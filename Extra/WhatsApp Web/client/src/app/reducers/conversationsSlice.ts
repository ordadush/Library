import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import Conversation from "../../types/Conversation";
import axios from "axios";

interface ConverationsState {
  conversations: Conversation[];
  selectedConversation: string;
  initialDataStatus: string;
}

const initialState: ConverationsState = {
  initialDataStatus: "pending",
  conversations: [],
  selectedConversation: "",
};

export const fetchConversations = createAsyncThunk(
  "coversations/fetchConversations",
  async () => {
    const response = await axios.get("http://localhost:8000/conversations");
    return response.data;
  }
);

export const addConversation = createAsyncThunk(
  "coversations/add",
  async (data: any) => {
    const response = await axios.put(
      "http://localhost:8000/conversations/add",
      {
        newConversation: {
          messages: [],
          name: data.groupName,
          users: data.participants,
        },
      }
    );
    return response.data;
  }
);

export const cleanMessages = createAsyncThunk(
  "coversations/cleanMessages",
  async (conversationID: string) => {
    const response = await axios.put(
      "http://localhost:8000/conversations/cleanMessages",
      {
        conversationID: conversationID,
      }
    );
    return response.data;
  }
);

export const deleteConversation = createAsyncThunk(
  "coversations/delete",
  async (conversationID: string) => {
    const response = await axios.put(
      "http://localhost:8000/conversations/delete",
      {
        conversationID: conversationID,
      }
    );
    return response.data;
  }
);

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      let conversation = state.conversations.find(
        (conv) => conv._id === state.selectedConversation
      );

      if (conversation) {
        conversation.messages = [...conversation.messages, action.payload];
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      let conversation = state.conversations.find(
        (conv) => conv._id === state.selectedConversation
      );

      if (conversation) {
        conversation.messages = conversation.messages.filter(
          (msg) => msg !== action.payload
        );
      }
    },
    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.conversations = [...action.payload];
      state.initialDataStatus = "fulfilled";
    });
    builder.addCase(addConversation.pending, (state, action) => {
      const { groupName, participants } = action.meta.arg;
      state.conversations = [
        ...state.conversations,
        {
          _id: "temp",
          messages: [],
          users: [...participants],
          name: groupName,
        },
      ];
      state.selectedConversation = "temp";
    });
    builder.addCase(addConversation.fulfilled, (state, action) => {
      state.conversations = [
        ...state.conversations.filter(
          (conversation) => conversation._id !== "temp"
        ),
        {
          ...action.payload,
        },
      ];
      state.selectedConversation = action.payload._id;
    });
    builder.addCase(cleanMessages.pending, (state) => {
      let conversation = state.conversations.find(
        (conv) => conv._id === state.selectedConversation
      );

      if (conversation) {
        conversation.messages = [];
      }
    });
    builder.addCase(deleteConversation.pending, (state) => {
      state.conversations = state.conversations.filter(
        (conv) => conv._id !== state.selectedConversation
      );
      state.selectedConversation = "";
    });
  },
});

export const { addMessage, removeMessage, selectConversation } =
  conversationsSlice.actions;

export const selectConversations = (state: RootState) =>
  state.conversations.conversations;

export const selectCurrentConversation = (state: RootState) =>
  state.conversations.conversations.find(
    (conv) => conv._id === state.conversations.selectedConversation
  );

export const selectConversationsDataStatus = (state: RootState) =>
  state.conversations.initialDataStatus;

export default conversationsSlice.reducer;
