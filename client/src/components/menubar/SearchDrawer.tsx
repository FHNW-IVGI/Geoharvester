import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import {
  PROVIDERTYPE,
  SERVICE,
  BREAKPOINT600,
  BREAKPOINT1000,
} from "src/constants";
import { SearchField } from "./SearchField";

type SearchDrawerProps = {
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICE | undefined,
    provider: PROVIDERTYPE | undefined,
    page: number
  ) => void;
  setSearchString: (searchString: string) => void;
  resetPageToZero: () => void;
  setDrawerOpen: (state: boolean) => void;
  drawerOpen: boolean;
};

export const SearchDrawer = ({
  triggerSearch,
  setSearchString,
  resetPageToZero,
  setDrawerOpen,
  drawerOpen,
}: SearchDrawerProps) => {
  return (
    <div>
      <Button variant="contained" onClick={() => setDrawerOpen(true)}>
        Suche
      </Button>
      <SwipeableDrawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 80,
          }}
        >
          <SearchField
            fromDrawer
            {...{
              triggerSearch,
              setSearchString,
              resetPageToZero,
              setDrawerOpen,
            }}
          />
        </Box>
      </SwipeableDrawer>
    </div>
  );
};
