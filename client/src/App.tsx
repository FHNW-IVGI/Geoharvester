import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { ResultArea, StatisticsBox } from "./components/results/ResultArea";
<<<<<<< HEAD
=======
import { getServerStatus } from "./requests";
>>>>>>> 35991c4 (Adjustment with main branch)
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MenuBar } from "./components/menu/MenuBar";
import { Geoservice } from "./types";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      // main: "#ED7D31",
      main: "#ffbe92",
      // main: "#e69138",
      contrastText: "#000000",
    },
    secondary: {
      // main: "#ED7D31",
      // main: "#ffbe92",
      main: "#e69138",
      contrastText: "#000000",
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 35991c4 (Adjustment with main branch)
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

<<<<<<< HEAD
=======
  const checkServerStatus = () =>
    getServerStatus()
      .then((res) => {
        setStatusString(res ? res : "error");
      })
      .catch((e) => console.error(e));

  useEffect(() => {
    checkServerStatus();
  }, []);

>>>>>>> 35991c4 (Adjustment with main branch)
  const { docs, total, fields } = searchResult;

  return (
    <ThemeProvider theme={theme}>
<<<<<<< HEAD
      {/* <ThemeProvider theme={theme}> */}
      <header className="App-header">
        {/* NDGI Project Geoharvester */}
        <MenuBar />
=======
    {/* <ThemeProvider theme={theme}> */}
      <header className="App-header">
        {/* NDGI Project Geoharvester */}
        <MenuBar/>
>>>>>>> 35991c4 (Adjustment with main branch)
      </header>
      {/* <div>
      <FilterAltIcon variant="contained">Hello World</FilterAltIcon>
      </div> */}
      <main className="App-main">
        <SearchBar setSearchResult={setSearchResult} />
        <StatisticsBox total={total || 0}></StatisticsBox>
        <ResultArea docs={docs || [[]]} fields={fields}></ResultArea>
      </main>
<<<<<<< HEAD
=======
      <footer className="App-footer">
        <Footer status={statusString} checkServerStatus={checkServerStatus} />
      </footer>
>>>>>>> 35991c4 (Adjustment with main branch)
    </ThemeProvider>
  );
}

export default App;
