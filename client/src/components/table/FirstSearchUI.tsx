import { SearchField, SearchProps } from "../menubar/SearchField";
import Box from "@mui/material/Box";
import "../../styles.css";

export const FirstSearchUI = ({
  updateSearchParameters,
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
            updateSearchParameters,
            setDrawerOpen,
            fromDrawer,
          }}
        />
      </Box>
    </div>
  );
};
