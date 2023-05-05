import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { ResultArea, StatisticsBox } from "./components/results/ResultArea";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menu/MenuBar";
import { FilterFields } from "./components/filter/FilterFields";
import { Geoservice } from "./types";
import "./App.css";
import { Stack, Divider } from "@mui/material";

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
  query: string[];
};


function App() {
  const [searchResult, setSearchResult] = useState({} as SearchResult);
  const [searchString, setSearchString] = useState("");
  const [filterResults, setFilterResults] = useState({} as SearchResult);
  const { docs, total, fields } = filterResults;

  return (
    <ThemeProvider theme={theme}>
      <header className="App-header">
        <MenuBar />
      </header>
      <main className="App-main">
        <SearchBar setSearchResult={setSearchResult} />
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>}>
          <StatisticsBox total={total || 0}></StatisticsBox>
          <FilterFields query={searchString} setFilterResults={setFilterResults} /> 
        </Stack>
        <ResultArea docs={docs || [[]]} fields={fields}></ResultArea>
      </main>
    </ThemeProvider>
  );
}

export default App;
