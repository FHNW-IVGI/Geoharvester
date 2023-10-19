import { Toolbar, AppBar } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { MenuComponent } from "./MenuComponent";
import { Filter } from "./Filter";
import { PROVIDERTYPE, SERVICE, BREAKPOINT } from "src/constants";
import { SearchField } from "./SearchField";
import geoharvesterLogo from "./logo.png";

import { useTheme } from "@mui/material/styles";
import "../../styles.css";
import { useViewport } from "src/custom/ViewportHook";

export type SearchBarProps = {
  triggerSearch: (
    searchString: string | undefined,
    servicetype: SERVICE | undefined,
    provider: PROVIDERTYPE | undefined,
    page: number
  ) => void;
  servicetypeState: SERVICE;
  setServiceState: (serviceState: SERVICE) => void;
  providerState: PROVIDERTYPE;
  setProviderState: (serviceState: PROVIDERTYPE) => void;
  setSearchString: (searchString: string) => void;
  resetPageToZero: () => void;
};

export const Header = ({
  triggerSearch,
  setServiceState,
  servicetypeState,
  setProviderState,
  providerState,
  setSearchString,
  resetPageToZero,
}: SearchBarProps) => {
  const theme = useTheme();
  const { width } = useViewport();

  const page = 0; // a For search triggered by Menubar we always want to start from the first pagination page.

  const handleChangeService = (event: SelectChangeEvent) => {
    setServiceState(event.target.value as SERVICE);
    triggerSearch(undefined, event.target.value as SERVICE, undefined, page);
  };

  const handleChangeProvider = (event: SelectChangeEvent) => {
    setProviderState(event.target.value as PROVIDERTYPE);
    triggerSearch(
      undefined,
      undefined,
      event.target.value as PROVIDERTYPE,
      page
    );
  };

  return (
    <AppBar sx={{ backgroundColor: theme.palette.secondary.main }}>
      <Toolbar sx={{ padding: 0 }}>
        <MenuComponent />
        <img
          id="GeoharvesterLogo"
          alt="GeoharvesterLogo"
          src={String(geoharvesterLogo)}
          width="242"
          height="29"
          style={{ marginLeft: -10 }}
        />
        {width < BREAKPOINT ? (
          <div>none</div>
        ) : (
          <SearchField
            {...{
              triggerSearch,
              setSearchString,
              resetPageToZero,
            }}
          />
        )}
        <Filter
          handleChangeService={handleChangeService}
          handleChangeProvider={handleChangeProvider}
          provider={providerState}
          servicetype={servicetypeState}
        />
      </Toolbar>
    </AppBar>
  );
};
