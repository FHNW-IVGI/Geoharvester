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
} from "./constants";

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
  const { items, total } = searchResult;
  const [placeholderText, setPlaceholderText] = useState(
    "Webservice suchen..."
  );
  const [page, setPage] = useState(DEFAULTPAGE);
  const [size, setSize] = useState(50);
  const [offset, setOffset] = useState(DEFAULTOFFSET);
  const [limit, setLimit] = useState(DEFAULTLIMIT);
  const [language, setLanguage] = useState(DEFAULTLANGUAGE);

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
            setSearchResult={setSearchResult}
            setPlaceholderText={setPlaceholderText}
            setPage={setPage}
            offset={offset}
            limit={limit}
            language={language}
            size={size}
            page={page}
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
        ></ServiceTable>
        <Footer />
      </section>
    </ThemeProvider>
  );
}

export default App;
