import { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  FormControl,
  InputAdornment,
  Button,
  Toolbar,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { getData } from "../../requests";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles.css";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

export const SearchBar = ({
  setSearchResult,
  setPlaceholderText,
}: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");

  const triggerSearch = async () => {
    await getData(searchString)
      .then((res) => {
        const { data } = res;
        setSearchResult(data);
      })
      .catch((e) => {
        console.error(e);
        setSearchResult([]); // Fallback on error
      });
    setPlaceholderText("Keine Treffer :(");
  };

  return (
    <Toolbar
      variant="dense"
      style={{
        backgroundColor: "#ffdcc5",
        borderBottom: " 1px solid rgb(189, 189, 189)",
      }}
    >
      <div id="search">
        <div style={{ width: "15vw" }}></div>
        <div style={{ width: "70vw" }}>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",

              backgroundColor: "#ffdcc5",
            }}
            variant="standard"
          >
            <OutlinedInput
              autoFocus
              autoComplete="off"
              id="webservicesearch"
              type="outlined"
              placeholder="Webservice suchen..."
              value={searchString}
              style={{
                width: 600,
                height: 40,
                backgroundColor: "white",
              }}
              onChange={(e) => setSearchString(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
              startAdornment={
                <SearchIcon style={{ marginLeft: -8, marginRight: 6 }} />
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => setSearchString("")}
                  >
                    <CancelIcon style={{ marginRight: -14, marginLeft: -8 }} />
                  </IconButton>
                </InputAdornment>
              }
            />
            <Button
              id="search-button"
              size="small"
              onClick={triggerSearch}
              sx={{
                fontSize: 14,
                backgroundColor: "white",
              }}
              type="submit"
              variant="outlined"
              aria-label="search"
              color="inherit"
            >
              {"Suchen"}
            </Button>
          </FormControl>
        </div>
        <div style={{ backgroundColor: "#F0F0F0", fontSize: 14 }}>
          __Dropdown Placeholder
        </div>
      </div>
    </Toolbar>
  );
};
