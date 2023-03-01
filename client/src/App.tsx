import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { ResultArea, StatisticsBox } from "./components/results/ResultArea";
import { getServerStatus } from "./requests";
import { Geoservice } from "./types";
import "./App.css";

export type SearchResult = {
  duration: number;
  total: number;
  docs: Geoservice[];
  fields: string[];
};

function App() {
  const [statusString, setStatusString] = useState("not connected");
  const [searchResult, setSearchResult] = useState({} as SearchResult);

  const checkServerStatus = () =>
    getServerStatus()
      .then((res) => {
        setStatusString(res ? res : "error");
      })
      .catch((e) => console.error(e));

  useEffect(() => {
    checkServerStatus();
  }, []);

  const { docs, total, fields } = searchResult;

  return (
    <>
      <header className="App-header">NDGI Project Geoharvester</header>
      <main className="App-main">
        <SearchBar setSearchResult={setSearchResult} />
        <StatisticsBox total={total || 0}></StatisticsBox>
        <ResultArea docs={docs || [[]]} headers={fields}></ResultArea>
      </main>
    </>
  );
}

export default App;
