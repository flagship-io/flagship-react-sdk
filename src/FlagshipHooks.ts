'use client'
import { useCallback, useContext, useMemo } from 'react'

import {
  Flagship,
  type IFSFlag,
  type IHit,
  type primitive,
  FSFlagCollection,
  Visitor,
  type IFlagshipConfig
} from './deps'

import { noVisitorMessage } from './constants'
import { FlagshipContext } from './FlagshipContext'
import { FSFlag } from './FSFlag'
import type { UseFlagshipOutput } from './type'
import { deepClone, hasContextChanged, logError, logWarn } from './utils'
import { useLatestRef } from './hooks'

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

  const visitorRef = useLatestRef(visitor)
  const configRef = useLatestRef(config)
  const stateRef = useLatestRef(state)

  const visitorContext = useMemo(
    () => ({ ...visitor?.context }),
    [JSON.stringify(visitor?.context)]
  )

  const fsUpdateContext = useCallback((context: Record<string, primitive>): void => {
    handleContextChange({
      config: configRef.current,
      visitor: visitorRef.current,
      updateFunction: () => visitorRef.current?.updateContext(context),
      functionName: 'updateContext'
    })
  }, [])

  const fsClearContext = useCallback((): void => {
    handleContextChange({
      config: configRef.current,
      visitor: visitorRef.current,
      updateFunction: () => visitorRef.current?.clearContext(),
      functionName: 'cleanContext'
    })
  }, [])

  const fsAuthenticate = useCallback((visitorId: string): void => {
    const functionName = 'authenticate'
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      logError(configRef.current, noVisitorMessage, functionName)
      return
    }
    const originalVisitorId = currentVisitor.visitorId
    currentVisitor.authenticate(visitorId)
    if (originalVisitorId !== visitorId) {
      currentVisitor.fetchFlags()
    }
  }, [])

  const fsUnauthenticate = useCallback((): void => {
    const functionName = 'unauthenticate'
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      logError(configRef.current, noVisitorMessage, functionName)
      return
    }
    const originalVisitorId = currentVisitor.visitorId
    currentVisitor.unauthenticate()
    if (originalVisitorId !== currentVisitor.visitorId) {
      currentVisitor.fetchFlags()
    }
  }, [])

  const fsSendHit = useCallback((hit: IHit[] | IHit): Promise<void> => {
    const functionName = 'sendHit'
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      logError(configRef.current, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    if (Array.isArray(hit)) {
      return currentVisitor.sendHits(hit)
    }
    return currentVisitor.sendHit(hit)
  }, [])

  const getFlag = useCallback((key: string): IFSFlag => {
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      return new FSFlag(key, stateRef.current)
    }
    return currentVisitor.getFlag(key)
  }, [])

  const fetchFlags = useCallback(async (): Promise<void> => {
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      logWarn(configRef.current, noVisitorMessage, 'fetchFlags')
      return Promise.resolve()
    }
    return currentVisitor.fetchFlags()
  }, [])

  const setConsent = useCallback((hasConsented: boolean): void => {
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      logWarn(configRef.current, noVisitorMessage, 'setConsent')
      return
    }
    currentVisitor.setConsent(hasConsented)
  }, [])

  const close = useCallback((): Promise<void> => {
    return Flagship.close()
  }, [])

  const getFlags = useCallback(() => {
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      const flags = new Map<string, IFSFlag>()
      stateRef.current.flags?.forEach((flag, key) => {
        flags.set(key, new FSFlag(key, stateRef.current))
      })
      return new FSFlagCollection({ flags })
    }
    return currentVisitor.getFlags()
  }, [])

  const collectEAIEventsAsync = useCallback(async (...args: unknown[]): Promise<void> => {
    const currentVisitor = visitorRef.current
    if (!currentVisitor) {
      return
    }
    return currentVisitor.collectEAIEventsAsync(...args)
  }, [])

  return useMemo(() => ({
    visitorId: visitor?.visitorId,
    anonymousId: visitor?.anonymousId,
    context: visitorContext,
    hasConsented: visitor?.hasConsented,
    sdkStatus: state.sdkStatus,
    flagsStatus: state.flagsStatus,
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
  }), [
    visitor?.visitorId,
    visitor?.anonymousId,
    visitor?.hasConsented,
    visitorContext,
    state.sdkStatus,
    state.flagsStatus,
    setConsent,
    fsUpdateContext,
    fsClearContext,
    fsAuthenticate,
    fsUnauthenticate,
    fsSendHit,
    getFlag,
    fetchFlags,
    close,
    getFlags,
    collectEAIEventsAsync
  ])
}
