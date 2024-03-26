import { useContext } from 'react'
import {
  Flagship,
  FSSdkStatus,
  FetchFlagsStatus,
  FlagDTO,
  HitAbstract,
  IFlag,
  IHit,
  primitive
} from '@flagship.io/js-sdk'

import { FlagshipContext } from './FlagshipContext'
import { logError, logWarn } from './utils'
import { Flag } from './Flag'
import { noVisitorMessage } from './constants'
import { FsSdkState } from './type'

/**
 * This hook returns a flag object by its key. If no flag match the given key an empty flag will be returned.
 * @param key
 * @param defaultValue
 * @returns
 */
export const useFsFlag = <T extends unknown>(
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

/**
 * Represents the output of the `useFlagship` hook.
 */
export type UseFlagshipOutput = {
  /**
   * The visitor ID.
   */
  visitorId?: string;
  /**
   * The anonymous ID.
   */
  anonymousId?: string | null;
  /**
   * The visitor context.
   */
  context?: Record<string, primitive>;
  /**
   * Indicates whether the visitor has consented for protected data usage.
   */
  hasConsented?: boolean;
  /**
   * Sets whether the visitor has consented for protected data usage.
   * @param hasConsented - True if the visitor has consented, false otherwise.
   */
  setConsent: (hasConsented: boolean) => void;
  /**
   * The flags data.
   */
  flagsData: FlagDTO[];
  /**
   * The status of the Flagship SDK.
   */
  readonly sdkState: FsSdkState;

  readonly sdkStatus: FSSdkStatus;

  readonly fetchStatus?: FetchFlagsStatus
  /**
   * Updates the visitor context values, matching the given keys, used for targeting.
   * A new context value associated with this key will be created if there is no previous matching value.
   * Context keys must be strings, and value types must be one of the following: number, boolean, string.
   * @param context - A collection of keys and values.
   */
  updateContext(context: Record<string, primitive>): void;
  /**
   * Clears the actual visitor context.
   */
  clearContext(): void;
  /**
   * Authenticates an anonymous visitor.
   * @param visitorId - The visitor ID.
   */
  authenticate(visitorId: string): void;
  /**
   * Changes an authenticated visitor to an anonymous visitor.
   */
  unauthenticate(): void;
  /**
   * Sends a hit to the Flagship server.
   * @param hit - The hit to send.
   */
  hit: {
    send: {
      (hit: HitAbstract): Promise<void>;
      (hit: IHit): Promise<void>;
      (hit: HitAbstract | IHit): Promise<void>;
    };
    sendMultiple: {
      (hit: HitAbstract[]): Promise<void>;
      (hit: IHit[]): Promise<void>;
      (hit: HitAbstract[] | IHit[]): Promise<void>;
    };
  };
  /**
   * Retrieves a flag object by its key. If no flag matches the given key, an empty flag will be returned.
   * @param key - The flag key.
   * @param defaultValue - The default value.
   * @returns The flag object.
   */
  getFlag<T>(key: string, defaultValue: T): IFlag<T>;
  /**
   * Fetches the flags from the Flagship server.
   */
  fetchFlags: () => Promise<void>;
  /**
   * Batches and sends all hits that are in the pool before the application is closed.
   * @returns A promise that resolves when all hits are sent.
   */
  close(): Promise<void>;
};

export const useFlagship = (): UseFlagshipOutput => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state

  const fsUpdateContext = (context: Record<string, primitive>): void => {
    const functionName = 'updateContext'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.clearContext()
    visitor.updateContext(context)
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
  }

  const fsUnauthenticate = (): void => {
    const functionName = 'unauthenticate'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return
    }
    visitor.unauthenticate()
  }

  /**
   * Send a Hit to Flagship servers for reporting.
   */
  const fsSendHit: {
    (hit: HitAbstract | IHit): Promise<void>;
  } = (hit) => {
    const functionName = 'sendHit'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    return visitor.sendHit(hit)
  }

  /**
   * Send a Hit to Flagship servers for reporting.
   */
  const fsSendHits: {
    (hit: HitAbstract[] | IHit[]): Promise<void>;
  } = (hit) => {
    const functionName = 'sendHits'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    return visitor.sendHits(hit)
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
  if (!state.sdkState.isSdkReady && state.flags) {
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
    sdkState: state.sdkState,
    flagsData: flagsData || [],
    hit: {
      send: fsSendHit,
      sendMultiple: fsSendHits
    },
    getFlag,
    fetchFlags,
    close
  }
}
