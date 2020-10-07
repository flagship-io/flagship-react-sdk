import React, { useState, useEffect, SetStateAction, Dispatch, useContext } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    SaveCacheArgs,
    DecisionApiCampaign,
    PostFlagshipApiCallback,
    BucketingApiResponse,
    IFlagship
} from '@flagship.io/js-sdk';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import loggerHelper from './lib/loggerHelper';
// eslint-disable-next-line import/no-cycle
import FlagshipErrorBoundary, { HandleErrorBoundaryDisplay } from './FlagshipErrorBoundary';

export declare type FsStatus = {
    isLoading: boolean;
    isVisitorDefined: boolean;
    hasError: boolean;
    lastRefresh: string | null;
    firstInitSuccess: string | null;
};

export declare type FsState = {
    fsSdk: IFlagship | null;
    fsVisitor: IFlagshipVisitor | null;
    fsModifications: DecisionApiCampaign[] | null;
    status: FsStatus;
    log: FsLogger | null;
    private: {
        previousFetchedModifications: undefined | DecisionApiCampaign[];
    };
};

export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
    enableErrorLayout?: boolean;
    enableSafeMode?: boolean;
}

export const initState: FsState = {
    fsSdk: null,
    fsVisitor: null,
    log: null,
    fsModifications: null,
    status: {
        isLoading: true,
        isVisitorDefined: false,
        firstInitSuccess: null,
        lastRefresh: null,
        hasError: false
    },
    private: {
        previousFetchedModifications: undefined
    }
};

export type BucketingSuccessArgs = { status: string; payload: BucketingApiResponse };

const FlagshipContext = React.createContext<{
    hasError: boolean;
    state: FsState;
    setState: Dispatch<SetStateAction<FsState>> | null;
}>({ state: { ...initState }, setState: null, hasError: false });

export type FsOnUpdateArguments = {
    fsModifications: DecisionApiCampaign[] | null;
    config: FlagshipReactSdkConfig;
    status: FsStatus;
};

export type FsOnUpdate = (data: FsOnUpdateArguments, visitor: IFlagshipVisitor | null) => void;

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
        httpCallback: PostFlagshipApiCallback;
    };
    fetchNow?: boolean;
    decisionMode?: 'API' | 'Bucketing';
    pollingInterval?: number | null;
    activateNow?: boolean;
    enableConsoleLogs?: boolean;
    enableErrorLayout?: boolean;
    enableSafeMode?: boolean;
    nodeEnv?: string;
    timeout?: number;
    flagshipApi?: string;
    apiKey?: string | null;
    initialModifications?: DecisionApiCampaign[];
    initialBucketing?: BucketingApiResponse;
    onInitStart?(): void;
    onInitDone?(): void;
    onBucketingSuccess?(data: BucketingSuccessArgs): void;
    onBucketingFail?(error: Error): void;
    onSavingModificationsInCache?(args: SaveCacheArgs): void;
    onUpdate?: FsOnUpdate;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
    children,
    reactNative,
    envId,
    visitorData,
    loadingComponent,
    initialModifications,
    initialBucketing,
    onSavingModificationsInCache,
    onInitStart,
    onInitDone,
    onBucketingSuccess,
    onBucketingFail,
    onUpdate,
    timeout,
    fetchNow,
    activateNow,
    enableConsoleLogs,
    enableErrorLayout,
    enableSafeMode,
    nodeEnv,
    flagshipApi,
    apiKey,
    decisionMode,
    pollingInterval
}: FlagshipProviderProps) => {
    const { id, context } = visitorData;
    const extractConfiguration = (): FlagshipReactSdkConfig => {
        const configV2: FlagshipReactSdkConfig = {
            fetchNow: typeof fetchNow !== 'boolean' ? true : fetchNow,
            decisionMode: decisionMode || 'API',
            pollingInterval: pollingInterval || null,
            activateNow: typeof activateNow !== 'boolean' ? false : activateNow,
            timeout: typeof timeout !== 'number' ? undefined : timeout,
            enableConsoleLogs: typeof enableConsoleLogs !== 'boolean' ? false : enableConsoleLogs,
            enableErrorLayout: typeof enableErrorLayout !== 'boolean' ? false : enableErrorLayout,
            enableSafeMode: typeof enableSafeMode !== 'boolean' ? false : enableSafeMode,
            nodeEnv: nodeEnv || 'production',
            initialBucketing: initialBucketing || null,
            flagshipApi,
            apiKey
        };
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
        status: { isLoading, isVisitorDefined, firstInitSuccess },
        fsVisitor
    } = state;
    const tryCatchCallback = (callback: any): void => {
        try {
            callback();
        } catch (error) {
            state.log.fatal(`error: ${error.stack}`);
            setError({ error, hasError: true });
        }
    };
    const computeConfig = (): FlagshipSdkConfig => {
        const sdkConfig = {
            internal: {
                react: {},
                reactNative: {
                    httpCallback: reactNative?.httpCallback
                }
            }
        };
        if (Array.isArray(state.private.previousFetchedModifications)) {
            return {
                ...configuration,
                ...sdkConfig,
                initialModifications: [...state.private.previousFetchedModifications]
            };
        }
        if (state.private.previousFetchedModifications) {
            state.log.warn(
                'initialModifications props is not correctly set and has been ignored, please check the documentation.'
            );
        }
        return { ...configuration, ...sdkConfig };
    };
    const computedConfig: FlagshipSdkConfig = computeConfig(); // FINAL CONFIG

    const handleErrorDisplay = reactNative?.handleErrorDisplay;

    // Call FlagShip any time context get changed.
    useEffect(() => {
        let previousBucketing = null;
        if (state.fsSdk && state.fsSdk.config.decisionMode === 'Bucketing') {
            state.fsSdk.stopBucketingPolling(); // force bucketing to stop
            state.log.info(
                'Bucketing automatically stopped because a setting props from FlagshipProvider has changed. Bucketing will restart automatically if decisionMode is still "Bucketing"'
            );

            state.fsSdk.eventEmitter.removeAllListeners(); // remove all listeners

            previousBucketing = state.fsSdk.bucket?.data || null;
        }
        const { apiKey: theApiKey, ...otherComputedConfig } = computedConfig;
        const fsSdk = flagship.start(envId, theApiKey, {
            ...otherComputedConfig,
            initialBucketing:
                computedConfig.initialBucketing === null ? previousBucketing : computedConfig.initialBucketing
        });
        fsSdk.eventEmitter.on('bucketPollingSuccess', ({ status, payload }: BucketingSuccessArgs) => {
            if (onBucketingSuccess) {
                onBucketingSuccess({ status: status.toString(), payload });
            }
        });
        fsSdk.eventEmitter.on('bucketPollingFailed', (error: Error) => {
            if (onBucketingFail) {
                onBucketingFail(error);
            }
        });

        let visitorInstance: IFlagshipVisitor;
        // if already previous visitor
        if (state?.fsVisitor && state.fsVisitor.envId === fsSdk.envId && state.fsVisitor.id === id) {
            if (state.fsVisitor.context !== context) {
                state.log.debug(
                    `update visitor after re-render, but context is different (old vs new): vContext (${JSON.stringify(
                        state.fsVisitor?.context
                    )} vs ${JSON.stringify(context)})`
                );
            } else {
                state.log.debug(`update visitor after re-render`);
            }
            visitorInstance = (fsSdk as any).updateVisitor(state.fsVisitor, context);
        } else {
            // if existing visitor
            if (state?.fsVisitor) {
                state.log.debug(
                    `unable to update visitor after re-render because of strong update (old vs new): envId (${state.fsVisitor?.envId} vs ${fsSdk.envId}) or vId (${state.fsVisitor?.id} vs ${id})`
                );
            }
            visitorInstance = fsSdk.newVisitor(id, context as FlagshipVisitorContext);
        }
        if (onInitStart) {
            tryCatchCallback(onInitStart);
        }
        visitorInstance.on('ready', () => {
            setState({
                ...state,
                status: {
                    ...state.status,
                    isVisitorDefined: !!visitorInstance,
                    isLoading: false,
                    lastRefresh: new Date().toISOString(),
                    firstInitSuccess: state.status.firstInitSuccess || new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsSdk,
                fsModifications: visitorInstance.fetchedModifications || null,
                private: {
                    previousFetchedModifications: visitorInstance.fetchedModifications || undefined
                }
            });
            if (onInitDone) {
                tryCatchCallback(onInitDone);
            }
        });
        visitorInstance.on('saveCache', (args) => {
            if (onSavingModificationsInCache) {
                tryCatchCallback(() => onSavingModificationsInCache(args));
            }
        });
        setState({
            ...state,
            status: {
                ...state.status,
                isVisitorDefined: !!visitorInstance,
                isLoading: true
            },
            fsVisitor: visitorInstance,
            fsModifications: visitorInstance.fetchedModifications || null,
            fsSdk
        });
    }, [envId, id, JSON.stringify(configuration) + JSON.stringify(context)]);

    useEffect(() => {
        if (onUpdate) {
            tryCatchCallback(() => {
                onUpdate(
                    {
                        status: state.status,
                        fsModifications: state.fsModifications,
                        config: { ...state.config, ...state.fsVisitor?.config }
                    },
                    state.fsVisitor
                );
            });
        }
    }, [
        Object.keys(state).map((key) => {
            const stateDuplicate: any = state;
            return stateDuplicate[key];
        })
    ]);

    const handleDisplay = (): React.ReactNode => {
        const isFirstInit = !fsVisitor || !firstInitSuccess;
        if (isLoading && loadingComponent && isFirstInit && fetchNow) {
            return <>{loadingComponent}</>;
        }
        if (computedConfig.initialModifications && !isVisitorDefined) {
            return null;
        }
        return <>{children}</>;
    };

    const handleError = (error: Error): void => {
        state.log.fatal(`error: ${error.stack}`);
        setError({ error, hasError: !!error });
    };
    return (
        <FlagshipContext.Provider value={{ state, setState, hasError: errorData.hasError }}>
            {enableSafeMode ? (
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
            ) : (
                handleDisplay()
            )}
        </FlagshipContext.Provider>
    );
};

FlagshipProvider.defaultProps = {
    loadingComponent: undefined,
    fetchNow: false,
    activateNow: false,
    decisionMode: 'API',
    pollingInterval: undefined,
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
