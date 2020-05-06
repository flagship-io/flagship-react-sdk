import React, {
    useState,
    useEffect,
    SetStateAction,
    Dispatch,
    useContext
} from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    GetModificationsOutput,
    SaveCacheArgs,
    DecisionApiCampaign
} from '@flagship.io/js-sdk';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import loggerHelper from './lib/loggerHelper';
// eslint-disable-next-line import/no-cycle
import FlagshipErrorBoundary from './FlagshipErrorBoundary';

export declare type FsStatus = {
    isLoading: boolean;
    hasError: boolean;
    lastRefresh: string | null;
    firstInitSuccess: string | null;
};

export declare type FsState = {
    fsVisitor: IFlagshipVisitor | null;
    fsModifications: DecisionApiCampaign[] | null;
    status: FsStatus;
    log: FsLogger | null;
};

export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
    enableErrorLayout: boolean;
}

export const initState: FsState = {
    fsVisitor: null,
    log: null,
    fsModifications: null,
    status: {
        isLoading: true,
        firstInitSuccess: null,
        lastRefresh: null,
        hasError: false
    }
};

const FlagshipContext = React.createContext<{
    hasError: boolean;
    state: FsState;
    setState: Dispatch<SetStateAction<FsState>> | null;
}>({ state: { ...initState }, setState: null, hasError: false });

interface FlagshipProviderProps {
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    envId: string;
    config?: FlagshipReactSdkConfig;
    visitorData: {
        id: string;
        context?: FlagshipVisitorContext;
    };
    initialModifications?: DecisionApiCampaign[];
    onInitStart?(): void;
    onInitDone?(): void;
    onSavingModificationsInCache?(args: SaveCacheArgs): void;
    onUpdate?(
        sdkData: {
            fsModifications: DecisionApiCampaign[] | null;
        },
        fsVisitor: IFlagshipVisitor | null
    ): void;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
    children,
    envId,
    config,
    visitorData,
    loadingComponent,
    initialModifications,
    onSavingModificationsInCache,
    onInitStart,
    onInitDone,
    onUpdate
}: FlagshipProviderProps) => {
    const { id, context } = visitorData;
    const [state, setState] = useState({
        ...initState,
        log: loggerHelper.getLogger(
            config as { enableConsoleLogs: boolean; nodeEnv: string }
        )
    });
    const [errorData, setError] = useState<{
        hasError: boolean;
        error: Error | null;
    }>({ hasError: false, error: null });
    const {
        status: { isLoading, firstInitSuccess },
        fsVisitor
    } = state;
    const tryCatchCallback = (callback: any): void => {
        try {
            callback();
        } catch (error) {
            setError({ error, hasError: true });
        }
    };

    // Call FlagShip any time context get changed.
    useEffect(() => {
        const fsSdk = flagship.start(envId, config);
        const visitorInstance = fsSdk.createVisitor(
            id,
            context as FlagshipVisitorContext
        );
        setState({
            ...state,
            status: {
                ...state.status,
                isLoading: true
            },
            fsVisitor: visitorInstance
            // fsModifications: ???
        });
        if (initialModifications) {
            visitorInstance.fetchedModifications = {
                visitorId: id,
                campaigns: [...initialModifications]
            }; // initialize immediately with something
            if (onUpdate) {
                tryCatchCallback(() => {
                    onUpdate(
                        {
                            fsModifications: [...initialModifications]
                        },
                        visitorInstance
                    );
                });
            }
        }
        if (onInitStart) {
            tryCatchCallback(onInitStart);
        }
        visitorInstance.on('saveCache', (args) => {
            if (onSavingModificationsInCache) {
                tryCatchCallback(() => onSavingModificationsInCache(args));
            }
        });
        visitorInstance.on('ready', () => {
            setState({
                ...state,
                status: {
                    ...state.status,
                    isLoading: false,
                    lastRefresh: new Date().toISOString(),
                    firstInitSuccess:
                        state.status.firstInitSuccess ||
                        new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsModifications:
                    (visitorInstance.fetchedModifications &&
                        visitorInstance.fetchedModifications.campaigns) ||
                    null
            });
            if (onInitDone) {
                tryCatchCallback(onInitDone);
            }
        });
    }, [envId, id, JSON.stringify(config) + JSON.stringify(context)]);

    useEffect(() => {
        if (!isLoading) {
            if (onUpdate) {
                tryCatchCallback(() => {
                    onUpdate(
                        {
                            fsModifications: state.fsModifications
                        },
                        state.fsVisitor
                    );
                });
            }
        }
    }, [state]);

    const handleDisplay = (): React.ReactNode => {
        const isFirstInit = !fsVisitor || !firstInitSuccess;
        if (isLoading && loadingComponent && isFirstInit) {
            return <>{loadingComponent}</>;
        }
        return <>{children}</>;
    };

    const handleError = (error: Error): void => {
        setError({ error, hasError: !!error });
    };
    return (
        <FlagshipContext.Provider
            value={{ state, setState, hasError: errorData.hasError }}
        >
            <FlagshipErrorBoundary
                customerChildren={children}
                onError={handleError}
                error={errorData.error}
                sdkSettings={config as FlagshipReactSdkConfig}
                log={state.log}
            >
                {handleDisplay()}
            </FlagshipErrorBoundary>
        </FlagshipContext.Provider>
    );
};

FlagshipProvider.defaultProps = {
    config: {
        enableErrorLayout: false
    },
    loadingComponent: undefined,
    initialModifications: undefined,
    onInitStart: (): void => {
        // do nothing
    },
    onInitDone: (): void => {
        // do nothing
    },
    onSavingModificationsInCache: (): void => {
        // do nothing
    },
    onUpdate: (): void => {
        // do nothing
    }
};

export const FlagshipConsumer = FlagshipContext.Consumer;
export default FlagshipContext;
export const useFlagshipContext = (): any => useContext(FlagshipContext);
