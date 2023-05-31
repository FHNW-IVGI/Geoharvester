import { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  FormControl,
  InputAdornment,
  Button,
  Toolbar,
  styled,
  useTheme,
} from "@mui/material";
import { getData } from "../../requests";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import { DEFAULTPROVIDER, DEFAULTSERVICE } from "src/constants";
import { MenuDropdown } from "./MenuDropdown";
import { Filter } from "./Filter";
import "../../styles.css";

export type SearchBarProps = {
  setSearchResult: (searchResult: any) => void;
  setPlaceholderText: (text: string) => void;
};

export const MenuBar = ({
  setSearchResult,
  setPlaceholderText,
}: SearchBarProps) => {
  const [searchStringState, setSearchString] = useState("");
  const [servicetypeState, setServiceState] = useState(DEFAULTSERVICE);
  const [providerState, setProviderState] = useState(DEFAULTPROVIDER);
  const theme = useTheme();

  const triggerSearch = async (
    searchString: string | undefined,
    servicetype: string | undefined,
    provider: string | undefined
  ) => {
    // Fall back to state if an argument is not provided, then parse the default as empty string for the API where necessary
    const queryParameter =
      searchString === undefined ? searchStringState : searchString;

    const svc = servicetype === undefined ? servicetypeState : servicetype;
    const svcParameter = svc === DEFAULTSERVICE ? "" : svc;

    const prov = provider === undefined ? providerState : provider;
    const provParameter = prov === DEFAULTPROVIDER ? "" : prov;

    await getData(queryParameter, svcParameter, provParameter)
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

  const handleChangeService = (event: SelectChangeEvent) => {
    setServiceState(event.target.value);
    triggerSearch(undefined, event.target.value, undefined);
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    setProviderState(event.target.value);
    triggerSearch(undefined, undefined, event.target.value);
  };

  const SearchButton = styled(Button)(() => ({
    color: "#101010",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#E8E8E8",
    },
  }));

  return (
    <Toolbar variant="dense" id="menubar">
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
            value={searchStringState}
            style={{
              width: 600,
              height: 32,
              backgroundColor: "white",
            }}
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              triggerSearch(searchStringState, undefined, undefined)
            }
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
            onClick={() =>
              triggerSearch(searchStringState, undefined, undefined)
            }
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
      <Filter
        handleChangeService={handleChangeService}
        handleChangeProvider={handleChangeProvider}
        provider={providerState}
        servicetype={servicetypeState}
      />
    </Toolbar>
  );
};
