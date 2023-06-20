import { useState } from "react";
import { ServiceTable } from "./components/results/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menubar/MenuBar";
import { Box } from "@mui/material";
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#007CC3",
      contrastText: "#000000",
    },
    secondary: {
      main: "#7FBDE1",
      contrastText: "#000000",
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

  const Footer = () => {
    return (
      <Box
        sx={{
          minHeight: "25px",
          backgroundColor: "#7FBDE1",

          color: "white",
          textAlign: "center",
        }}
      >
        © 2023 GeoHarvester | Ein Projekt in Zusammenarbeit mit dem Institut
        Geomatik, FHNW und swisstopo
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <section>
        <header className="appheader">
          <MenuBar
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
        </header>
        <ServiceTable
          docs={items || []}
          fields={[]}
          total={total}
          offset={offset}
          currentApiPage={currentApiPage}
          setOffset={setOffset}
          setRowsPerPage={setSize}
          rowsPerPage={size}
          responseState={responseState}
          triggerSearch={triggerSearch}
          searchStringState={searchStringState}
          providerState={providerState}
          servicetypeState={servicetypeState}
          page={page}
          setPage={setPage}
        />
        <Footer />
      </section>
    </ThemeProvider>
  );
}

export default App;
