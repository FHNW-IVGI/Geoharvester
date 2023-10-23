import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import {
  PROVIDERTYPE,
  SERVICE,
  BREAKPOINT600,
  BREAKPOINT1000,
} from "src/constants";
import { SearchField, SearchProps } from "./SearchField";
import "../../styles.css";

export const SearchDrawer = ({
  triggerSearch,
  setSearchString,
  resetPageToZero,
  setDrawerOpen,
  drawerOpen,
}: SearchProps & { drawerOpen: boolean }) => {
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
        <Box className="SearchBox">
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
