import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { SearchField, SearchProps } from "./SearchField";
import "../../styles.css";

export const SearchDrawer = ({
  updateSearchParameters,
  setDrawerOpen,
  drawerOpen,
}: SearchProps & { drawerOpen: boolean }) => {
  return (
    <div>
      <Button variant="contained" onClick={() => setDrawerOpen(true)}>
        Suche
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box
          className="SearchBox"
          sx={{ height: 72, backgroundColor: "#f0f0f0" }}
        >
          <SearchField
            fromDrawer
            {...{
              updateSearchParameters,
              setDrawerOpen,
            }}
          />
        </Box>
      </SwipeableDrawer>
    </div>
  );
};
