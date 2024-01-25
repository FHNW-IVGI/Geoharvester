import { useState } from "react";
import { ImpressumDialog } from "../ImpressumDialog";
import { IconButton, Menu, Divider, useTheme, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuItem from "@mui/material/MenuItem";
import TerminalIcon from "@mui/icons-material/Terminal";
<<<<<<< HEAD
=======
import GradingIcon from "@mui/icons-material/Grading";
import { LanguageContext } from "src/lang/LanguageContext";
import { LANGUAGE } from "src/constants";
import geoharvesterLogo from "./logo.png";

>>>>>>> 9566590 (Fix parsing for redis)
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

  const closeAll = () => {
    setMenuOpen(false);
    handleClose();
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
<<<<<<< HEAD
          <InfoIcon style={{ marginRight: 14 }} />
          Impressum
        </MenuItem>
=======
          <GradingIcon style={{ marginRight: 14 }} />
          <FormattedMessage id="menu.impressum" defaultMessage="Impressum" />
        </MenuItem>
        <Divider />
        <ListItemButton onClick={handleClickOpen}>
          <Translate style={{ marginRight: 14 }} />
          <ListItemText
            primary={intl.formatMessage({
              id: "translate.language",
              defaultMessage: "Sprache",
            })}
          />
          {menuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={menuOpen} timeout="auto">
          <List component="div" disablePadding dense>
            <ListItemButton
              sx={{ pl: 4 }}
              id={LANGUAGE.DE}
              onClick={(e) => {
                setLanguage(e.currentTarget.id as LANGUAGE);
                closeAll();
              }}
            >
              <ListItemText
                primary={intl.formatMessage({
                  id: "translate.german",
                  defaultMessage: "Deutsch",
                })}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              id={LANGUAGE.FR}
              onClick={(e) => {
                setLanguage(e.currentTarget.id as LANGUAGE);
                closeAll();
              }}
            >
              <ListItemText
                primary={intl.formatMessage({
                  id: "translate.french",
                  defaultMessage: "Französisch",
                })}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              id={LANGUAGE.IT}
              onClick={(e) => {
                setLanguage(e.currentTarget.id as LANGUAGE);
                closeAll();
              }}
            >
              <ListItemText
                primary={intl.formatMessage({
                  id: "translate.italian",
                  defaultMessage: "Italienisch",
                })}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              id={LANGUAGE.EN}
              onClick={(e) => {
                setLanguage(e.currentTarget.id as LANGUAGE);
                closeAll();
              }}
            >
              <ListItemText
                primary={intl.formatMessage({
                  id: "translate.english",
                  defaultMessage: "Englisch",
                })}
              />
            </ListItemButton>
          </List>
        </Collapse>
>>>>>>> 9566590 (Fix parsing for redis)
      </Menu>

      <ImpressumDialog open={openImpressum} setOpen={setOpenImpressum} />
    </Box>
  );
};
