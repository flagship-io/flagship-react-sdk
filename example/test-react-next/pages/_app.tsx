import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  FlagshipProvider,
  DecisionMode,
  VisitorData,
} from "@flagship.io/react-sdk";
import { ENV_ID, API_KEY } from "../config";
import React, { Dispatch, SetStateAction, useState } from "react";

interface IAppContext {
  visitorData: VisitorData;
  setVisitorData: Dispatch<SetStateAction<VisitorData>>;
}
const initStat = {
  visitorData: {
    id: "",
    context: {
      age: 20,
      cacheEnabled: true,
    },
  },
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
  console.log("pageProps", pageProps);

  const onClick = () => {
    count++;
    console.log("count", count);

    if (count === 5 || count === 7) {
      setVisitorData({});
      return;
    }

    setVisitorData((prev) => ({
      ...prev,
      id: "today_my_visitor_" + count,
      context: {
        age: 20,
        cacheEnabled: true,
      },
    }));
  };
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);

  console.log("visitorData", visitorData);

  return (
    <div>
      <FlagshipProvider
        // decisionMode={ DecisionMode.BUCKETING }
        visitorData={visitorData}
        // initialCampaigns={pageProps.campaigns}
        // initialModifications={pageProps.initialModifications}
        loadingComponent={loadingComponent()}
        // disableCache={true}
        fetchNow={false}
        pollingInterval={10}
        envId={ENV_ID}
        timeout={5}
        apiKey={API_KEY}
      >
        <Component {...pageProps} />
      </FlagshipProvider>
      <div>
        <button
          style={{ width: 100, height: 50 }}
          value={"click me"}
          onClick={() => {
            onClick();
          }}
        ></button>
      </div>
    </div>
  );
}

export default MyApp;
