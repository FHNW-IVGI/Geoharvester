import { useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { ResultArea } from "./components/results/ResultArea";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menu/MenuBar";
import { Geoservice } from "./types";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffbe92",
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

  return (
    <ThemeProvider theme={theme}>
      <div id="wrapper">
        <header className="App-header">
          <MenuBar />
        </header>
        <SearchBar setSearchResult={setSearchResult} />
        <ResultArea
          docs={docs || []}
          fields={fields}
          total={total}
        ></ResultArea>
      </div>
    </ThemeProvider>
  );
}

export default App;
