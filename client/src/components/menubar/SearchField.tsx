import { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  Button,
  styled,
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { PROVIDERTYPE, SERVICE } from "src/constants";

const page = 0; // a For search triggered by Menubar we always want to start from the first pagination page.

export type SearchFieldProps = {
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICE | undefined,
    provider: PROVIDERTYPE | undefined,
    page: number
  ) => void;
  setSearchString: (searchString: string) => void;

  resetPageToZero: () => void;
};

export const SearchField = ({
  triggerSearch,
  setSearchString,

  resetPageToZero,
}: SearchFieldProps) => {
  const theme = useTheme();

  const [localSearchString, setLocalSearchString] = useState("");

  return (
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
        value={localSearchString}
        style={{
          flexGrow: 2,
          maxWidth: 600,
          height: 32,
          backgroundColor: "white",
        }}
        onChange={(e) => setLocalSearchString(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          triggerSearch(localSearchString, undefined, undefined, page)
        }
        startAdornment={
          <SearchIcon style={{ marginLeft: -8, marginRight: 6 }} />
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={() => {
                setSearchString("");
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
          resetPageToZero();
          setSearchString(localSearchString);
          triggerSearch(localSearchString, undefined, undefined, page);
        }}
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
      </Button>
    </FormControl>
  );
};
