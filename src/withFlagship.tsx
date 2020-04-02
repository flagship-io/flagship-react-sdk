import React from 'react';
import flagship from '@flagship.io/js-sdk';

export default function withFlagship(WrappedComponent, reactSdkConfig, envId, visitorInfo = { id: 'test-perf', context: {} }): React.ReactNode {
  const [fsVisitor, setFsVisitor] = React.useState(null);
  React.useEffect(() => {
    const { id, context } = visitorInfo;

    const fsSdk = flagship.initSdk(envId, { ...reactSdkConfig });

    const visitorInstance = fsSdk.newVisitor(id, context);

    visitorInstance.on('ready', () => {
      setFsVisitor(visitorInstance);
    });
  }, [envId, reactSdkConfig, visitorInfo]);
  const reactComponent = (props): React.ReactNode => <WrappedComponent fsVisitor={fsVisitor} {...props} />;
  return reactComponent;
}
