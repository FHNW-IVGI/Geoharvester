import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { Footer } from "./components/footer/Footer";
import { ResultArea, StatisticsBox } from "./components/results/ResultArea";
import { getServerStatus } from "./requests";
import "./App.css";

export type SearchResult = {
  statistics: {
    term: string;
    count: number;
  }[];
  layers: string[][];
};

function App() {
  const [statusString, setStatusString] = useState("not connected");
  const [searchResults, setSearchResults] = useState({} as SearchResult);

  const checkServerStatus = () =>
    getServerStatus()
      .then((res) => {
        setStatusString(res ? res : "error");
      })
      .catch((e) => console.error(e));

  useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <>
      <header className="App-header">NDGI Project Geoharvester</header>
      <main className="App-main">
        <SearchBar setSearchResults={setSearchResults} />
        <StatisticsBox stats={searchResults.statistics || []}></StatisticsBox>
        <ResultArea results={searchResults.layers || []}></ResultArea>
      </main>
      <footer className="App-footer">
        <Footer status={statusString} checkServerStatus={checkServerStatus} />
      </footer>
    </>
  );
}

export default App;
