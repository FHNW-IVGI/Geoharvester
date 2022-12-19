import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const BASEURL = "http://localhost:8000"; // Adjust to port where backend is running
const defaultRoute = `${BASEURL}/`;

function App() {
  const [helloString, setHelloString] = useState("not connected");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(defaultRoute, {});
      const { message } = result.data;
      setHelloString(message ? message : "error");
    };
    fetchData().catch((e) => console.error(e));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Server says:</p>
        <p style={{ color: "green" }}>"{helloString}"</p>
      </header>
    </div>
  );
}

export default App;
