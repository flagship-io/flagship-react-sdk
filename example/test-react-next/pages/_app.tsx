import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  FlagshipProvider,
  VisitorData,
} from "@flagship.io/react-sdk";
import { ENV_ID, API_KEY } from "../config";
import React, { Dispatch, SetStateAction, useState } from "react";

interface IAppContext {
  visitorData: VisitorData|null;
  setVisitorData: Dispatch<SetStateAction<VisitorData|null>>;
}
const initStat = {
  visitorData:null,
  setVisitorData: () => {},
};

export const appContext = React.createContext<IAppContext>(initStat);

let count = 0;

const loadingComponent = () => {
  return (
    <div className="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {

  const [visitorData, setVisitorData] = useState<VisitorData | null>(pageProps.visitorData);

  return (
      <appContext.Provider
        value={{visitorData, setVisitorData }}
      >
      <FlagshipProvider
        // decisionMode={ DecisionMode.BUCKETING }
        visitorData={visitorData}
        initialFlagsData={pageProps.initialFlagsData}
        // fetchNow={false}
        envId={ENV_ID}
        apiKey={API_KEY}
      >
        <Component {...pageProps} />
      </FlagshipProvider>
      </appContext.Provider>
  );
}

export default MyApp;
