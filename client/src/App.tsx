import { useState } from "react";
import { ResultArea } from "./components/results/ResultArea";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menubar/MenuBar";
import { FilterFields } from "./components/menubar/FilterBar";
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
        <ResultArea
          docs={docs || []}
          fields={fields}
          total={total}
          placeholderText={placeholderText}
        ></ResultArea>
      </div>
    </ThemeProvider>
  );
}

export default App;
