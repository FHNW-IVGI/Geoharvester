import React, { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  InputAdornment,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { getData } from "../../requests";
import "./search.css";

type SearchBarProps = {
  setSearchResults: (searchResult: any) => void;
};

export const SearchBar = ({ setSearchResults }: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");

  const triggerSearch = async () =>
    await getData(searchString)
      .then((res) => {
        const { data } = res;
        setSearchResults(data);
      })
      .catch((e) => {
        console.error(e);
        setSearchResults([]); // Fallback on error
      });

  return (
    <div id="search">
      <FormControl sx={{ m: 1, width: "100ch" }} variant="outlined">
        <InputLabel htmlFor="search-bar">Search</InputLabel>
        <OutlinedInput
          id="search-bar"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="trigger-cancel"
                onClick={() => setSearchString("")}
                edge="end"
              >
                <CancelIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Search"
        />
      </FormControl>
      <Button id="search-button" size="large" onClick={triggerSearch}>
        Search
      </Button>
    </div>
  );
};
