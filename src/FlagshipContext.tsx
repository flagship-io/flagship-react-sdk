'use client'
import { createContext } from 'react'

import type { FsContext, FsContextState } from './type'

export const initStat: FsContextState = {
  isInitializing: true
}

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat }
})
