'use client'

import React, { useState, useRef, ReactNode, useEffect } from 'react'

import Flagship, {
  DecisionMode,
  Visitor,
  FSSdkStatus
} from '@flagship.io/js-sdk'

import {
  FlagshipContext,
  initStat
} from './FlagshipContext'
import { INTERNAL_EVENTS } from './internalType'
import { version as SDK_VERSION } from './sdkVersion'
import { FsContextState, FlagshipProviderProps } from './type'
import { useNonInitialEffect, logError, extractFlagsMap } from './utils'

export function FlagshipProvider ({
  children,
  envId,
  apiKey,
  decisionMode = DecisionMode.DECISION_API,
  visitorData,
  loadingComponent,
  onSdkStatusChanged,
  onBucketingUpdated,
  initialCampaigns,
  initialFlagsData,
  fetchFlagsOnBucketingUpdated,
  hitDeduplicationTime = 2,
  fetchNow = true,
  language = 1,
  sdkVersion = SDK_VERSION,
  onFlagsStatusChanged,
  shouldSaveInstance,
  ...props
}: FlagshipProviderProps): React.JSX.Element {
  const flags = extractFlagsMap(initialFlagsData, initialCampaigns)

  const [state, setState] = useState<FsContextState>({
    ...initStat,
    flags,
    hasVisitorData: !!visitorData
  })
  const [lastModified, setLastModified] = useState<Date>()
  const stateRef = useRef<FsContextState>()
  stateRef.current = state

  const visitorDataRef = useRef(visitorData)

  // #region functions

  const onBucketingLastModified = (lastUpdate: Date):void => {
    if (onBucketingUpdated) {
      onBucketingUpdated(lastUpdate)
    }
    setLastModified(lastUpdate)
  }

  const statusChanged = (status: FSSdkStatus):void => {
    if (onSdkStatusChanged) {
      onSdkStatusChanged(status)
    }

    switch (status) {
      case FSSdkStatus.SDK_PANIC:
      case FSSdkStatus.SDK_INITIALIZED:
        createVisitor()
        break
      case FSSdkStatus.SDK_NOT_INITIALIZED:
        setState((prev) => ({
          ...prev,
          config: Flagship.getConfig(),
          isInitializing: false
        }))
        break
    }
  }

  const initSdk = ():void => {
    Flagship.start(envId, apiKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decisionMode: decisionMode as any,
      fetchNow,
      onSdkStatusChanged: statusChanged,
      onBucketingUpdated: onBucketingLastModified,
      hitDeduplicationTime,
      language,
      sdkVersion,
      ...props
    })
  }

  function initializeState (param: {
    fsVisitor: Visitor;
  }):void {
    setState((currentState) => ({
      ...currentState,
      visitor: param.fsVisitor,
      config: Flagship.getConfig(),
      isInitializing: false,
      hasVisitorData: !!visitorData
    })
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onVisitorReady = (fsVisitor: Visitor, error: any):void => {
    if (error) {
      logError(Flagship.getConfig(), error.message || error, 'onReady')
    }
    initializeState({ fsVisitor })
  }

  const createVisitor = ():void => {
    if (!visitorDataRef.current) {
      return
    }
    const fsVisitor = Flagship.newVisitor({
      visitorId: visitorDataRef.current.id,
      context: visitorDataRef.current.context,
      isAuthenticated: visitorDataRef.current.isAuthenticated,
      hasConsented: visitorDataRef.current.hasConsented,
      initialCampaigns,
      initialFlagsData,
      onFlagsStatusChanged,
      shouldSaveInstance
    })

    fsVisitor?.on('ready', (error) => {
      onVisitorReady(fsVisitor, error)
    })

    if (!fetchNow) {
      initializeState({ fsVisitor })
    }
  }

  function updateVisitor ():void {
    if (!visitorDataRef.current || Flagship.getStatus() !== FSSdkStatus.SDK_INITIALIZED) {
      return
    }
    if (!state.visitor ||
      (state.visitor.visitorId !== visitorDataRef.current.id &&
      (!visitorDataRef.current.isAuthenticated || (visitorDataRef.current.isAuthenticated && state.visitor.anonymousId)))
    ) {
      state.visitor?.cleanup()
      createVisitor()
      return
    }

    if (visitorDataRef.current.hasConsented !== state.visitor.hasConsented) {
      state.visitor.setConsent(visitorDataRef.current.hasConsented ?? true)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.visitor.updateContext(visitorDataRef.current.context as any)

    if (!state.visitor.anonymousId && visitorDataRef.current.isAuthenticated) {
      state.visitor.authenticate(visitorDataRef.current.id as string)
    }
    if (state.visitor.anonymousId && !visitorDataRef.current.isAuthenticated) {
      state.visitor.unauthenticate()
    }
    state.visitor.fetchFlags()
  }

  // #endregion

  useNonInitialEffect(() => {
    if (fetchFlagsOnBucketingUpdated) {
      state.visitor?.fetchFlags()
    }
  }, [lastModified])

  useNonInitialEffect(() => {
    visitorDataRef.current = visitorData
    updateVisitor()
  }, [JSON.stringify(visitorData)])

  useEffect(() => {
    initSdk()
  }, [envId, apiKey, decisionMode])

  const handleDisplay = (): ReactNode => {
    const isFirstInit = !state.visitor
    if (
      state.isInitializing &&
      loadingComponent &&
      isFirstInit &&
      fetchNow
    ) {
      return <>{loadingComponent}</>
    }
    return <>{children}</>
  }

  useEffect(() => {
    window?.addEventListener?.(INTERNAL_EVENTS.FsTriggerRendering, onVariationsForced)
    return () => window?.removeEventListener?.(INTERNAL_EVENTS.FsTriggerRendering, onVariationsForced)
  }, [state.config?.isQAModeEnabled])

  const onVariationsForced = (e:Event):void => {
    const { detail } = e as CustomEvent<{ forcedReFetchFlags: boolean }>
    if (detail.forcedReFetchFlags) {
      stateRef.current?.visitor?.fetchFlags()
    } else {
      setState(state => ({ ...state, toggleForcedVariations: !state.toggleForcedVariations }))
    }
  }

  return (
    <FlagshipContext.Provider value={{ state, setState }}>
      {handleDisplay()}
    </FlagshipContext.Provider>
  )
}
