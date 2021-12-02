import { primitive, DecisionMode } from "@flagship.io/js-sdk";
import { Dispatch, SetStateAction } from "react";

export interface IVisitorData {
    id: string;
    context?: Record<string, primitive>;
    isAuthenticated?: boolean;
    hasConsented?: boolean;
  }
  
  export type AppState = {
    visitorData: IVisitorData;
    envId: string;
    apiKey: string;
    timeout: number;
    pollingInterval: number;
    decisionMode: DecisionMode;
  };
  
  export type AppContext = {
    appState: AppState;
    setAppState: Dispatch<SetStateAction<AppState>>;
  };