import React, { useEffect, useState } from "react";
import { SearchBar } from "./components/search/SearchBar";
import { Footer } from "./components/footer/Footer";
import { ResultArea } from "./components/results/ResultArea";
import { getServerStatus } from "./requests";
import "./App.css";

function App() {
  const [statusString, setStatusString] = useState("not connected");
  const [searchResults, setSearchResults] = useState([]);

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
        <ResultArea results={searchResults}></ResultArea>
      </main>
      <footer className="App-footer">
        <Footer status={statusString} checkServerStatus={checkServerStatus} />
      </footer>
    </>
  );
}

export default App;
