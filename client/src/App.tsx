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
  DEFAULTPROVIDER,
  DEFAULTSERVICE,
  RESPONSESTATE,
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
  const [servicetypeState, setServiceState] = useState(DEFAULTSERVICE);
  const [providerState, setProviderState] = useState(DEFAULTPROVIDER);

  const triggerSearch = async (
    searchString: string | undefined,
    servicetype: string | undefined,
    provider: string | undefined,
    pageIndex: number = page
  ) => {
    // Fall back to state if an argument is not provided, then parse the default as empty string for the API where necessary
    const queryParameter =
      searchString === undefined ? searchStringState : searchString;

    const svc = servicetype === undefined ? servicetypeState : servicetype;
    const svcParameter = svc === DEFAULTSERVICE ? "" : svc;

    const prov = provider === undefined ? providerState : provider;
    const provParameter = prov === DEFAULTPROVIDER ? "" : prov;

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
