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
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import { MenuDropdown } from "./MenuDropdown";
import { Filter } from "./Filter";
import "../../styles.css";
import { PROVIDERTYPE, SERVICETYPE } from "src/constants";

export type SearchBarProps = {
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICETYPE | undefined,
    provider: PROVIDERTYPE | undefined
  ) => void;
  servicetypeState: SERVICETYPE;
  setServiceState: (serviceState: SERVICETYPE) => void;
  providerState: PROVIDERTYPE;
  setProviderState: (serviceState: PROVIDERTYPE) => void;
  searchStringState: string;
  setSearchString: (searchString: string) => void;
};

export const MenuBar = ({
  triggerSearch,
  setServiceState,
  servicetypeState,
  setProviderState,
  providerState,
  setSearchString,
  searchStringState,
}: SearchBarProps) => {
  const theme = useTheme();

  const handleChangeService = (event: SelectChangeEvent) => {
    setServiceState(event.target.value as SERVICETYPE);
    triggerSearch(undefined, event.target.value as SERVICETYPE, undefined);
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    setProviderState(event.target.value as PROVIDERTYPE);
    triggerSearch(undefined, undefined, event.target.value as PROVIDERTYPE);
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
