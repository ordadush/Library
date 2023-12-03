import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import "../css/Search.css";

interface SearchProps {
  filterAction: any;
  selectSearchCriteria: any;
  placeHolder: string;
  autoFocus: boolean;
}

export default function Search(props: SearchProps) {
  const dispatch = useAppDispatch();
  const searchCriteria = useAppSelector(props.selectSearchCriteria);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(props.filterAction(event.currentTarget.value));
  };

  return (
    <div className="search">
      <TextField
        style={{ width: "85%" }}
        value={searchCriteria}
        focused={props.autoFocus}
        autoFocus={props.autoFocus}
        placeholder={props.placeHolder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon></SearchIcon>
            </InputAdornment>
          ),
        }}
        onChange={onInputChange}
        type="search"
      />
    </div>
  );
}
