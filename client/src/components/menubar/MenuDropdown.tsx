import { useState } from "react";
import { ImpressumDialog } from "../ImpressumDialog";
import { IconButton, Menu, Divider, useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuItem from "@mui/material/MenuItem";
import TerminalIcon from "@mui/icons-material/Terminal";
import "../../styles.css";

export const MenuDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openImpressum, setOpenImpressum] = useState(false);

  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClickOpenImpressum = () => setOpenImpressum(true);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const geoharvesterLogo = require("../../img/geoharvester_logo_blue.png");

  return (
    <div style={{ minWidth: 300, display: "flex", alignItems: "center" }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="menu"
        sx={{ mr: 1, color: theme.palette.secondary.main }}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ marginLeft: -16 }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            window.open("https://github.com/FHNW-IVGI/Geoharvester");
          }}
        >
          <DescriptionIcon style={{ marginRight: 14 }} />
          Documentation
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            window.location.href = "http://3.76.227.122/api/docs";
          }}
        >
          <TerminalIcon style={{ marginRight: 14 }} />
          API
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClickOpenImpressum}>
          <InfoIcon style={{ marginRight: 14 }} />
          Impressum
        </MenuItem>
      </Menu>
      <img
        alt="geoharvester-logo"
        src={String(geoharvesterLogo)}
        width="242"
        height="29"
        style={{ marginLeft: -10 }}
      />
      <ImpressumDialog
        open={openImpressum}
        setOpen={setOpenImpressum}
      ></ImpressumDialog>
    </div>
  );
};
