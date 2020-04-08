import React, { useState, useEffect } from "react";
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
  FlagshipSdkConfig,
  FlagshipVisitorContext,
  IFlagshipVisitor,
  DecisionApiResponseData,
  GetModificationsOutput,
} from "@flagship.io/js-sdk";

declare type initStateType = {
  fsVisitor: IFlagshipVisitor | null;
  fsModifications: GetModificationsOutput | null;
};

const initState: initStateType = {
  fsVisitor: null,
  fsModifications: null,
};

const FlagshipContext = React.createContext({ ...initState });

interface FlagshipProviderProps {
  children: React.ReactNode;
  loadingComponent: React.ReactNode;
  envId: string;
  config: FlagshipSdkConfig;
  visitorData: {
    id: string;
    context?: FlagshipVisitorContext;
  };
  modifications: DecisionApiResponseData;
  onInitStart(): void;
  onInitDone(): void;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
  children,
  envId,
  config,
  visitorData,
  loadingComponent,
  modifications,
  onInitStart,
  onInitDone,
}: FlagshipProviderProps) => {
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
  const [state, setState] = useState({ ...initState, loading: true });
  const { loading, ...otherState } = state;

  // Call FlagShip any time context get changed.
  useEffect(() => {
    const fsSdk = flagship.initSdk(envId, config);
    const visitorInstance = fsSdk.newVisitor(
      id,
      context as FlagshipVisitorContext
    );
    onInitStart();
    visitorInstance.on("ready", () => {
      if (modifications) {
        visitorInstance.fetchedModifications = { ...modifications }; // override everything
      }
      setState({
        ...state,
        loading: false,
        fsVisitor: visitorInstance,
        fsModifications:
          (visitorInstance.fetchedModifications &&
            visitorInstance.fetchedModifications.campaigns) ||
          null,
      });
    });
  }, [id, ...Object.values(context as FlagshipVisitorContext)]);

  useEffect(() => {
    if (!state.loading) {
      onInitDone();
    }
  }, [state]);

  return (
    <FlagshipContext.Provider value={{ ...otherState }}>
      {loading ? loadingComponent : children}
    </FlagshipContext.Provider>
  );
};

// FlagshipProvider.propTypes = {
//   children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
//   config: PropTypes.shape({
//     fetchNow: PropTypes.bool,
//     activateNow: PropTypes.bool,
//     logPathName: PropTypes.string,
//     enableConsoleLogs: PropTypes.bool,
//     nodeEnv: PropTypes.string,
//   }),
//   loadingComponent: PropTypes.node,
//   envId: PropTypes.string.isRequired,
//   visitorData: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     context: PropTypes.object,
//   }).isRequired,
//   onInitStart: PropTypes.func,
//   onInitDone: PropTypes.func,
//   modifications: PropTypes.shape(PropTypes.object).isRequired,
// };

FlagshipProvider.defaultProps = {
  config: {},
  loadingComponent: null,
  onInitStart: (): void => {
    // do nothing
  },
  onInitDone: (): void => {
    // do nothing
  },
};

export const FlagshipConsumer = FlagshipContext.Consumer;
export default FlagshipContext;
