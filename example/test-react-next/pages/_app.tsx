import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import { Flagship, FlagshipProvider } from "@flagship.io/react-sdk";
import { ENV_ID, API_KEY } from "../config";
import React from "react";
import App from "next/app";

function MyApp({
  Component,
  pageProps,
  initialFlagsData,
  initialVisitorData,
}: AppProps) {
  return (
    <FlagshipProvider
      // decisionMode={ DecisionMode.BUCKETING }
      visitorData={initialVisitorData}
      initialFlagsData={initialFlagsData}
      // fetchNow={false}
      envId={ENV_ID}
      apiKey={API_KEY}
    >
      <Component {...pageProps} />
    </FlagshipProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  //Start the Flagship SDK
  const flagship = Flagship.start(ENV_ID, API_KEY, {
    fetchNow: false,
  });

  const initialVisitorData = {
    id: "my_visitor_id",
    context: {
      any: "value",
    },
  };

  // Create a new visitor
  const visitor = flagship?.newVisitor({
    visitorId: initialVisitorData.id,
    context: initialVisitorData.context,
  });

  //Fetch flags
  await visitor?.fetchFlags();

  // Pass data to the page via props
  return {
    ...appProps,
    initialFlagsData: visitor?.getFlagsDataArray(),
    initialVisitorData,
  };
};

export default MyApp;
