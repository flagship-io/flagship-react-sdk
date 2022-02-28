import React, { useState } from "react";
import "./assets/scss/app.scss";
import {
  DecisionMode,
  FlagshipProvider,
  FlagshipStatus,
  IFlagshipLogManager,
  LogLevel,
} from "@flagship.io/react-sdk";
import { AppContext, AppState } from "./@types/types";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/Header";
import { V3 } from "./constants/features";




const initStat: AppState = {
  visitorData: null,
  envId: "",
  apiKey: "",
  timeout: 2,
  pollingInterval: 2,
  decisionMode: DecisionMode.DECISION_API,
  isSDKReady: false,
  hasVisitor: false,
  featureFlags: V3,
  logs:""
};

export const appContext = React.createContext<AppContext>({
  appState: { ...initStat },
  setAppState: () => {
    //
  },
});

export const globalLogs={
  logs:""
}

function App() {
  const [appState, setAppState] = useState<AppState>({ ...initStat });
  const customLogManager:IFlagshipLogManager ={
    emergency (message: string, tag: string): void {
      this.log(LogLevel.EMERGENCY, message, tag)
    },
  
    alert (message: string, tag: string): void {
      this.log(LogLevel.ALERT, message, tag)
    },
  
    critical (message: string, tag: string): void {
      this.log(LogLevel.CRITICAL, message, tag)
    },
  
    error (message: string, tag: string): void {
      this.log(LogLevel.ERROR, message, tag)
    },
  
    warning (message: string, tag: string): void {
      this.log(LogLevel.WARNING, message, tag)
    },
  
    notice (message: string, tag: string): void {
      this.log(LogLevel.NOTICE, message, tag)
    },
  
    info (message: string, tag: string): void {
      this.log(LogLevel.INFO, message, tag)
    },
  
    debug (message: string, tag: string): void {
      this.log(LogLevel.DEBUG, message, tag)
    },
    log: function (level: LogLevel, message: string, tag: string): void {
      const now = new Date()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getTwoDigit = (value: any) => {
        return value.toString().length === 1 ? `0${value}` : value
      }
  
      const out = `[${getTwoDigit(now.getFullYear())}-${
        getTwoDigit(
          now.getMonth()
        )
      }-${getTwoDigit(now.getDay())} ${
        getTwoDigit(
          now.getHours()
        )
      }:${getTwoDigit(now.getMinutes())}] [Flagship SDK] [${
        LogLevel[level]
      }] [${tag}] : ${message}`
      globalLogs.logs += out + "\n"
    }
  } 
  return (
    <appContext.Provider value={{ appState, setAppState }}>
      <FlagshipProvider
        decisionMode={appState.decisionMode}
        visitorData={appState.visitorData}
        pollingInterval={appState.pollingInterval}
        envId={appState.envId}
        timeout={appState.timeout}
        apiKey={appState.apiKey}
        logManager={customLogManager}
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
