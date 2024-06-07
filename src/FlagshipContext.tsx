'use client'
// eslint-disable-next-line no-use-before-define
import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useRef
} from 'react'
import {
  BucketingDTO,
  CampaignDTO,
  DecisionMode,
  FlagDTO,
  Flagship,
  FlagshipStatus,
  IFlagshipConfig,
  primitive,
  Visitor
} from '@flagship.io/js-sdk'
import {
  getModificationsFromCampaigns,
  logError,
  useNonInitialEffect
} from './utils'
import { version as SDK_VERSION } from './sdkVersion'
import { INTERNAL_EVENTS } from './internalType'

export interface FsStatus {
  /**
   * Boolean. When true, the SDK is still not ready to render your App otherwise it'll use default modifications.
   */
  isLoading: boolean;
  /**
   * Boolean. true after it has fully finished initialization tasks, false otherwise.
   */
  isSdkReady: boolean;

  lastModified?: Date;
  /**
   * Boolean. When true the flagship visitor instance is truthy, false otherwise.
   */
  isVisitorDefined?: boolean;
  /**
   * String or null. The last update date occurred on the flagship visitor instance.
   */
  lastRefresh?: string;
  /**
   * String or null. When null no initialization succeed yet. When string contains stringified date of last successful initialization.
   */
  firstInitSuccess?: string;
}
export interface FsState {
  visitor?: Visitor;
  config?: IFlagshipConfig;
  modifications?: Map<string, FlagDTO>;
  status: FsStatus;
  initialCampaigns?: CampaignDTO[];
  initialModifications?: Map<string, FlagDTO> | FlagDTO[];
  toggleForcedVariations?: boolean
}

export type VisitorData = {
  id?: string;
  context?: Record<string, primitive>;
  isAuthenticated?: boolean;
  hasConsented?: boolean;
};
interface FsContext {
  state: FsState;
  setState?: Dispatch<SetStateAction<FsState>>;
}

export interface FlagshipProviderProps extends IFlagshipConfig {
  /**
   * This is the data to identify the current visitor using your app
   */
  visitorData: VisitorData | null;
  envId: string;
  apiKey: string;
  /**
   * This component will be rendered when Flagship is loading at first initialization only.
   * By default, the value is undefined. It means it will display your app and it might
   * display default modifications value for a very short moment.
   */
  loadingComponent?: ReactNode;
  children?: ReactNode;

  /**
   * Callback function called when the SDK starts initialization.
   */
  onInitStart?(): void;
  /**
   * Callback function called when the SDK ends initialization.
   */
  onInitDone?(): void;
  /**
   * Callback function called when the SDK is updated. For example, after a synchronize is triggered or visitor context has changed.
   */
  onUpdate?(params: {
    fsModifications: Map<string, FlagDTO>;
    config: IFlagshipConfig;
    status: FsStatus;
  }): void;
  /**
   * This is an object of the data received when fetching bucketing endpoint.
   * Providing this prop will make bucketing ready to use and the first polling will immediatly check for an update.
   * If the shape of an element is not correct, an error log will give the reason why.
   */
  initialBucketing?: BucketingDTO;
  initialCampaigns?: CampaignDTO[];
  /**
   * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
   * @deprecated use initialFlagsData instead
   */
  initialModifications?: Map<string, FlagDTO> | FlagDTO[];

  /**
   * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
   */
  initialFlagsData?: Map<string, FlagDTO> | FlagDTO[];
  /**
   * If true, it'll automatically call synchronizeModifications when the bucketing file has updated
   */
  fetchFlagsOnBucketingUpdated?: boolean;
}

const initStat: FsState = {
  status: { isLoading: true, isSdkReady: false }
}

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat }
})

export const FlagshipProvider: React.FC<FlagshipProviderProps> = ({
  children,
  envId,
  apiKey,
  decisionMode = DecisionMode.DECISION_API,
  visitorData,
  onInitStart,
  onInitDone,
  loadingComponent,
  statusChangedCallback,
  onBucketingUpdated,
  onUpdate,
  initialCampaigns,
  initialModifications,
  initialFlagsData,
  fetchFlagsOnBucketingUpdated,
  hitDeduplicationTime = 2,
  fetchNow = true,
  language = 1,
  sdkVersion = SDK_VERSION,
  ...props
}: FlagshipProviderProps) => {
  let modifications = new Map<string, FlagDTO>()
  if (initialFlagsData && initialFlagsData.forEach) {
    initialFlagsData.forEach((flag) => {
      modifications.set(flag.key, flag)
    })
  } else if (initialModifications && initialModifications.forEach) {
    initialModifications.forEach((modification) => {
      modifications.set(modification.key, modification)
    })
  } else if (initialCampaigns) {
    modifications = getModificationsFromCampaigns(initialCampaigns)
  }

  const [state, setState] = useState<FsState>({ ...initStat, modifications })
  const [lastModified, setLastModified] = useState<Date>()
  const stateRef = useRef<FsState>()
  stateRef.current = state

  useNonInitialEffect(() => {
    if (fetchFlagsOnBucketingUpdated) {
      state.visitor?.fetchFlags()
    }
  }, [lastModified])

  useNonInitialEffect(() => {
    updateVisitor()
  }, [JSON.stringify(visitorData)])

  useEffect(() => {
    initSdk()
  }, [envId, apiKey, decisionMode])

  useEffect(() => {
    window.addEventListener(INTERNAL_EVENTS.FsTriggerRendering, onVariationsForced)
    return () => window.removeEventListener(INTERNAL_EVENTS.FsTriggerRendering, onVariationsForced)
  }, [state.config?.isQAModeEnabled])

  const onVariationsForced = (e:Event) => {
    const { detail } = e as CustomEvent<{ forcedReFetchFlags: boolean }>
    if (detail.forcedReFetchFlags) {
      stateRef.current?.visitor?.fetchFlags()
    } else {
      setState(state => ({ ...state, toggleForcedVariations: !state.toggleForcedVariations }))
    }
  }

  function initializeState (param: {
    fsVisitor: Visitor;
    isLoading: boolean;
    isSdkReady: boolean;
  }) {
    const newStatus: FsStatus = {
      isSdkReady: param.isSdkReady,
      isLoading: param.isLoading,
      isVisitorDefined: !!param.fsVisitor,
      lastRefresh: new Date().toISOString()
    }

    setState((currentState) => {
      if (!currentState.status.firstInitSuccess) {
        newStatus.firstInitSuccess = new Date().toISOString()
      }

      return {
        ...currentState,
        visitor: param.fsVisitor,
        modifications: param.fsVisitor.modifications,
        config: Flagship.getConfig(),
        status: {
          ...currentState.status,
          ...newStatus
        }
      }
    })

    return newStatus
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onVisitorReady = (fsVisitor: Visitor, error: any) => {
    if (error) {
      logError(Flagship.getConfig(), error.message || error, 'onReady')
      return
    }

    const newStatus = initializeState({
      fsVisitor,
      isSdkReady: true,
      isLoading: false
    })

    if (onUpdate) {
      onUpdate({
        fsModifications: fsVisitor.modifications,
        config: Flagship.getConfig(),
        status: newStatus
      })
    }
  }

  function updateVisitor () {
    if (!visitorData) {
      return
    }

    if (!state.visitor || (state.visitor.visitorId !== visitorData.id && (!visitorData.isAuthenticated || (visitorData.isAuthenticated && state.visitor.anonymousId)))) {
      createVisitor()
      return
    }

    if (visitorData.hasConsented !== state.visitor.hasConsented) {
      state.visitor.setConsent(visitorData.hasConsented ?? true)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.visitor.updateContext(visitorData.context as any)

    if (!state.visitor.anonymousId && visitorData.isAuthenticated) {
      state.visitor.authenticate(visitorData.id as string)
    }
    if (state.visitor.anonymousId && !visitorData.isAuthenticated) {
      state.visitor.unauthenticate()
    }
    state.visitor.fetchFlags()
  }

  const createVisitor = () => {
    if (!visitorData) {
      return
    }
    const fsVisitor = Flagship.newVisitor({
      visitorId: visitorData.id,
      context: visitorData.context,
      isAuthenticated: visitorData.isAuthenticated,
      hasConsented: visitorData.hasConsented,
      initialCampaigns,
      initialModifications,
      initialFlagsData
    })

    fsVisitor?.on('ready', (error) => {
      onVisitorReady(fsVisitor, error)
    })

    if (!fetchNow) {
      initializeState({
        fsVisitor,
        isSdkReady: true,
        isLoading: false
      })
    }
  }
  const statusChanged = (status: FlagshipStatus) => {
    if (statusChangedCallback) {
      statusChangedCallback(status)
    }

    switch (status) {
      case FlagshipStatus.STARTING:
        if (status === FlagshipStatus.STARTING && onInitStart) {
          onInitStart()
        }
        break
      case FlagshipStatus.READY_PANIC_ON:
      case FlagshipStatus.READY:
        if (onInitDone) {
          onInitDone()
        }

        createVisitor()

        break
      case FlagshipStatus.NOT_INITIALIZED:
        setState((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            isLoading: false
          },
          config: Flagship.getConfig()
        }))
        break
    }
  }

  const onBucketingLastModified = (lastUpdate: Date) => {
    if (onBucketingUpdated) {
      onBucketingUpdated(lastUpdate)
    }
    setLastModified(lastUpdate)
  }

  const initSdk = () => {
    Flagship.start(envId, apiKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decisionMode: decisionMode as any,
      fetchNow,
      statusChangedCallback: statusChanged,
      onBucketingUpdated: onBucketingLastModified,
      hitDeduplicationTime,
      language,
      sdkVersion,
      ...props
    })
  }
  const handleDisplay = (): React.ReactNode => {
    const isFirstInit = !state.visitor
    if (state.status.isLoading && loadingComponent && isFirstInit && fetchNow) {
      return <>{loadingComponent}</>
    }
    return <>{children}</>
  }
  return (
    <FlagshipContext.Provider value={{ state, setState }}>
      {handleDisplay()}
    </FlagshipContext.Provider>
  )
}
