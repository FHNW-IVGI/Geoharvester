import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./menu.css";

const geoharvesterLogo = require("../../img/geoharvester_logo.png");

export function MenuBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
      </AppBar>
    </Box>
  );
}
