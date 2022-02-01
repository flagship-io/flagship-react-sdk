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
  FlagDTO,
  Flagship,
  FlagshipStatus,
  IFlagshipConfig,
  primitive,
  Visitor
} from '@flagship.io/js-sdk'
import { getModificationsFromCampaigns, logError } from './utils'

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
}
interface FsContext {
  state: FsState;
  setState?: Dispatch<SetStateAction<FsState>>;
}

interface FlagshipProviderProps extends IFlagshipConfig {
  visitorData: {
    id: string;
    context?: Record<string, primitive>;
    isAuthenticated?: boolean;
    hasConsented?: boolean;
  };
  envId: string;
  apiKey: string;
  loadingComponent?: ReactNode;
  children?: ReactNode;
  /**
   * If value is other than production , it will also display Debug logs.
   */
  nodeEnv?: string;
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
  initialBucketing?: BucketingDTO;
  initialCampaigns?: CampaignDTO[];
  /**
   * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
   * @deprecated use initialFlags instead
   */
  initialModifications?: Map<string, FlagDTO> | FlagDTO[];

  /**
   * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
   */
  initialFlags?: Map<string, FlagDTO>|FlagDTO[]
  /**
   * If true, it'll automatically call synchronizeModifications when the bucketing file has updated
   */
  synchronizeOnBucketingUpdated?: boolean;
}

const initStat: FsState = {
  status: { isLoading: true, isSdkReady: false }
}

export const FlagshipContext = createContext<FsContext>({
  state: { ...initStat }
})

export const FlagshipProvider: React.FC<FlagshipProviderProps> = ({
  children,
  fetchNow,
  envId,
  apiKey,
  decisionMode,
  decisionApiUrl,
  timeout,
  logLevel,
  statusChangedCallback,
  logManager,
  pollingInterval,
  visitorData,
  onInitStart,
  onInitDone,
  onBucketingSuccess,
  onBucketingFail,
  loadingComponent,
  onBucketingUpdated,
  onUpdate,
  enableClientCache,
  initialBucketing,
  initialCampaigns,
  initialModifications,
  initialFlags,
  synchronizeOnBucketingUpdated,
  activateDeduplicationTime,
  hitDeduplicationTime,
  visitorCacheImplementation,
  hitCacheImplementation,
  disableCache
}: FlagshipProviderProps) => {
  let modifications = new Map<string, FlagDTO>()
  if (initialFlags) {
    initialFlags.forEach((flag) => {
      modifications.set(flag.key, flag)
    })
  } else if (initialModifications) {
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

  useEffect(() => {
    if (synchronizeOnBucketingUpdated) {
      state.visitor?.fetchFlags()
    }
  }, [lastModified])

  useEffect(() => {
    updateVisitor()
  }, [JSON.stringify(visitorData)])

  useEffect(() => {
    initSdk()
  }, [envId, apiKey, decisionMode])

  const updateVisitor = () => {
    if (!state.visitor) {
      return
    }

    if (visitorData.context) {
      state.visitor.clearContext()
      state.visitor.updateContext(visitorData.context)
    }

    if (typeof visitorData.hasConsented === 'boolean') {
      state.visitor.setConsent(visitorData.hasConsented)
    }

    if (state.visitor.anonymousId && !visitorData.isAuthenticated) {
      state.visitor.unauthenticate()
    } else if (!state.visitor.anonymousId && visitorData.isAuthenticated) {
      state.visitor.authenticate(visitorData.id)
    }

    if (visitorData.id) {
      state.visitor.visitorId = visitorData.id
    }

    state.visitor.fetchFlags()
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
  const statusChanged = (status: FlagshipStatus) => {
    if (statusChangedCallback) {
      statusChangedCallback(status)
    }

    if (status === FlagshipStatus.STARTING && onInitStart) {
      onInitStart()
    } else if (
      status === FlagshipStatus.READY_PANIC_ON ||
      status === FlagshipStatus.READY
    ) {
      if (onInitDone) {
        onInitDone()
      }

      if (stateRef.current?.visitor) {
        stateRef.current?.visitor.fetchFlags()
      } else {
        const fsVisitor = Flagship.newVisitor({
          visitorId: visitorData.id,
          context: visitorData.context,
          isAuthenticated: visitorData.isAuthenticated,
          hasConsented: visitorData.hasConsented,
          initialCampaigns,
          initialModifications
        })

        fsVisitor?.on('ready', (error) => {
          onVisitorReady(fsVisitor, error)
        })

        if (!fetchNow && fsVisitor) {
          initializeState({
            fsVisitor,
            isSdkReady: true,
            isLoading: false
          })
        }
      }
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
      decisionMode,
      fetchNow,
      timeout,
      logLevel,
      statusChangedCallback: statusChanged,
      logManager,
      pollingInterval,
      onBucketingFail,
      onBucketingSuccess,
      enableClientCache,
      decisionApiUrl,
      onBucketingUpdated: onBucketingLastModified,
      initialBucketing,
      activateDeduplicationTime,
      hitDeduplicationTime,
      visitorCacheImplementation,
      hitCacheImplementation,
      disableCache
    })
  }
  const handleDisplay = (): React.ReactNode => {
    const isFirstInit = !state.visitor
    if (state.status.isLoading && loadingComponent && isFirstInit) {
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

FlagshipProvider.defaultProps = {
  nodeEnv: 'production',
  activateDeduplicationTime: 10,
  hitDeduplicationTime: 10
}
