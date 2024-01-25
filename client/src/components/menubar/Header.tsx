import { AppBar } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MenuComponent } from "./MenuComponent";
import { Filter } from "./Filter";
import {
  PROVIDER,
  SERVICE,
  BREAKPOINT1000,
  RESPONSESTATE,
} from "src/constants";
import { SearchField } from "./SearchField";
import { useTheme } from "@mui/material/styles";
import { useViewport } from "src/custom/ViewportHook";
import { SearchDrawer } from "./SearchDrawer";
import { useState } from "react";
import { SearchParameters } from "src/types";
import "../../styles.css";

export type SearchBarProps = {
  updateSearchParameters: (parameter: Partial<SearchParameters>) => void;
  searchParameters: SearchParameters;
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // const handleChangeService = (event: SelectChangeEvent) => {
  //   console.log(event.target.value);
  //   console.log(Object.values<string>(SERVICE).includes(event.target.value));
  //   Object.values<string>(SERVICE).includes(event.target.value)
  //     ? updateSearchParameters({
  //         service: event.target.value as SERVICE,
  //         page: 0,
  //       })
  //     : updateSearchParameters({ service: SERVICE.NONE as SERVICE, page: 0 });
  // };
  const handleChangeService = (event: SelectChangeEvent) => {
    updateSearchParameters({
      service: event.target.value as SERVICE,
      page: 0,
    });
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
              setDrawerOpen,
            }}
          />
        ) : (
          <SearchDrawer
            {...{
              updateSearchParameters,
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
