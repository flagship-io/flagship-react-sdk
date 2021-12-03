import React, { useState } from "react";
import "./assets/scss/app.scss";
import {
  DecisionMode,
  FlagshipProvider,
  FlagshipStatus,
} from "@flagship.io/react-sdk";
import { AppContext, AppState } from "./@types/types";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/Header";
import { featureFlagsAll } from "./constants/features";

const initStat: AppState = {
  visitorData: {
    id: "",
    context: {},
    hasConsented: false,
  },
  envId: "",
  apiKey: "",
  timeout: 2,
  pollingInterval: 2,
  decisionMode: DecisionMode.DECISION_API,
  isSDKReady: false,
  featureFlags: featureFlagsAll,
};

export const appContext = React.createContext<AppContext>({
  appState: { ...initStat },
  setAppState: () => {
    //
  },
});

function App() {
  const [appState, setAppState] = useState<AppState>({ ...initStat });
  return (
    <appContext.Provider value={{ appState, setAppState }}>
      <FlagshipProvider
        decisionMode={appState.decisionMode}
        visitorData={appState.visitorData}
        pollingInterval={appState.pollingInterval}
        envId={appState.envId}
        timeout={appState.timeout}
        apiKey={appState.apiKey}
        fetchNow={false}
        statusChangedCallback={(status) => {
          setAppState((prev) => ({
            ...prev,
            isSDKReady: status === FlagshipStatus.READY,
          }));
        }}
      >
        <BrowserRouter>
          <Header technology={""} environment={""} branch={""} />
          <div className={"container mt-5 mb-5"}>
            <AppRoutes />
          </div>
        </BrowserRouter>
      </FlagshipProvider>
    </appContext.Provider>
  );
}

export default App;
