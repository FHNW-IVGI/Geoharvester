import { AppBar } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MenuComponent } from "./MenuComponent";
import { Filter } from "./Filter";
import {
  PROVIDER,
  SERVICE,
  BREAKPOINT600,
  BREAKPOINT1000,
  RESPONSESTATE,
} from "src/constants";
import { SearchField } from "./SearchField";
import { useTheme } from "@mui/material/styles";
import { useViewport } from "src/custom/ViewportHook";
import { SearchDrawer } from "./SearchDrawer";
import { useState } from "react";
import "../../styles.css";
import { SearchParameters } from "src/types";

export type SearchBarProps = {
  updateSearchParameters: (parameter: Partial<SearchParameters>) => void;
  searchParameters: SearchParameters;
  // resetPageToZero: () => void;
  responseState: RESPONSESTATE;
};

export const Header = ({
  updateSearchParameters,
  searchParameters,
  // resetPageToZero,
  responseState,
}: SearchBarProps) => {
  const theme = useTheme();
  const { width } = useViewport();
  // const page = 0; // a For search triggered by Menubar we always want to start from the first pagination page.
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChangeService = (event: SelectChangeEvent) => {
    updateSearchParameters({ service: event.target.value as SERVICE, page: 0 });
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    updateSearchParameters({
      provider: event.target.value as PROVIDER,
      page: 0,
    });
  };
  return (
    <AppBar
      sx={{
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: 50,
        }}
      >
        <MenuComponent />
        {responseState === RESPONSESTATE.UNINITIALIZED ? (
          <div />
        ) : width > BREAKPOINT1000 ? (
          <SearchField
            fromDrawer={false}
            {...{
              updateSearchParameters,
              // resetPageToZero,
              setDrawerOpen,
            }}
          />
        ) : (
          <SearchDrawer
            {...{
              updateSearchParameters,
              // resetPageToZero,
              setDrawerOpen,
            }}
            drawerOpen={drawerOpen}
          />
        )}
        <Filter
          handleChangeService={handleChangeService}
          handleChangeProvider={handleChangeProvider}
          searchParameters={searchParameters}
        />
      </div>
    </AppBar>
  );
};
