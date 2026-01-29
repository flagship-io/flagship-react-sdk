"use client";

import React, {
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import {
  Flagship,
  DecisionMode,
  Visitor,
  FSSdkStatus,
  FlagsStatus,
  primitive,
} from "./deps";

import { FlagshipContext, initStat } from "./FlagshipContext";
import { INTERNAL_EVENTS } from "./internalType";
import { version as SDK_VERSION } from "./sdkVersion";
import type { FsContextState, FlagshipProviderProps } from "./type";
import { useNonInitialEffect, logError, extractFlagsMap } from "./utils";
import {
  useLatestRef,
  shouldRecreateVisitor,
  updateVisitorData,
} from "./hooks";

export function FlagshipProvider({
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
  const flags = useMemo(
    () => extractFlagsMap(initialFlagsData, initialCampaigns),
    [initialFlagsData, initialCampaigns],
  );

  const [flagshipState, setFlagshipState] = useState<FsContextState>({
    ...initStat,
    flags,
    hasVisitorData: !!visitorData,
  });

  const [lastModified, setLastModified] = useState<Date>();

  const flagshipVisitorRef = useRef<Visitor | undefined>();

  useEffect(() => {
    flagshipVisitorRef.current = flagshipState.visitor;
  }, [flagshipState.visitor]);

  const propsRef = useLatestRef(props);

  const configRef = useLatestRef({
    fetchNow,
    hitDeduplicationTime,
    language,
    sdkVersion,
  });

  const callbacksRef = useLatestRef({
    onSdkStatusChanged,
    onBucketingUpdated,
    onFlagsStatusChanged,
  });

  const visitorDataMemo = useMemo(
    () => visitorData,
    [
      visitorData?.id,
      visitorData?.isAuthenticated,
      visitorData?.hasConsented,
      JSON.stringify(visitorData?.context),
    ],
  );

  // #region functions

  const handleBucketingUpdate = useCallback((lastUpdate: Date): void => {
    if (callbacksRef.current.onBucketingUpdated) {
      callbacksRef.current.onBucketingUpdated(lastUpdate);
    }
    setLastModified(lastUpdate);
  }, []);

  const handleFlagsStatusChange = useCallback(
    ({ status, reason }: FlagsStatus) => {
      callbacksRef.current.onFlagsStatusChanged?.({ status, reason });
      setFlagshipState((currentState) => ({
        ...currentState,
        flagsStatus: { status, reason },
      }));
    },
    [],
  );

  const initializeVisitorState = useCallback(
    (param: { fsVisitor: Visitor; sdkStatus: FSSdkStatus }): void => {
      setFlagshipState((currentState) => ({
        ...currentState,
        visitor: param.fsVisitor,
        config: Flagship.getConfig(),
        isInitializing: false,
        hasVisitorData: !!visitorDataMemo,
        sdkStatus: param.sdkStatus,
      }));
    },
    [!!visitorDataMemo],
  );

  const handleVisitorReady = useCallback(
    (fsVisitor: Visitor, error: any | null, sdkStatus: FSSdkStatus): void => {
      if (error) {
        logError(Flagship.getConfig(), error.message || error, "onReady");
      }
      initializeVisitorState({ fsVisitor, sdkStatus });
    },
    [initializeVisitorState],
  );

  const createFlagshipVisitor = useCallback(
    (sdkStatus: FSSdkStatus): void => {
      if (!visitorDataMemo) {
        return;
      }
      const fsVisitor = Flagship.newVisitor({
        visitorId: visitorDataMemo.id,
        context: visitorDataMemo.context,
        isAuthenticated: visitorDataMemo.isAuthenticated,
        hasConsented: visitorDataMemo.hasConsented,
        initialCampaigns,
        initialFlagsData,
        onFlagsStatusChanged: handleFlagsStatusChange,
        shouldSaveInstance,
      });

      fsVisitor?.on("ready", (error) => {
        handleVisitorReady(fsVisitor, error, sdkStatus);
      });

      if (!fetchNow) {
        initializeVisitorState({ fsVisitor, sdkStatus });
      }
    },
    [
      initialCampaigns,
      initialFlagsData,
      handleFlagsStatusChange,
      shouldSaveInstance,
      fetchNow,
      handleVisitorReady,
      initializeVisitorState,
      visitorDataMemo,
    ],
  );

  const handleSdkStatusChange = useCallback(
    (sdkStatus: FSSdkStatus): void => {
      if (callbacksRef.current.onSdkStatusChanged) {
        callbacksRef.current.onSdkStatusChanged(sdkStatus);
      }

      switch (sdkStatus) {
        case FSSdkStatus.SDK_PANIC:
        case FSSdkStatus.SDK_INITIALIZED:
          createFlagshipVisitor(sdkStatus);
          break;
        case FSSdkStatus.SDK_NOT_INITIALIZED:
          setFlagshipState((prev) => ({
            ...prev,
            config: Flagship.getConfig(),
            isInitializing: false,
            sdkStatus,
          }));
          break;
      }
    },
    [createFlagshipVisitor],
  );

  const handleSdkStatusChangeRef = useLatestRef(handleSdkStatusChange);
  const handleBucketingUpdateRef = useLatestRef(handleBucketingUpdate);

  const initializeFlagshipSdk = useCallback((): void => {
    Flagship.start(envId, apiKey, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decisionMode: decisionMode as any,
      fetchNow: configRef.current.fetchNow,
      onSdkStatusChanged: (...args) =>
        handleSdkStatusChangeRef.current(...args),
      onBucketingUpdated: (...args) =>
        handleBucketingUpdateRef.current(...args),
      hitDeduplicationTime: configRef.current.hitDeduplicationTime,
      language: configRef.current.language,
      sdkVersion: configRef.current.sdkVersion,
      ...propsRef.current,
    });
  }, [envId, apiKey, decisionMode]);

  const updateFlagshipVisitor = useCallback((): void => {
    if (
      !visitorDataMemo ||
      Flagship.getStatus() !== FSSdkStatus.SDK_INITIALIZED
    ) {
      return;
    }

    const currentVisitor = flagshipVisitorRef.current;

    if (
      shouldRecreateVisitor(
        currentVisitor,
        visitorDataMemo.id as string,
        visitorDataMemo.isAuthenticated,
      )
    ) {
      currentVisitor?.cleanup();
      createFlagshipVisitor(Flagship.getStatus());
      return;
    }

    // Update existing visitor
    if (currentVisitor) {
      updateVisitorData(
        currentVisitor,
        visitorDataMemo.id as string,
        visitorDataMemo.context as Record<string, primitive>,
        visitorDataMemo.hasConsented,
        visitorDataMemo.isAuthenticated,
      );
    }
  }, [createFlagshipVisitor, visitorDataMemo]);

  // #endregion

  useNonInitialEffect(() => {
    if (fetchFlagsOnBucketingUpdated) {
      flagshipVisitorRef.current?.fetchFlags();
    }
  }, [lastModified, fetchFlagsOnBucketingUpdated]);

  useNonInitialEffect(() => {
    updateFlagshipVisitor();
  }, [updateFlagshipVisitor]);

  useEffect(() => {
    initializeFlagshipSdk();
  }, [initializeFlagshipSdk]);

  useEffect(() => {
    return () => {
      flagshipVisitorRef.current?.cleanup();
      Flagship.close();
    };
  }, []);

  const handleDisplay = useMemo((): ReactNode => {
    const isFirstInit = !flagshipState.visitor;
    if (
      flagshipState.isInitializing &&
      loadingComponent &&
      isFirstInit &&
      fetchNow
    ) {
      return <>{loadingComponent}</>;
    }
    return <>{children}</>;
  }, [
    flagshipState.isInitializing,
    flagshipState.visitor,
    loadingComponent,
    fetchNow,
    children,
  ]);

  const handleForcedVariations = useCallback((e: Event): void => {
    const { detail } = e as CustomEvent<{ forcedReFetchFlags: boolean }>;
    if (detail.forcedReFetchFlags) {
      flagshipVisitorRef.current?.fetchFlags();
    } else {
      setFlagshipState((state) => ({
        ...state,
        toggleForcedVariations: !state.toggleForcedVariations,
      }));
    }
  }, []);

  useEffect(() => {
    window?.addEventListener?.(
      INTERNAL_EVENTS.FsTriggerRendering,
      handleForcedVariations,
    );

    globalThis.__abTastyOnTriggerRender__ = (arg: {
      forcedReFetchFlags: boolean;
    }) => {
      const event = {
        detail: arg,
      } as CustomEvent<{ forcedReFetchFlags: boolean }>;
      handleForcedVariations(event);
    };

    return () =>
      window?.removeEventListener?.(
        INTERNAL_EVENTS.FsTriggerRendering,
        handleForcedVariations,
      );
  }, [handleForcedVariations]);

  const contextValue = useMemo(
    () => ({ state: flagshipState, setState: setFlagshipState }),
    [flagshipState],
  );

  return (
    <FlagshipContext.Provider value={contextValue}>
      {handleDisplay}
    </FlagshipContext.Provider>
  );
}
