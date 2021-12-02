import React, { useState } from "react";
import "./App.css";
import { DecisionMode, FlagshipProvider } from "@flagship.io/react-sdk";
import { ENV_ID, API_KEY } from "./config";
import { AppContext, AppState } from "./@types/types";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Hits from "./pages/Hits";
import Log from "./pages/Log";

const initStat = {
  visitorData: {
    id: "",
  },
  envId: ENV_ID,
  apiKey: API_KEY,
  timeout: 5000,
  pollingInterval: 1000,
  decisionMode: DecisionMode.DECISION_API,
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
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="hits" element={<Hits />} />
          <Route path="*" element={<Log />} />
        </Routes>
      </FlagshipProvider>
    </appContext.Provider>
  );
}

export default App;
