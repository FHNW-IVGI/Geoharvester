import { useState, useEffect } from "react";
import {
  IconButton,
  OutlinedInput,
  FormControl,
  InputAdornment,
  Button,
  Toolbar,
  styled,
  Paper,
  useTheme,
} from "@mui/material";
import { getData } from "../../requests";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  PROVIDERLIST,
  DEFAULTPROVIDER,
  SERVICELIST,
  DEFAULTSERVICE,
} from "src/constants";
import "../../styles.css";
import { MenuDropdown } from "./MenuDropdown";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

export const MenuBar = ({
  setSearchResult,
  setPlaceholderText,
}: SearchBarProps) => {
  const [searchString, setSearchString] = useState("");
  const [servicetype, setService] = useState(DEFAULTSERVICE);
  const [provider, setProvider] = useState(DEFAULTPROVIDER);
  const [render, setRender] = useState(0);
  const theme = useTheme();

  const triggerSearch = async () => {
    const svc = servicetype === DEFAULTSERVICE ? "" : servicetype;
    const prov = provider === DEFAULTPROVIDER ? "" : provider;

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

  const SearchButton = styled(Button)(({}) => ({
    color: "#101010",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#E8E8E8",
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
          borderRadius: "0%",
        }}
      >
        <MenuDropdown />
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
                color: theme.palette.primary.main,
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
            variant="outlined"
            sx={{
              minWidth: 120,
              marginRight: 2,
              marginBottom: 1.5,
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
                height: 25,
                color: "#007CC3",
              }}
            >
              {PROVIDERLIST.map((provider) => {
                return (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 100,
              marginRight: 17,
              marginBottom: 1.5,
            }}
          >
            <Select
              autoComplete="off"
              defaultValue={""}
              labelId="select-service-label"
              id="select-service"
              value={servicetype}
              onChange={handleChangeService}
              style={{
                backgroundColor: "white",
                textAlign: "center",
                height: 25,
                color: "#007CC3",
              }}
            >
              {SERVICELIST.map((servicetype) => {
                return (
                  <MenuItem key={servicetype} value={servicetype}>
                    {servicetype}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {/* <ImpressumDialog
            open={openImpressum}
            setOpen={setOpenImpressum}
          ></ImpressumDialog> */}
        </div>
      </Paper>
    </Toolbar>
  );
};
