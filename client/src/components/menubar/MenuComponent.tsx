import { useState } from "react";
import { ImpressumDialog } from "../ImpressumDialog";
import { IconButton, Menu, Divider, useTheme, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuItem from "@mui/material/MenuItem";
import TerminalIcon from "@mui/icons-material/Terminal";
import "../../styles.css";
import geoharvesterLogo from "./logo.png";

export const MenuComponent = () => {
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

  return (
    <Box>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          size="large"
          aria-label="menu"
          sx={{ color: theme.palette.primary.main }}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <img
          id="GeoharvesterLogo"
          alt="GeoharvesterLogo"
          src={String(geoharvesterLogo)}
          width="242"
          height="29"
          style={{ marginLeft: -10 }}
        />
      </div>
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
            window.open("https://geoharvester.ch/api/docs");
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

      <ImpressumDialog open={openImpressum} setOpen={setOpenImpressum} />
    </Box>
  );
};
