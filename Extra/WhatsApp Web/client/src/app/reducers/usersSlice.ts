import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import User from "../../types/User";
import axios from "axios";

interface UsersState {
  loggedInUser: User;
  users: User[];
  filteredUsers: User[];
  initialDataStatus: string;
  participants: User[];
  searchCriteria: string;
}

const initialState: UsersState = {
  users: [],
  participants: [],
  filteredUsers: [],
  searchCriteria: "",
  initialDataStatus: "pending",
  loggedInUser: {
    firstName: "יאיר",
    lastName: "ורד",
    mobile: "0546855744",
    password: "123456",
    imageUrl: 0,
  },
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("http://localhost:8000/users");
  return response.data;
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    filterUsers: (state, action: PayloadAction<string>) => {
      state.filteredUsers = state.users.filter((usr) =>
        (usr.firstName + " " + usr.lastName).includes(action.payload)
      );
      state.searchCriteria = action.payload;
    },
    addParticipant: (state, action: PayloadAction<string>) => {
      const selectedUser = state.users.find(
        (usr) => usr.mobile === action.payload
      );
      if (selectedUser) {
        state.participants = [...state.participants, selectedUser];
        state.searchCriteria = "";
        state.filteredUsers = state.users.filter((usr) =>
          (usr.firstName + " " + usr.lastName).includes("")
        );
      }
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(
        (usr) => usr.mobile !== action.payload
      );
    },
    cleanParticipants: (state) => {
      state.participants = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
      state.initialDataStatus = "fulfilled";
    });
  },
});

export const {
  filterUsers,
  addParticipant,
  removeParticipant,
  cleanParticipants,
} = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;

export const selectUserById = (userId?: string) => (state: RootState) =>
  state.users.users.find((usr) => usr.mobile === userId);

export const selectFilteredUsers = (state: RootState) =>
  state.users.filteredUsers;

export const selectParticipants = (state: RootState) =>
  state.users.participants;

export const selectLoggedInUser = (state: RootState) =>
  state.users.loggedInUser;

export const selectUsersDataStatus = (state: RootState) =>
  state.users.initialDataStatus;

export const selectSearchCriteria = (state: RootState) =>
  state.users.searchCriteria;

export default usersSlice.reducer;
