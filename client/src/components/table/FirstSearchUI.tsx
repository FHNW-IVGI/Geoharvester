import { SearchField, SearchProps } from "../menubar/SearchField";
import Box from "@mui/material/Box";

import "../../styles.css";

export const FirstSearchUI = ({
  triggerSearch,
  setSearchString,
  resetPageToZero,
  setDrawerOpen,
  fromDrawer,
}: SearchProps & {
  fromDrawer: boolean;
  setDrawerOpen: (state: boolean) => void;
}) => {
  return (
    <div className="PageWrapper">
      <Box className="SearchBox" sx={{ width: 700 }}>
        <SearchField
          {...{
            triggerSearch,
            setSearchString,
            resetPageToZero,
            setDrawerOpen,
            fromDrawer,
          }}
        />
      </Box>
    </div>
  );
};
