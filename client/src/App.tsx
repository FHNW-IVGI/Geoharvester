import { useEffect, useState } from "react";
import { ServiceTable } from "./components/table/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Header } from "./components/menubar/Header";
import { Geoservice, SearchParameters } from "./types";
import {
  DEFAULTLANGUAGE,
  DEFAULTOFFSET,
  DEFAULTPAGE,
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
  console.log(responseState);
  const { items, total } = searchResult;

  const [currentApiPage, setCurrentApiPage] = useState(DEFAULTPAGE);
  const [size, setSize] = useState(DEFAULTROWSPERPAGE);
  const [offset, setOffset] = useState(DEFAULTOFFSET);

  const defaultSearchParameter = {
    searchString: "",
    service: SERVICE.NONE,
    provider: PROVIDER.NONE,
    page: 0,
  };

  const [searchParameters, setSearchParameters] = useState<SearchParameters>(
    defaultSearchParameter
  );

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

  const [page, setPage] = useState<number>(0);
  const resetPageToZero = () => setPage(0);

  const triggerSearch = async () => {
    const { searchString, service, provider } = searchParameters;

    setResponseState(RESPONSESTATE.WAITING);

    await getData(
      searchString,
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
            resetPageToZero,
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
              resetPageToZero,
            }}
          />
        ) : (
          <ServiceTable
            docs={items || []}
            fields={[]}
            rowsPerPage={size}
            setRowsPerPage={setSize}
            {...{
              updateSearchParameters,
              searchParameters,
              responseState,
              page,
              setPage,
              offset,
              setOffset,
              total,
              currentApiPage,
            }}
            page={page}
            setPage={setPage}
          />
        )}
        <Footer />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
