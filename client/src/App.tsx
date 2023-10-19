import { useState } from "react";
import { ServiceTable } from "./components/results/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Header } from "./components/menubar/Header";
import { Geoservice } from "./types";
import {
  DEFAULTLANGUAGE,
  DEFAULTOFFSET,
  DEFAULTPAGE,
  PROVIDERTYPE,
  RESPONSESTATE,
  SERVICE,
  DEFAULTROWSPERPAGE,
  DEFAULTCHUNKSIZE,
} from "./constants";
import { getData } from "./requests";
import { Footer } from "./components/Footer";
import { Box, Container, Stack } from "@mui/material";

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
  const { items, total } = searchResult;

  const [currentApiPage, setCurrentApiPage] = useState(DEFAULTPAGE);
  const [size, setSize] = useState(DEFAULTROWSPERPAGE);
  const [offset, setOffset] = useState(DEFAULTOFFSET);
  const [language, setLanguage] = useState(DEFAULTLANGUAGE);
  const [searchStringState, setSearchString] = useState("");
  const [servicetypeState, setServiceState] = useState<SERVICE>(SERVICE.NONE);
  const [providerState, setProviderState] = useState<PROVIDERTYPE>(
    PROVIDERTYPE.NONE
  );

  const [page, setPage] = useState<number>(0);
  const resetPageToZero = () => setPage(0);

  const triggerSearch = async (
    searchString: string | undefined,
    servicetype: SERVICE | undefined,
    provider: PROVIDERTYPE | undefined,
    page: number,
    offset?: number
  ) => {
    // Fall back to state if an argument is not provided
    const queryParameter =
      searchString === undefined ? searchStringState : searchString;

    const svcParameter =
      servicetype === undefined ? servicetypeState : servicetype;

    const provParameter = provider === undefined ? providerState : provider;

    setResponseState(RESPONSESTATE.WAITING);

    await getData(
      queryParameter,
      svcParameter,
      provParameter,
      language,
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
      <Stack>
        {/* <header className="appheader"> */}
        <Header
          {...{
            triggerSearch,
            setServiceState,
            servicetypeState,
            setProviderState,
            providerState,
            setSearchString,
            searchStringState,
            resetPageToZero,
          }}
        />
        {/* </header> */}
        <ServiceTable
          docs={items || []}
          fields={[]}
          rowsPerPage={size}
          setRowsPerPage={setSize}
          {...{
            responseState,
            triggerSearch,
            providerState,
            servicetypeState,
            page,
            setPage,
            offset,
            setOffset,
            total,
            currentApiPage,
            searchStringState,
          }}
          page={page}
          setPage={setPage}
        />
        <Footer />
      </Stack>
    </ThemeProvider>
  );
}

export default App;
