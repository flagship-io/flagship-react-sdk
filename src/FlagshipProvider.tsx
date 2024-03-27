'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'

import Flagship, {
  DecisionMode,
  FlagDTO,
  Visitor,
  FSSdkStatus
} from '@flagship.io/js-sdk'

import {
  FlagshipContext,
  initStat
} from './FlagshipContext'
import { version as SDK_VERSION } from './sdkVersion'
import { FsSdkState, FsContextState, FlagshipProviderProps } from './type'
import { getFlagsFromCampaigns, useNonInitialEffect, logError } from './utils'

export function FlagshipProvider ({
  children,
  envId,
  apiKey,
  decisionMode = DecisionMode.DECISION_API,
  visitorData,
  loadingComponent,
  onSdkStatusChanged,
  onBucketingUpdated,
  onUpdate,
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
  let flags = new Map<string, FlagDTO>()
  if (initialFlagsData && initialFlagsData.forEach) {
    initialFlagsData.forEach((flag) => {
      flags.set(flag.key, flag)
    })
  } else if (initialCampaigns) {
    flags = getFlagsFromCampaigns(initialCampaigns)
  }

  const [state, setState] = useState<FsContextState>({
    ...initStat,
    flags
  })
  const [lastModified, setLastModified] = useState<Date>()
  const stateRef = useRef<FsContextState>()
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

  function initializeState (param: {
    fsVisitor: Visitor;
    isLoading: boolean;
    isSdkReady: boolean;
  }) {
    const newStatus: FsSdkState = {
      isSdkReady: param.isSdkReady,
      isLoading: param.isLoading,
      isVisitorDefined: !!param.fsVisitor,
      lastRefresh: new Date().toISOString()
    }

    setState((currentState) => {
      if (!currentState.sdkState.firstInitSuccess) {
        newStatus.firstInitSuccess = new Date().toISOString()
      }

      return {
        ...currentState,
        visitor: param.fsVisitor,
        flags: param.fsVisitor.flagsData,
        config: Flagship.getConfig(),
        sdkState: {
          ...currentState.sdkState,
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
        fsModifications: fsVisitor.flagsData,
        config: Flagship.getConfig(),
        status: newStatus
      })
    }
  }

  function updateVisitor () {
    if (!visitorData) {
      return
    }

    if (
      !state.visitor ||
      (state.visitor.visitorId !== visitorData.id &&
        (!visitorData.isAuthenticated ||
          (visitorData.isAuthenticated && state.visitor.anonymousId)))
    ) {
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
      initialFlagsData,
      onFetchFlagsStatusChanged,
      shouldSaveInstance
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
          sdkState: {
            ...prev.sdkState,
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
      onSdkStatusChanged: statusChanged,
      onBucketingUpdated: onBucketingLastModified,
      hitDeduplicationTime,
      language,
      sdkVersion,
      ...props
    })
  }
  const handleDisplay = (): ReactNode => {
    const isFirstInit = !state.visitor
    if (
      state.sdkState.isLoading &&
      loadingComponent &&
      isFirstInit &&
      fetchNow
    ) {
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
