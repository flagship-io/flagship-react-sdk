'use client'
import { useCallback, useContext, useMemo } from 'react'

import {
  Flagship,
  IFSFlag,
  IHit,
  primitive,
  FSFlagCollection,
  Visitor,
  IFlagshipConfig
} from '@flagship.io/js-sdk'

import { noVisitorMessage } from './constants'
import { FlagshipContext } from './FlagshipContext'
import { FSFlag } from './FSFlag'
import { UseFlagshipOutput } from './type'
import { deepClone, hasContextChanged, logError, logWarn } from './utils'

/**
 * This hook returns a flag object by its key. If no flag match the given key an empty flag will be returned.
 * @param key
 * @param defaultValue
 * @returns
 */
export const useFsFlag = (
  key: string
): IFSFlag => {
  const { state } = useContext(FlagshipContext)
  const { visitor } = state

  if (!visitor) {
    return new FSFlag(key, state)
  }

  return visitor.getFlag(key)
}

const handleContextChange = (param:{
  updateFunction: () => void, functionName: string,
  visitor?:Visitor, config?:IFlagshipConfig}): void => {
  const { updateFunction, functionName, visitor, config } = param
  if (!visitor) {
    logError(config, noVisitorMessage, functionName)
    return
  }
  const originalContextClone = deepClone(visitor.context)

  updateFunction()

  const updatedContext = visitor.context
  if (hasContextChanged(originalContextClone, updatedContext)) {
    visitor.fetchFlags()
  }
}

export const useFlagship = (): UseFlagshipOutput => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state

  const fsUpdateContext = useCallback((context: Record<string, primitive>): void => {
    handleContextChange({
      config,
      visitor,
      updateFunction: () => visitor?.updateContext(context),
      functionName: 'updateContext'
    })
  }, [visitor])

  const fsClearContext = useCallback((): void => {
    handleContextChange({
      config,
      visitor,
      updateFunction: () => visitor?.clearContext(),
      functionName: 'cleanContext'
    })
  }, [visitor])

  const fsAuthenticate = useCallback((visitorId: string): void => {
    const functionName = 'authenticate'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    const originalVisitorId = visitor.visitorId
    visitor.authenticate(visitorId)
    if (originalVisitorId !== visitorId) {
      visitor.fetchFlags()
    }
  }, [visitor])

  const fsUnauthenticate = useCallback((): void => {
    const functionName = 'unauthenticate'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    const originalVisitorId = visitor.visitorId
    visitor.unauthenticate()
    if (originalVisitorId !== visitor.visitorId) {
      visitor.fetchFlags()
    }
  }, [visitor])

  const fsSendHit = useCallback((hit: IHit[] | IHit): Promise<void> => {
    const functionName = 'sendHit'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    if (Array.isArray(hit)) {
      return visitor.sendHits(hit)
    }
    return visitor.sendHit(hit)
  }, [visitor])

  const getFlag = useCallback((key: string): IFSFlag => {
    if (!visitor) {
      return new FSFlag(key, state)
    }
    return visitor.getFlag(key)
  }, [visitor])

  const fetchFlags = useCallback(async (): Promise<void> => {
    if (!visitor) {
      logWarn(config, noVisitorMessage, 'fetchFlags')
      return Promise.resolve()
    }
    return visitor.fetchFlags()
  }, [visitor])

  const setConsent = useCallback((hasConsented: boolean): void => {
    if (!visitor) {
      logWarn(config, noVisitorMessage, 'setConsent')
      return
    }
    visitor.setConsent(hasConsented)
  }, [visitor])

  const close = useCallback((): Promise<void> => {
    return Flagship.close()
  }, [])

  const getFlags = useCallback(() => {
    if (!visitor) {
      const flags = new Map<string, IFSFlag>()
      state.flags?.forEach((flag, key) => {
        flags.set(key, new FSFlag(key, state))
      })
      return new FSFlagCollection({ flags })
    }
    return visitor.getFlags()
  }, [visitor])

  const collectEAIEventsAsync = useCallback(async (...args: unknown[]): Promise<void> => {
    if (!visitor) {
      return
    }
    return visitor.collectEAIEventsAsync(...args)
  }, [visitor])

  return useMemo(() => ({
    visitorId: visitor?.visitorId,
    anonymousId: visitor?.anonymousId,
    context: { ...visitor?.context },
    hasConsented: visitor?.hasConsented,
    sdkStatus: Flagship.getStatus(),
    flagsStatus: visitor?.flagsStatus,
    setConsent,
    updateContext: fsUpdateContext,
    clearContext: fsClearContext,
    authenticate: fsAuthenticate,
    unauthenticate: fsUnauthenticate,
    sendHits: fsSendHit,
    getFlag,
    fetchFlags,
    close,
    getFlags,
    collectEAIEventsAsync

  }), [visitor, setConsent,
    fsUpdateContext,
    fsClearContext, fsAuthenticate, fsUnauthenticate,
    fsSendHit, getFlag, fetchFlags, close,
    getFlags,
    collectEAIEventsAsync])
}
