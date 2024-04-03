'use client'
import { createContext } from 'react'

import { FsContext, FsContextState } from './type'

export const initStat: FsContextState = {
  isInitializing: true
}

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat }
})
