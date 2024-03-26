'use client'
import { createContext } from 'react'
import { FsContext, FsContextState } from './type'

export const initStat: FsContextState = {
  sdkState: { isLoading: true, isSdkReady: false }
}

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat }
})
