'use client'
import { useContext } from 'react'

import {
  Flagship,
  IFlag,
  IHit,
  primitive
} from '@flagship.io/js-sdk'

import { noVisitorMessage } from './constants'
import { Flag } from './Flag'
import { FlagshipContext } from './FlagshipContext'
import { UseFlagshipOutput } from './type'
import { logError, logWarn } from './utils'

/**
 * This hook returns a flag object by its key. If no flag match the given key an empty flag will be returned.
 * @param key
 * @param defaultValue
 * @returns
 */
export const useFsFlag = <T>(
  key: string,
  defaultValue: T
): IFlag<T> => {
  const { state } = useContext(FlagshipContext)
  const { visitor } = state

  if (!visitor) {
    return new Flag(defaultValue, key, state.flags)
  }

  return visitor.getFlag(key, defaultValue)
}

export const useFlagship = (): UseFlagshipOutput => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state

  const fsUpdateContext = (context: Record<string, primitive>): void => {
    const functionName = 'updateContext'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.updateContext(context)
    visitor.fetchFlags()
  }

  const fsClearContext = (): void => {
    const functionName = 'cleanContext'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.clearContext()
  }

  const fsAuthenticate = (visitorId: string): void => {
    const functionName = 'authenticate'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.authenticate(visitorId)
    visitor.fetchFlags()
  }

  const fsUnauthenticate = (): void => {
    const functionName = 'unauthenticate'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.unauthenticate()
    visitor.fetchFlags()
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

  function getFlag<T> (key: string, defaultValue: T): IFlag<T> {
    if (!visitor) {
      return new Flag(defaultValue, key, state.flags)
    }
    return visitor.getFlag(key, defaultValue)
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

  let flagsData = visitor?.getFlagsDataArray()
  if (state.flags) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flagsData = Array.from(state.flags, ([_key, item]) => item)
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
    flagsData: flagsData || [],
    sendHits: fsSendHit,
    getFlag,
    fetchFlags,
    close
  }
}
