import { useState } from "react";
import { ServiceTable } from "./components/results/ServiceTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menubar/MenuBar";
import { Geoservice } from "./types";
import "./App.css";
import { Stack, Divider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffa05f",
      contrastText: "#000000",
    },
    secondary: {
      main: "#e69138",
      contrastText: "#000000",
    },
  },
});

export type SearchResult = {
  duration: number;
  total: number;
  docs: Geoservice[];
  fields: string[];
};

function App() {
  const [searchResult, setSearchResult] = useState({} as SearchResult);
  const { docs, total, fields } = searchResult;
  const [placeholderText, setPlaceholderText] = useState(
    "Webservice suchen..."
  );

  return (
    <ThemeProvider theme={theme}>
      <div id="wrapper">
        <header className="App-header">
          <MenuBar
            setSearchResult={setSearchResult}
            setPlaceholderText={setPlaceholderText}
          />
        </header>
        <ServiceTable
          docs={docs || []}
          fields={fields}
          total={total}
          placeholderText={placeholderText}
        ></ServiceTable>
      </div>
    </ThemeProvider>
  );
}

export default App;
