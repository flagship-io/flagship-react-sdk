"use client";
import { createContext } from "react";

import type { FsContext, FsContextState } from "./type";
import { FSSdkStatus } from "@flagship.io/js-sdk";

export const initStat: FsContextState = {
  isInitializing: true,
  sdkStatus: FSSdkStatus.SDK_NOT_INITIALIZED,
};

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat },
});
