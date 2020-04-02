import React from 'react';
import flagship from '@flagship.io/js-sdk';
import { isAppInDev } from '../utils';

// __          __              _
// \ \        / /             (_)
//  \ \  /\  / /_ _ _ __ _ __  _ _ __   __ _
//   \ \/  \/ / _` | '__| '_ \| | '_ \ / _` |
//    \  /\  / (_| | |  | | | | | | | | (_| |
//     \/  \/ \__,_|_|  |_| |_|_|_| |_|\__, |
//                                      __/ |
//                                     |___/
// THIS FILE IS NOT USED IN CURRENT PROJECT
// THIS FILE IS A PROTOTYPE FOR FUTRURE REACT SDK for people who are using React 15 or before.

// More DOC: https://reactjs.org/docs/higher-order-components.html
export default function withFlagship(WrappedComponent, /* config, */ visitorInfo = { id: 'test-perf', context: {} }) {
  const [fsVisitor, setFsVisitor] = React.useState(null);
  React.useEffect(() => {
    const additionalConfig = {};
    const { id, context } = visitorInfo;
    if (isAppInDev()) {
      additionalConfig.flagshipApi = 'https://decisionapi.test.internal.flagship.io/v1';
    }
    const fsSdk = flagship.initSdk('bn2siim56qojvt4jvgj0', { fetchNow: true, enableConsoleLogs: isAppInDev(), ...additionalConfig });

    const visitorInstance = fsSdk.newVisitor(id, context);

    visitorInstance.on('ready', () => {
      setFsVisitor(visitorInstance);
    });
  }, []);
  const reactComponent = props => <WrappedComponent fsVisitor={fsVisitor} {...props} />;
  return reactComponent;
}
