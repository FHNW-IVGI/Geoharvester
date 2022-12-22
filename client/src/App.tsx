import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { SearchBar } from "./components/search/SearchBar";
import { Footer } from "./components/footer/Footer";

const BASEURL = "http://localhost:8000"; // Adjust to port where backend is running
const defaultRoute = `${BASEURL}/`;

function App() {
  const [statusString, setStatusString] = useState("not connected");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(defaultRoute, {});
      const { message } = result.data;
      setStatusString(message ? message : "error");
    };
    fetchData().catch((e) => console.error(e));
  }, []);

  return (
    <>
      <header className="App-header">NDGI Project Geoharvester</header>
      <main className="App-main">
        <SearchBar />
      </main>
      <footer className="App-footer">
        <Footer status={statusString} />
      </footer>
    </>
  );
}

export default App;
