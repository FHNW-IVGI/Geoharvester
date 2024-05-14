import { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  Button,
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { BREAKPOINT1000 } from "src/constants";
import { useViewport } from "src/custom/ViewportHook";
import { SearchParameters } from "src/types";
import { FormattedMessage, useIntl } from "react-intl";

export type SearchProps = {
  setDrawerOpen: (state: boolean) => void;
  triggerSearch: (parameter: SearchParameters) => void;
  searchParameters: SearchParameters;
};

export type SearchFieldProps = {
  fromDrawer: boolean;
} & SearchProps;

export const SearchField = ({
  setDrawerOpen,
  fromDrawer,
  triggerSearch,
  searchParameters,
}: SearchFieldProps) => {
  const theme = useTheme();
  const responsiveUI = useViewport().width < BREAKPOINT1000;
  const intl = useIntl();

  const [localSearchString, setLocalSearchString] = useState("");
  const drawerEnabled = fromDrawer ? fromDrawer : false;

  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexGrow: 2,
      }}
      variant="standard"
    >
      <OutlinedInput
        autoFocus
        autoComplete="off"
        id="webservicesearch"
        type="outlined"
        placeholder={intl.formatMessage({
          id: "search.inputPlaceholder",
          defaultMessage: "Webservice suchen...",
        })}
        value={localSearchString}
        style={{
          flexGrow: 2,
          height: responsiveUI ? 56 : 40,
          backgroundColor: theme.palette.secondary.main,
        }}
        onChange={(e) => setLocalSearchString(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && triggerSearch({ ...searchParameters, page: 0 })
        }
        startAdornment={
          <SearchIcon style={{ marginLeft: -8, marginRight: 6 }} />
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={() => {
                setLocalSearchString("");
              }}
            >
              <CancelIcon style={{ marginRight: -14, marginLeft: -8 }} />
            </IconButton>
          </InputAdornment>
        }
      />
      <Button
        id="search-button"
        size="small"
        onClick={() => {
          drawerEnabled && setDrawerOpen(false);
          triggerSearch({ ...searchParameters, page: 0 });
        }}
        sx={{
          fontSize: 14,
        }}
        type="submit"
        variant="contained"
        aria-label="search"
      >
        <FormattedMessage id="search.searchButton" defaultMessage="Suchen" />
      </Button>
    </FormControl>
  );
};
