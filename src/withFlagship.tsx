import React, { useState, useEffect, ReactNode } from "react";
import flagship from "@flagship.io/js-sdk";

export default function withFlagship(
  WrappedComponent,
  reactSdkConfig,
  envId,
  visitorInfo = { id: "test-perf", context: {} }
): ReactNode {
  const [fsVisitor, setFsVisitor] = useState(null);
  useEffect(() => {
    const { id, context } = visitorInfo;

    const fsSdk = flagship.initSdk(envId, { ...reactSdkConfig });

    const visitorInstance = fsSdk.newVisitor(id, context);

    visitorInstance.on("ready", () => {
      setFsVisitor(visitorInstance);
    });
  }, [envId, reactSdkConfig, visitorInfo]);
  const reactComponent = (props): ReactNode => (
    <WrappedComponent fsVisitor={fsVisitor} {...props} />
  );
  return reactComponent;
}
