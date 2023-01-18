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
  fields: string[];
};

function App() {
  const [statusString, setStatusString] = useState("not connected");
  const [searchResult, setSearchResult] = useState({} as SearchResult);

  console.log(searchResult);

  const checkServerStatus = () =>
    getServerStatus()
      .then((res) => {
        setStatusString(res ? res : "error");
      })
      .catch((e) => console.error(e));

  useEffect(() => {
    checkServerStatus();
  }, []);

  const { statistics, layers, fields } = searchResult;
  return (
    <>
      <header className="App-header">NDGI Project Geoharvester</header>
      <main className="App-main">
        <SearchBar setSearchResult={setSearchResult} />
        <StatisticsBox stats={statistics || []}></StatisticsBox>
        <ResultArea data={layers || [[]]} fields={fields || []}></ResultArea>
      </main>
      <footer className="App-footer">
        <Footer status={statusString} checkServerStatus={checkServerStatus} />
      </footer>
    </>
  );
}

export default App;
