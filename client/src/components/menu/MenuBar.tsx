import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { SearchBar, SearchBarProps } from "./SearchBar";

import "./menu.css";

const geoharvesterLogo = require("../../img/geoharvester_logo.png");

export const MenuBar = ({ setSearchResult }: SearchBarProps) => {
  return (
    <AppBar position="static">
      <Toolbar style={{ borderBottom: "1px solid grey" }} variant="dense">
        <img
          alt="geoharvester-logo"
          src={String(geoharvesterLogo)}
          width="320"
          height="45"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <a id="menu-text" href="/api/docs#/" target="_blank">
          <Button color="inherit">
            <span style={{ fontWeight: "bold" }}>Docs</span>
          </Button>
        </a>
        <a id="menu-text" target="_blank">
          <Button color="inherit">
            <span style={{ fontWeight: "bold" }}>Help</span>
          </Button>
        </a>
      </Toolbar>

      <SearchBar setSearchResult={setSearchResult} />
    </AppBar>
  );
};
