// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, ReactNode, createContext, Dispatch, SetStateAction } from 'react'
import { Flagship, FlagshipStatus, IFlagshipConfig, Modification, Visitor } from '@flagship.io/js-sdk'
import { logError } from './utils'

export type primitive = string | number | boolean

interface FsStatus{
  /**
   * Boolean. When true, the SDK is still not ready to render your App otherwise it'll use default modifications.
   */
  isLoading:boolean,
  /**
   * Boolean. true after it has fully finished initialization tasks, false otherwise.
   */
  isSdkReady: boolean,

  lastModified?:Date
  /**
   * Boolean. When true the flagship visitor instance is truthy, false otherwise.
   */
  isVisitorDefined?: boolean,
   /**
   * String or null. The last update date occurred on the flagship visitor instance.
   */
  lastRefresh?:string
  /**
   * String or null. When null no initialization succeed yet. When string contains stringified date of last successful initialization.
   */
  firstInitSuccess?:string
}
interface FsState{
  visitor?:Visitor,
  config?:IFlagshipConfig,
  modifications?:Map<string, Modification>,
  status:FsStatus
}
interface FsContext{
  state:FsState,
  setState?:Dispatch<SetStateAction<FsState>>
}

interface FlagshipProviderProps extends IFlagshipConfig{
    visitorData: {
        id: string
        context?: Record<string, primitive>
        isAuthenticated?: boolean
        hasConsented?:boolean
    }
    envId: string
    apiKey: string
    loadingComponent?: ReactNode
    children?:ReactNode
    /**
     * If value is other than production , it will also display Debug logs.
     */
    nodeEnv?: string
    /**
     * Callback function called when the SDK starts initialization.
     */
    onInitStart?(): void
    /**
     * Callback function called when the SDK ends initialization.
     */
    onInitDone?(): void
    /**
     * Callback function called when the SDK is updated. For example, after a synchronize is triggered or visitor context has changed.
     */
    onUpdate?(params: {
      fsModifications: Map<string, Modification>
      config: IFlagshipConfig
      status: FsStatus
    }):void
}

const initStat:FsState = {
  status: { isLoading: false, isSdkReady: false }
}

export const FlagshipContext = createContext<FsContext>({ state: { ...initStat } })

export const FlagshipProvider: React.FC<FlagshipProviderProps> = ({
  children,
  fetchNow, envId, apiKey, decisionMode,
  timeout, logLevel, statusChangedCallback,
  logManager, pollingInterval, visitorData, onInitStart,
  onInitDone, onBucketingSuccess, onBucketingFail, loadingComponent, onBucketingUpdated, onUpdate, enableClientCache
}:FlagshipProviderProps) => {
  const [state, setState] = useState<FsState>({ ...initStat })
  const [lastModified, setLastModified] = useState<Date>()

  useEffect(() => {
    state.visitor?.synchronizeModifications()
  }, [lastModified])

  useEffect(() => {
    if (!state.visitor) {
      return
    }

    if (visitorData.context) {
      state.visitor.updateContext(visitorData.context)
    }
    if (visitorData.id) {
      state.visitor.visitorId = visitorData.id
    }
    state.visitor.setConsent(!!visitorData.hasConsented)
    state.visitor.synchronizeModifications()
  }, [visitorData])

  useEffect(() => {
    initSdk()
  }, [envId, apiKey, decisionMode])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onVisitorReady = (fsVisitor:Visitor, error:any) => {
    if (error) {
      logError(Flagship.getConfig(), error.message || error, 'onReady')
      return
    }

    setState({
      ...state,
      visitor: fsVisitor,
      modifications: fsVisitor.modifications,
      status: {
        ...state.status,
        isSdkReady: true,
        isLoading: false,
        isVisitorDefined: !!fsVisitor,
        lastRefresh: new Date().toISOString(),
        firstInitSuccess: new Date().toISOString()
      }
    })
    if (onUpdate) {
      onUpdate({
        fsModifications: fsVisitor.modifications,
        config: Flagship.getConfig(),
        status: state.status
      })
    }
  }
  const statusChanged = (status:FlagshipStatus) => {
    if (statusChangedCallback) {
      statusChangedCallback(status)
    }

    if (status === FlagshipStatus.STARTING && onInitStart) {
      onInitStart()
    } else if (status === FlagshipStatus.READY || status === FlagshipStatus.READY_PANIC_ON) {
      if (onInitDone) {
        onInitDone()
      }

      if (state.visitor) {
        state.visitor.synchronizeModifications()
      } else {
        const fsVisitor = Flagship.newVisitor({
          visitorId: visitorData.id,
          context: visitorData.context,
          isAuthenticated: visitorData.isAuthenticated
        })

        fsVisitor?.on('ready', error => {
          onVisitorReady(fsVisitor, error)
        })
        fsVisitor?.setConsent(!!visitorData.hasConsented)
      }
    }
  }

  const onBucketingLastModified = (lastUpdate:Date) => {
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
      onBucketingUpdated: onBucketingLastModified
    })
    setState({
      ...state,
      config: Flagship.getConfig(),
      status: {
        isLoading: true,
        isSdkReady: false
      }
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
  nodeEnv: 'production'
}
