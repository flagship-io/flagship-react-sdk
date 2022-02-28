import { primitive, DecisionMode, VisitorData } from "@flagship.io/react-sdk";
import React, { Dispatch, SetStateAction } from "react";
import { featureFlagsAll } from "../constants/features";


  
  export type AppState = {
    visitorData: VisitorData|null;
    envId: string;
    apiKey: string;
    timeout: number;
    pollingInterval: number;
    decisionMode: DecisionMode;
    isSDKReady:boolean;
    hasVisitor:boolean
    featureFlags: typeof featureFlagsAll;
    logs:string
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