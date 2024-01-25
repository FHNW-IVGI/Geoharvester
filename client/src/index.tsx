import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { IntlProvider } from "react-intl";
import French from "./lang/fr.json";
import Italian from "./lang/it.json";
import English from "./lang/en.json";
import German from "./lang/ger.json";
import { LanguageProvider } from "./lang/LanguageContext";

const locale = navigator.language;
// const locale = navigator.language;

let lang;
if (locale === "en-US") {
  lang = English;
} else if (locale === "fr") {
  lang = French;
} else if (locale === "it") {
  lang = Italian;
} else {
  lang = German;
}

console.log(lang);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
