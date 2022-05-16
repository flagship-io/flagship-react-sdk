import { useContext } from 'react'
import {
  FlagDTO,
  HitAbstract,
  HitShape,
  IFlag,
  IFlagshipConfig,
  IHit,
  Modification,
  modificationsRequested,
  primitive,
  Visitor
} from '@flagship.io/js-sdk'
import { FlagshipContext, FsState, FsStatus } from './FlagshipContext'
import { logError, logWarn } from './utils'
import { Flag } from './Flag'
import { noVisitorDefault, noVisitorMessage } from './constants'

const checkType = (value: unknown, defaultValue: unknown) =>
  (typeof value === 'object' &&
    typeof defaultValue === 'object' &&
    Array.isArray(value) === Array.isArray(defaultValue)) ||
  typeof value === typeof defaultValue

const fsModificationsSync = <T extends unknown>(args: {
  functionName: string;
  params: modificationsRequested<T>[];
  activateAll?: boolean;
  state: FsState;
  visitor?: Visitor;
  config?: IFlagshipConfig;
}): Record<string, T> => {
  const { visitor, params, activateAll, state, functionName, config } = args
  if (visitor) {
    return visitor.getModificationsSync(params, activateAll)
  }

  const check =
    !state.status.isSdkReady &&
    !!state.modifications &&
    state.modifications.size > 0
  const flags: Record<string, T> = {}

  if (check) {
    params.forEach((item) => {
      const modification = state.modifications?.get(item.key)

      if (modification && checkType(modification?.value, item.defaultValue)) {
        flags[item.key] = modification.value
      } else {
        flags[item.key] = item.defaultValue
      }
    })
    return flags
  }

  logWarn(config, noVisitorDefault, functionName)
  params.forEach((item) => {
    flags[item.key] = item.defaultValue
  })
  return flags
}

/**
 * Retrieve a modification value by its key. If no modification match the given key or if the stored value type and default value type do not match, default value will be returned.
 * @deprecated use useFsGetFlag instead
 */
export const useFsModifications = <T extends unknown>(
  params: modificationsRequested<T>[],
  activateAll?: boolean
): Record<string, T> => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state
  const functionName = 'useFsModifications'

  return fsModificationsSync({
    functionName,
    state,
    visitor,
    config,
    params,
    activateAll
  })
}

/**
 * Retrieve a modification value by its key. If no modification match the given key or if the stored value type and default value type do not match, default value will be returned.
 * @deprecated use useFsGetFlag instead
 */
export const useFsModification: {
  <T>(params: modificationsRequested<T>): T;
} = (params) => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state
  const functionName = 'useFsModifications'

  if (visitor) {
    return visitor.getModificationSync(params)
  }

  const modification = state.modifications?.get(params.key)

  if (
    !state.status.isSdkReady &&
    modification &&
    checkType(modification?.value, params.defaultValue)
  ) {
    return modification.value
  }

  logWarn(config, noVisitorDefault, functionName)
  return params.defaultValue
}

const fsModificationInfoSync = (args: {
  key: string;
  state: FsState;
  visitor?: Visitor;
}) => {
  const { key, visitor, state } = args
  if (visitor) {
    return visitor.getModificationInfoSync(key)
  }
  const modification = state.modifications?.get(key)
  if (!state.status.isSdkReady && modification) {
    return modification
  }
  return null
}

/**
 * Get the campaign modification information value matching the given key.
 * @param {string} key key which identify the modification.
 * @deprecated use useFsGetFlag instead
 */
export const useFsModificationInfo: { (key: string): Modification | null } = (
  key: string
) => {
  const { state } = useContext(FlagshipContext)
  const { visitor } = state
  return fsModificationInfoSync({ key, state, visitor })
}

const fsActivate = async (
  params: { key: string }[] | string[],
  functionName: string,
  visitor?: Visitor,
  config?: IFlagshipConfig
) => {
  try {
    if (!visitor) {
      logWarn(config, noVisitorMessage, functionName)
      return
    }
    await visitor.activateModifications(params)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logWarn(config, error.message || error, functionName)
  }
}

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
    return new Flag(defaultValue, key, state.modifications)
  }

  return visitor.getFlag(key, defaultValue)
}

/**
 * Report this user has seen this modification. Report this user has seen these modifications.
 * @param params
 * @deprecated use useFsGetFlag instead
 * @returns
 */
export const useFsActivate: {
  (keys: { key: string }[]): Promise<void>;
  (keys: string[]): Promise<void>;
} = async (params) => {
  const { state } = useContext(FlagshipContext)
  const { visitor, config } = state
  const functionName = 'useFsModifications'

  await fsActivate(params, functionName, visitor, config)
}

export type UseFlagshipParams<T> = {
  modifications: {
    requested: modificationsRequested<T>[];
    activateAll?: boolean;
  };
};

export type UseFlagshipOutput = {
  visitorId?: string;
  anonymousId?: string | null;
  context?: Record<string, primitive>;
  hasConsented?: boolean;
  /**
   * Set if visitor has consented for protected data usage.
   * @param hasConsented  True if the visitor has consented false otherwise.
   */
  setConsent: (hasConsented: boolean) => void;
  modifications: Modification[];
  flagsData: FlagDTO[];
  status: FsStatus;
  /**
   *
   * @param params
   * @param activateAll
   * @deprecated use useFsGetFlag instead
   */
  getModifications<T>(
    params: modificationsRequested<T>[],
    activateAll?: boolean
  ): Record<string, T>;

  /**
   *
   * @param key
   * @deprecated use useFsGetFlag instead
   */
  getModificationInfo(key: string): Modification | null;

  /**
   * @deprecated use useFsFetchFlags instead
   */
  synchronizeModifications(): Promise<void>;
  /**
   * @deprecated use useFsGetFlag instead
   */
  activateModification: {
    (keys: { key: string }[]): Promise<void>;
    (keys: string[]): Promise<void>;
  };
  /**
   * Update the visitor context values, matching the given keys, used for targeting.
   * A new context value associated with this key will be created if there is no previous matching value.
   * Context keys must be String, and values types must be one of the following : Number, Boolean, String.
   * @param context collection of keys, values.
   */
  updateContext(context: Record<string, primitive>): void;
  /**
   * clear the actual visitor context
   */
  clearContext(): void;
  /**
   * Authenticate anonymous visitor
   * @param visitorId
   */
  authenticate(visitorId: string): void;
  /**
   * This function change authenticated Visitor to anonymous visitor
   * @param visitorId
   */
  unauthenticate(): void;
  hit: {
    send: {
      (hit: HitAbstract): Promise<void>;
      (hit: IHit): Promise<void>;
      (hit: HitShape): Promise<void>;
      (hit: HitAbstract | IHit | HitShape): Promise<void>;
    };
    sendMultiple: {
      (hit: HitAbstract[]): Promise<void>;
      (hit: IHit[]): Promise<void>;
      (hit: HitShape[]): Promise<void>;
      (hit: HitAbstract[] | IHit[] | HitShape[]): Promise<void>;
    };
  };
  /**
   * Retrieve a Flag object by its key. If no flag match the given key an empty flag will be returned.
   * @param key flag key
   * @param defaultValue
   */
  getFlag<T>(key: string, defaultValue: T): IFlag<T>;
  fetchFlags: () => Promise<void>;
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
    (hit: HitAbstract | IHit | HitShape): Promise<void>;
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
    (hit: HitAbstract[] | IHit[] | HitShape[]): Promise<void>;
  } = (hit) => {
    const functionName = 'sendHits'
    if (!visitor) {
      logError(config, noVisitorMessage, functionName)
      return Promise.resolve()
    }
    return visitor.sendHits(hit)
  }

  let modifications = visitor?.getModificationsArray()
  if (!state.status.isSdkReady && state.modifications) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modifications = Array.from(state.modifications, ([_key, item]) => item)
  }

  const activateModification: {
    (keys: { key: string }[]): Promise<void>;
    (keys: string[]): Promise<void>;
  } = async (params) => {
    const functionName = 'activateModification'
    await fsActivate(params, functionName, visitor, config)
  }
  const synchronizeModifications = async () => {
    if (!visitor) {
      logWarn(config, noVisitorMessage, 'synchronizeModifications')
      return
    }
    await visitor.synchronizeModifications()
  }

  const getModifications = <T extends unknown>(
    params: modificationsRequested<T>[],
    activateAll?: boolean
  ) => {
    const functionName = 'getModifications'
    return fsModificationsSync({
      functionName,
      state,
      visitor,
      config,
      params,
      activateAll
    })
  }

  const getModificationInfo: { (key: string): Modification | null } = (
    key: string
  ) => {
    return fsModificationInfoSync({ key, state, visitor })
  }

  function getFlag<T> (key: string, defaultValue: T): IFlag<T> {
    if (!visitor) {
      return new Flag(defaultValue, key, state.modifications)
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

  return {
    visitorId: visitor?.visitorId,
    anonymousId: visitor?.anonymousId,
    context: { ...visitor?.context },
    hasConsented: visitor?.hasConsented,
    setConsent,
    updateContext: fsUpdateContext,
    clearContext: fsClearContext,
    authenticate: fsAuthenticate,
    unauthenticate: fsUnauthenticate,
    status: state.status,
    activateModification,
    synchronizeModifications,
    getModifications,
    modifications: modifications || [],
    flagsData: visitor?.getFlagsDataArray() || [],
    getModificationInfo,
    hit: {
      send: fsSendHit,
      sendMultiple: fsSendHits
    },
    getFlag,
    fetchFlags
  }
}
