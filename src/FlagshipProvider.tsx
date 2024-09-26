'use client'

// eslint-disable-next-line no-use-before-define
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
  onFetchFlagsStatusChanged,
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
  const onVisitorReadyRef = useRef<(error:unknown)=>void>()

  // #region functions

  const onBucketingLastModified = (lastUpdate: Date) => {
    if (onBucketingUpdated) {
      onBucketingUpdated(lastUpdate)
    }
    setLastModified(lastUpdate)
  }

  const statusChanged = (status: FSSdkStatus) => {
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

  const initSdk = () => {
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
  }) {
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
  const onVisitorReady = (fsVisitor: Visitor, error: any) => {
    if (error) {
      logError(Flagship.getConfig(), error.message || error, 'onReady')
    }
    initializeState({ fsVisitor })
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
      initialFlagsData,
      onFetchFlagsStatusChanged,
      shouldSaveInstance
    })

    onVisitorReadyRef.current = (error) => onVisitorReady(fsVisitor, error)

    fsVisitor?.on('ready', onVisitorReadyRef.current)

    if (!fetchNow) {
      initializeState({ fsVisitor })
    }
  }

  function updateVisitor () {
    if (!visitorData) {
      return
    }
    const visitor = stateRef.current?.visitor

    if (!visitor) {
      createVisitor()
      return
    }

    visitor.cleanup()
    visitor.off('ready', onVisitorReadyRef.current as (error:unknown)=>void)

    createVisitor()

    if (!fetchNow) {
      visitor.fetchFlags()
    }
  }

  // #endregion

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

  const onVariationsForced = (e:Event) => {
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
