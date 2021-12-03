import { primitive, DecisionMode } from "@flagship.io/js-sdk";
import React, { Dispatch, SetStateAction } from "react";
import { featureFlagsAll } from "../constants/features";

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
    isSDKReady:boolean;
    featureFlags: typeof featureFlagsAll;
  };
  
  export type AppContext = {
    appState: AppState;
    setAppState: Dispatch<SetStateAction<AppState>>;
  };

  export type RouteItem ={
    path: string
    element: React.FC
     key: string
  }