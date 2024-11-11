'use client'
import { useContext } from 'react'

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

  const fsUpdateContext = (context: Record<string, primitive>): void => {
    handleContextChange({
      config,
      visitor,
      updateFunction: () => visitor?.updateContext(context),
      functionName: 'updateContext'
    })
  }

  const fsClearContext = (): void => {
    handleContextChange({
      config,
      visitor,
      updateFunction: () => visitor?.clearContext(),
      functionName: 'cleanContext'
    })
  }

  const fsAuthenticate = (visitorId: string): void => {
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
  }

  const fsUnauthenticate = (): void => {
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
  }

  /**
   * Send a Hit to Flagship servers for reporting.
   */
  const fsSendHit: {
    (hit: IHit[] | IHit): Promise<void>;
  } = (hit) => {
    const functionName = 'sendHit'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    if (Array.isArray(hit)) {
      return visitor.sendHits(hit)
    }
    return visitor.sendHit(hit)
  }

  function getFlag (key: string): IFSFlag {
    if (!visitor) {
      return new FSFlag(key, state)
    }
    return visitor.getFlag(key)
  }

  function fetchFlags (): Promise<void> {
    if (!visitor) {
      logWarn(config, noVisitorMessage, 'fetchFlags')
      return Promise.resolve()
    }
    return visitor.fetchFlags()
  }

  function setConsent (hasConsented: boolean): void {
    if (!visitor) {
      logWarn(config, noVisitorMessage, 'setConsent')
      return
    }
    visitor.setConsent(hasConsented)
  }

  async function close ():Promise<void> {
    await Flagship.close()
  }

  function getFlags () {
    if (!visitor) {
      const flags = new Map<string, IFSFlag>()
      state.flags?.forEach((flag, key) => {
        flags.set(key, new FSFlag(key, state))
      })
      return new FSFlagCollection({ flags })
    }
    return visitor.getFlags()
  }

  function collectEAIData (): void {
    if (!visitor) {
      return
    }
    return visitor.collectEAIData()
  }

  return {
    visitorId: visitor?.visitorId,
    anonymousId: visitor?.anonymousId,
    context: { ...visitor?.context },
    hasConsented: visitor?.hasConsented,
    sdkStatus: Flagship.getStatus(),
    fetchStatus: visitor?.fetchStatus,
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
    collectEAIData
  }
}
