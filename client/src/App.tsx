import { useState } from "react";
import { ServiceTable } from "./components/results/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menubar/MenuBar";
import { Box } from "@mui/material";
import { Geoservice } from "./types";
import {
  DEFAULTLANGUAGE,
  DEFAULTLIMIT,
  DEFAULTOFFSET,
  DEFAULTPAGE,
  PROVIDERTYPE,
  RESPONSESTATE,
  SERVICETYPE,
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
  size: number;
  items: Geoservice[];
};

function App() {
  const [searchResult, setSearchResult] = useState({} as SearchResult);
  const [responseState, setResponseState] = useState(
    RESPONSESTATE.UNINITIALIZED
  );
  const { items, total } = searchResult;
  const [placeholderText, setPlaceholderText] = useState(
    "Webservice suchen..."
  );
  const [page, setPage] = useState(DEFAULTPAGE);
  const [size, setSize] = useState(50);
  const [offset, setOffset] = useState(DEFAULTOFFSET);
  const [limit, setLimit] = useState(DEFAULTLIMIT);
  const [language, setLanguage] = useState(DEFAULTLANGUAGE);
  const [searchStringState, setSearchString] = useState("");
  const [servicetypeState, setServiceState] = useState<SERVICETYPE>(
    SERVICETYPE.NONE
  );
  const [providerState, setProviderState] = useState<PROVIDERTYPE>(
    PROVIDERTYPE.NONE
  );

  const triggerSearch = async (
    searchString: string | undefined,
    servicetype: SERVICETYPE | undefined,
    provider: PROVIDERTYPE | undefined,
    pageIndex: number = page
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
      offset,
      limit,
      pageIndex,
      size
    )
      .then((res) => {
        const { data } = res;
        console.log(data);
        if (data.items.length > 0) {
          setResponseState(RESPONSESTATE.SUCCESS);
          setSearchResult(data);
          setPage(DEFAULTPAGE);
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
            }}
          />
        </header>
        <ServiceTable
          docs={items || []}
          fields={[]}
          total={total}
          placeholderText={placeholderText}
          page={page}
          setPage={setPage}
          setOffset={setOffset}
          setLimit={setLimit}
          setRowsPerPage={setSize}
          rowsPerPage={size}
          responseState={responseState}
          triggerSearch={triggerSearch}
          searchStringState={searchStringState}
          providerState={providerState}
          servicetypeState={servicetypeState}
        />
        <Footer />
      </section>
    </ThemeProvider>
  );
}

export default App;
