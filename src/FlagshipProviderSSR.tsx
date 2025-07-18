import React from "react";
import type { FlagshipProviderProps } from "./type";
import { Flagship, DecisionMode, FSSdkStatus } from "./deps";
import { FlagshipProvider } from "./FlagshipProvider";
import type { SDKConfig } from "./internalType";
import { version as SDK_VERSION } from "./sdkVersion";

async function initFlagship({
  envId,
  apiKey,
  config,
}: {
  envId: string;
  apiKey: string;
  config: SDKConfig;
}) {
  if (Flagship.getStatus() !== FSSdkStatus.SDK_NOT_INITIALIZED) {
    return Flagship;
  }
  await Flagship.start(envId, apiKey, {
    ...config,
    fetchNow: false,
    sdkVersion: SDK_VERSION,
  });
  return Flagship;
}

/**
 * FlagshipProviderSSR is a server-side rendering component for Flagship.
 * It initializes the Flagship SDK and provides the necessary context for rendering.
 * This component is designed to be used in server-side environments where you need to fetch and provide
 * Flagship data before rendering the React application.
 * @returns
 */
export async function FlagshipProviderSSR({
  children,
  envId,
  apiKey,
  decisionMode = DecisionMode.DECISION_API,
  visitorData,
  loadingComponent,
  onSdkStatusChanged,
  onBucketingUpdated,
  fetchFlagsOnBucketingUpdated,
  hitDeduplicationTime = 2,
  fetchNow = false,
  onFlagsStatusChanged,
  shouldSaveInstance,
  ...props
}: Omit<FlagshipProviderProps, "sdkVersion">): Promise<React.JSX.Element> {
  const language = 1;
  const fs = await initFlagship({
    envId,
    apiKey,
    config: {
      ...props,
      decisionMode: decisionMode as any,
      initialBucketing: props.initialBucketing,
      hitDeduplicationTime,
      language,
    },
  });

  let initialFlagsData = props.initialFlagsData;

  if (!props.initialFlagsData && !props.initialCampaigns) {
    const visitor = fs.newVisitor({
      visitorId: visitorData?.id,
      context: visitorData?.context,
      isAuthenticated: visitorData?.isAuthenticated,
      hasConsented: visitorData?.hasConsented as boolean,
      onFlagsStatusChanged,
      shouldSaveInstance,
    });

    await visitor.fetchFlags();

    initialFlagsData = visitor.getFlags().toJSON();
  }

  return (
    <FlagshipProvider
      envId={envId}
      apiKey={apiKey}
      decisionMode={decisionMode}
      visitorData={visitorData}
      loadingComponent={loadingComponent}
      onSdkStatusChanged={onSdkStatusChanged}
      onBucketingUpdated={onBucketingUpdated}
      initialFlagsData={initialFlagsData}
      fetchFlagsOnBucketingUpdated={fetchFlagsOnBucketingUpdated}
      hitDeduplicationTime={hitDeduplicationTime}
      fetchNow={fetchNow}
      language={language}
      sdkVersion={SDK_VERSION}
      onFlagsStatusChanged={onFlagsStatusChanged}
      shouldSaveInstance={shouldSaveInstance}
      {...props}
    >
      {children}
    </FlagshipProvider>
  );
}
