import { useState, useEffect } from "react";
import {
  IconButton,
  OutlinedInput,
  Menu,
  FormControl,
  InputAdornment,
  Button,
  Toolbar,
  styled,
  Paper,
  Divider,
} from "@mui/material";
import { getData } from "../../requests";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuItem from "@mui/material/MenuItem";
import TerminalIcon from "@mui/icons-material/Terminal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "../../styles.css";

const geoharvesterLogo = require("../../img/geoharvester_logo_blue.png");

const ProviderList = [
  "Alle",
  "Bund",
  "Geodienste",
  "KT_AG",
  "KT_AI",
  "KT_AR",
  "KT_BE",
  "KT_BL",
  "KT_BS",
  "KT_FR",
  "KT_GE",
  "KT_GL",
  "KT_GR",
  "KT_JU",
  "KT_SG",
  "KT_SH",
  "KT_SO",
  "KT_SZ",
  "KT_TG",
  "KT_TI",
  "KT_VD",
  "KT_UR",
  "KT_ZG",
  "KT_ZH",
  "FL_LI",
];
const ServiceList = ["Alle", "wfs", "wms", "wmts"];

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

export const MenuBar = ({
  setSearchResult,
  setPlaceholderText,
}: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");
  const [servicetype, setService] = useState("Alle");
  const [provider, setProvider] = useState("Alle");
  const [render, setRender] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const triggerSearch = async () => {
    const svc = servicetype === "Alle" ? "" : servicetype;
    const prov = provider === "Alle" ? "" : provider;

    await getData(searchString, svc, prov)
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

  useEffect(() => {
    if (render < 1) {
      setRender(render + 1);
      return;
    }
    triggerSearch();
  }, [servicetype]);

  useEffect(() => {
    if (render < 1) {
      setRender(render + 1);
      return;
    }
    triggerSearch();
  }, [provider]);

  const handleChangeService = (event: SelectChangeEvent) => {
    setService(event.target.value);
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    setProvider(event.target.value);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const SearchButton = styled(Button)(({}) => ({
    color: "#101010",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#F0F0F0",
    },
  }));

  return (
    <Toolbar variant="dense" id="menubar">
      <Paper
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "spaceBetween",
          width: "100%",
          backgroundColor: "#007CC3",
        }}
      >
        <div style={{ width: "30%", display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="menu"
            sx={{ mr: 1, color: "#004B76" }}
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
                window.location.replace("/api/docs/");
              }}
            >
              <TerminalIcon style={{ marginRight: 14 }} />
              API
            </MenuItem>
          </Menu>
          <img
            alt="geoharvester-logo"
            src={String(geoharvesterLogo)}
            width="220"
            height="30"
            style={{ marginLeft: 6 }}
          />
        </div>
        <div style={{ display: "flex", flex: "1 1 auto" }}>
          <FormControl
            sx={{
              m: 1,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
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
                height: 32,
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
            <SearchButton
              id="search-button"
              size="small"
              onClick={triggerSearch}
              sx={{
                fontSize: 14,
                backgroundColor: "white",
                color: "#007CC3",
              }}
              type="submit"
              variant="outlined"
              aria-label="search"
            >
              {"Suchen"}
            </SearchButton>
          </FormControl>
        </div>
        <div id="filter">
          <FormControl
            variant="standard"
            sx={{
              minWidth: 120,
              marginRight: 2,
            }}
          >
            <Select
              autoComplete="off"
              labelId="select-provider-label"
              id="select-provider"
              value={provider}
              onChange={handleChangeProvider}
              style={{
                backgroundColor: "white",
                textAlign: "center",
                height: 30,
                margin: "auto 6",
                color: "#007CC3",
              }}
            >
              {ProviderList.map((provider) => {
                return (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, marginRight: 2 }}
          >
            <Select
              autoComplete="off"
              defaultValue={""}
              labelId="select-service-label"
              id="select-service"
              value={servicetype}
              onChange={handleChangeService}
              label="Service Type"
              style={{
                backgroundColor: "white",
                textAlign: "center",
                height: 30,
                margin: "auto 6",
                color: "#007CC3",
              }}
            >
              {ServiceList.map((servicetype) => {
                return (
                  <MenuItem key={servicetype} value={servicetype}>
                    {servicetype}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </Paper>
    </Toolbar>
  );
};
