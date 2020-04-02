import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import flagship from '@flagship.io/js-sdk';

const FlagshipContext = React.createContext({ visitor: null });

export const FlagshipProvider = ({ children, envId, config, visitorData, loadingComponent, modifications, onInitStart, onInitDone }) => {
  // Get visitor context
  //   const visitorContext = useMappedState(
  //     useCallback(
  //       (state: Store) => ({
  //         accountId: getCurrentAccountId(state),
  //         userId: selectProfile(state).id,
  //         isABTasty: selectProfile(state).is_abtasty
  //       }),
  //       []
  //     )
  //   );
  const { id, context } = visitorData;
  const [state, setState] = useState({
    fsVisitor: null,
    fsModifications: null,
    loading: true
  });
  const { loading, ...otherState } = state;

  // Call FlagShip any time context get changed.
  useEffect(() => {
    const fsSdk = flagship.initSdk(envId, config);
    const visitorInstance = fsSdk.newVisitor(id, context);
    onInitStart();
    visitorInstance.on('ready', () => {
      if (modifications) {
        visitorInstance.fetchedModifications = { ...modifications }; // override everything
      }
      setState({
        ...state,
        loading: false,
        fsVisitor: visitorInstance,
        fsModifications: (visitorInstance.fetchedModifications && visitorInstance.fetchedModifications.campaigns) || null
      });
    });
  }, [id, ...Object.values(context)]);

  useEffect(() => {
    if (!state.loading) {
      onInitDone();
    }
  }, [state]);

  return <FlagshipContext.Provider value={{ ...otherState }}>{loading ? loadingComponent : children}</FlagshipContext.Provider>;
};

FlagshipProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  config: PropTypes.shape({
    fetchNow: PropTypes.bool,
    activateNow: PropTypes.bool,
    logPathName: PropTypes.string,
    enableConsoleLogs: PropTypes.bool,
    nodeEnv: PropTypes.string
  }),
  loadingComponent: PropTypes.node,
  envId: PropTypes.string.isRequired,
  visitorData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    context: PropTypes.object
  }).isRequired,
  onInitStart: PropTypes.func,
  onInitDone: PropTypes.func,
  modifications: PropTypes.shape(PropTypes.object).isRequired
};

FlagshipProvider.defaultProps = {
  config: {},
  loadingComponent: null,
  onInitStart: () => {},
  onInitDone: () => {}
};

export const FlagshipConsumer = FlagshipContext.Consumer;
export default FlagshipContext;
