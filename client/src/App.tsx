import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

const BASEURL = "http://localhost:8000"; // Adjust to port where backend is running
const defaultRoute = `${BASEURL}/`;

function App() {
  const [helloString, setHelloString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(defaultRoute, {});
      setHelloString(result.data.message);
    };
    fetchData().catch((e) => console.error(e));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Server says :</p>
        <p style={{ color: "green" }}>"{helloString}"</p>
      </header>
    </div>
  );
}

export default App;
