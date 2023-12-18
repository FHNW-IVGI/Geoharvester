import { useEffect, useState } from "react";
import { ServiceTable } from "./components/table/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Header } from "./components/menubar/Header";
import { Geoservice, SearchParameters } from "./types";
import {
  DEFAULTLANGUAGE,
  PROVIDER,
  RESPONSESTATE,
  SERVICE,
  DEFAULTROWSPERPAGE,
  DEFAULTCHUNKSIZE,
} from "./constants";
import { getData } from "./requests";
import { Footer } from "./components/Footer";
import { Stack } from "@mui/material";
import { FirstSearchUI } from "./components/table/FirstSearchUI";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007CC3",
      light: "#7FBDE1",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",

      contrastText: "#007CC3",
    },
    info: {
      main: "#E8E8E8",
      light: "#C0C0C0",
      contrastText: "#ffffff",
    },
  },
});

export type SearchResult = {
  page: number;
  pages: number;
  total: number;
  size: number; // Items per page
  items: Geoservice[];
};

function App() {
  const [searchResult, setSearchResult] = useState({} as SearchResult);
  const [responseState, setResponseState] = useState(
    RESPONSESTATE.UNINITIALIZED
  );

  const [tablePage, setTablePage] = useState<number>(0); // Needed for the table UI and to dertermine when to make an API call
  const [currentApiPage, setCurrentApiPage] = useState(0); // Page of the paginated API, different than the UI table page.
  const [size, setSize] = useState(DEFAULTROWSPERPAGE);

  const defaultSearchParameter = {
    searchString: undefined, // Using an empty string would cause useEffect diffing to fail when searching without text
    service: SERVICE.NONE,
    provider: PROVIDER.NONE,
    page: 0,
  };

  const [searchParameters, setSearchParameters] = useState<SearchParameters>(
    defaultSearchParameter
  );
  const { items, total } = searchResult;

  const updateSearchParameters = (parameter: Partial<SearchParameters>) => {
    responseState === RESPONSESTATE.UNINITIALIZED &&
      setResponseState(RESPONSESTATE.WAITING);
    setSearchParameters({ ...searchParameters, ...parameter });
  };

  useEffect(() => {
    responseState !== RESPONSESTATE.UNINITIALIZED && triggerSearch();
  }, [
    searchParameters.searchString,
    searchParameters.provider,
    searchParameters.service,
    searchParameters.page,
  ]);

  const triggerSearch = async () => {
    const { searchString, service, provider, page } = searchParameters;

    setResponseState(RESPONSESTATE.WAITING);

    await getData(
      searchString as string,
      service,
      provider,
      DEFAULTLANGUAGE,
      page,
      DEFAULTCHUNKSIZE
    )
      .then((res) => {
        const { data } = res;
        if (data.items.length > 0) {
          setResponseState(RESPONSESTATE.SUCCESS);
          setSearchResult(data);
          setCurrentApiPage(data.page);
        } else {
          setResponseState(RESPONSESTATE.EMPTY);
          setSearchResult({} as SearchResult); // Fallback on error
        }
      })
      .catch((e) => {
        console.error(e);
        setResponseState(RESPONSESTATE.ERROR);
        setSearchResult({} as SearchResult); // Fallback on error
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack sx={{ height: "100vh" }}>
        <Header
          {...{
            updateSearchParameters,
            searchParameters,
            responseState,
          }}
        />
        {responseState === RESPONSESTATE.UNINITIALIZED ? (
          <FirstSearchUI
            setDrawerOpen={() => false}
            fromDrawer={false}
            {...{
              updateSearchParameters,
              triggerSearch,
            }}
          />
        ) : (
          <ServiceTable
            docs={items || []}
            rowsPerPage={size}
            setRowsPerPage={setSize}
            {...{
              updateSearchParameters,
              searchParameters,
              responseState,
              total,
              currentApiPage,
            }}
            tablePage={tablePage}
            setTablePage={setTablePage}
          />
        )}
        <Footer />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
