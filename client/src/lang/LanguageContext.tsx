import { useState, createContext } from "react";
import { IntlProvider } from "react-intl";
import French from "../lang/fr.json";
import Italian from "../lang/it.json";
import English from "../lang/en.json";
import German from "../lang/ger.json";

enum LANGUAGE {
  EN = "en",
  DE = "de",
  FR = "fr",
  IT = "it",
}

type LanguageContextType = {
  setLanguage: (language: string) => void;
  language: string;
};

type GenericOpbject = { [key: string]: string };

export const LanguageContext = createContext<LanguageContextType>({
  setLanguage: () => {},
  language: "LANGUAGE.DE",
});

type Props = { children: React.ReactElement | React.ReactElement[] };

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguageState] = useState<string>("de");
  const [messages, setMessages] = useState<GenericOpbject>(French);

  const setLanguage = (lang: string) => {
    console.log(lang);
    // console.log(messages);
    if (lang === "fr") {
      setLanguageState("fr");
      setMessages(French);
      console.log("-fr");
    }
    if (lang === "it") {
      setLanguageState("it");
      setMessages(Italian);
      console.log("-it");
    }
    if (lang === "en") {
      setLanguageState("en");
      setMessages(English);
      console.log("-en");
    }
    if (lang === "de") {
      setLanguageState("de");
      setMessages(German);
      console.log("-de");
    }
  };

  return (
    <LanguageContext.Provider value={{ setLanguage, language }}>
      <IntlProvider locale={language} messages={messages} defaultLocale="de">
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
