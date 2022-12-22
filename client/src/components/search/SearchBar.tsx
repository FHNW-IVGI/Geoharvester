import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import "./SearchBar.css";

export const SearchBar = () => {
  return (
    <div id="search">
      <div id="search-toparea"></div>
      <div id="search-searcharea">
        <FormControl sx={{ m: 1, width: "100ch" }} variant="outlined">
          <InputLabel htmlFor="search-bar">Search</InputLabel>
          <OutlinedInput
            id="search-bar"
            type="text"
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  aria-label="trigger-search"
                  onClick={() => console.log("not implemented")}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="trigger-cancel"
                  onClick={() => console.log("not implemented")}
                  edge="end"
                >
                  <CancelIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Search"
          />
        </FormControl>
      </div>
      <div id="search-resultarea"></div>
    </div>
  );
};
