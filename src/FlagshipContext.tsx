import React, { useState, useEffect, SetStateAction, Dispatch, useContext } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    SaveCacheArgs,
    DecisionApiCampaign
} from '@flagship.io/js-sdk';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import loggerHelper from './lib/loggerHelper';
// eslint-disable-next-line import/no-cycle
import FlagshipErrorBoundary, { HandleErrorBoundaryDisplay } from './FlagshipErrorBoundary';

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
    private: {
        previousFetchedModifications: undefined | DecisionApiCampaign[];
    };
};

export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
    enableErrorLayout: boolean;
    enableSafeMode: boolean;
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
    },
    private: {
        previousFetchedModifications: undefined
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
    visitorData: {
        id: string;
        context?: FlagshipVisitorContext;
    };
    reactNative?: {
        handleErrorDisplay: HandleErrorBoundaryDisplay;
    };
    // config V1 - DEPRECATED
    config?: FlagshipReactSdkConfig;
    // config V2 - begin
    fetchNow?: boolean;
    activateNow?: boolean;
    enableConsoleLogs?: boolean;
    enableErrorLayout?: boolean;
    enableSafeMode?: boolean;
    nodeEnv?: string;
    flagshipApi?: string;
    apiKey?: string;
    // config V2 - end
    initialModifications?: DecisionApiCampaign[];
    onInitStart?(): void;
    onInitDone?(): void;
    onSavingModificationsInCache?(args: SaveCacheArgs): void;
    onUpdate?(
        sdkData: {
            fsModifications: DecisionApiCampaign[] | null;
            config: FlagshipReactSdkConfig;
        },
        fsVisitor: IFlagshipVisitor | null
    ): void;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
    children,
    reactNative,
    envId,
    visitorData,
    loadingComponent,
    initialModifications,
    onSavingModificationsInCache,
    onInitStart,
    onInitDone,
    onUpdate,
    // config V1 [deprecated]
    config,
    // config V2
    fetchNow,
    activateNow,
    enableConsoleLogs,
    enableErrorLayout,
    enableSafeMode,
    nodeEnv,
    flagshipApi,
    apiKey
}: FlagshipProviderProps) => {
    const { id, context } = visitorData;
    const extractConfiguration = (): FlagshipReactSdkConfig => {
        const configDeprecated = config; // V1
        const configV2: FlagshipReactSdkConfig = {
            fetchNow: fetchNow || false,
            activateNow: activateNow || false,
            enableConsoleLogs: enableConsoleLogs || false,
            enableErrorLayout: enableErrorLayout || false,
            enableSafeMode: enableSafeMode || false,
            nodeEnv: nodeEnv || 'production',
            flagshipApi,
            apiKey
        };
        if (configDeprecated) {
            return {
                ...configV2,
                ...configDeprecated
            };
        }
        return configV2;
    };
    const configuration = extractConfiguration();
    const [state, setState] = useState({
        ...initState,
        log: loggerHelper.getLogger(configuration as { enableConsoleLogs: boolean; nodeEnv: string }),
        config: configuration,
        private: {
            ...initState.private,
            previousFetchedModifications: initialModifications
        }
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
    const computeConfig = () => {
        if (Array.isArray(state.private.previousFetchedModifications)) {
            return {
                ...configuration,
                initialModifications: [...state.private.previousFetchedModifications]
            };
        }
        if (state.private.previousFetchedModifications) {
            state.log.warn(
                'initialModifications props is not correctly set and has been ignored, please check the documentation.'
            );
        }
        return { ...configuration };
    };
    const computedConfig: FlagshipSdkConfig = computeConfig();

    const handleErrorDisplay = reactNative && reactNative.handleErrorDisplay;

    // Call FlagShip any time context get changed.
    useEffect(() => {
        const fsSdk = flagship.start(envId, computedConfig);
        const visitorInstance = fsSdk.newVisitor(id, context as FlagshipVisitorContext);
        setState({
            ...state,
            status: {
                ...state.status,
                isLoading: true
            },
            fsVisitor: visitorInstance
            // fsModifications: ???
        });
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
                    firstInitSuccess: state.status.firstInitSuccess || new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsModifications: visitorInstance.fetchedModifications || null,
                private: {
                    previousFetchedModifications: visitorInstance.fetchedModifications || undefined
                }
            });
            if (onInitDone) {
                tryCatchCallback(onInitDone);
            }
        });
    }, [envId, id, JSON.stringify(configuration) + JSON.stringify(context)]);

    useEffect(() => {
        if (onUpdate) {
            tryCatchCallback(() => {
                onUpdate(
                    {
                        fsModifications: state.fsModifications,
                        config: { ...state.config, ...state.fsVisitor?.config }
                    },
                    state.fsVisitor
                );
            });
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
        <FlagshipContext.Provider value={{ state, setState, hasError: errorData.hasError }}>
            <FlagshipErrorBoundary
                customerChildren={children}
                onError={handleError}
                error={errorData.error}
                sdkSettings={configuration as FlagshipReactSdkConfig}
                handleDisplay={handleErrorDisplay}
                log={state.log}
            >
                {handleDisplay()}
            </FlagshipErrorBoundary>
        </FlagshipContext.Provider>
    );
};

FlagshipProvider.defaultProps = {
    config: undefined,
    loadingComponent: undefined,
    fetchNow: false,
    activateNow: false,
    enableConsoleLogs: false,
    enableErrorLayout: false,
    enableSafeMode: false,
    nodeEnv: 'production',
    flagshipApi: undefined,
    apiKey: undefined,
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
