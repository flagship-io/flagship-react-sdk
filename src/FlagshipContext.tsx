import React, { useState, useEffect, SetStateAction, Dispatch, useContext, useRef } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    SaveCacheArgs,
    DecisionApiCampaign,
    PostFlagshipApiCallback,
    BucketingApiResponse,
    IFlagship,
    ReadyListenerOutput
} from '@flagship.io/js-sdk';
import useSSR from 'use-ssr';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import loggerHelper from './lib/loggerHelper';
// eslint-disable-next-line import/no-cycle
import FlagshipErrorBoundary, { HandleErrorBoundaryDisplay } from './FlagshipErrorBoundary';
import { areWeTestingWithJest } from './lib/utils';

export declare type FsStatus = {
    isLoading: boolean;
    isSdkReady: boolean;
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
        isSdkReady: false,
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
export type FsContext = {
    hasError: boolean;
    state: FsState;
    setState: Dispatch<SetStateAction<FsState>> | null;
};

const FlagshipContext = React.createContext<FsContext>({ state: { ...initState }, setState: null, hasError: false });

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
        isAuthenticated?: boolean;
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
    const id = visitorData?.id;
    const context = visitorData?.context;
    const isAuthenticated = visitorData?.isAuthenticated || false;
    const previousIsAuthenticated = useRef<boolean>(isAuthenticated);
    const isFirstRun = useRef(true);
    const { isBrowser, isServer, isNative } = useSSR();
    const isJest = areWeTestingWithJest();
    const extractConfiguration = (): FlagshipReactSdkConfig => ({
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
    });
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

    const handleError = (error: Error): void => {
        state.log.fatal(`error: ${error.stack}`);
        setError({ error, hasError: !!error });
    };
    const {
        status: { isLoading, isVisitorDefined, firstInitSuccess, lastRefresh },
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

    const initSdk = (previousBucketing?: BucketingApiResponse | null | undefined): IFlagship => {
        const { apiKey: theApiKey, ...otherComputedConfig } = computedConfig;
        return flagship.start(envId, theApiKey, {
            ...otherComputedConfig,
            fetchNow: isServer ? false : otherComputedConfig.fetchNow, // NOTE: force SDK to run once to keep synchronous processing on SSR.
            initialBucketing:
                computedConfig.initialBucketing === null ? previousBucketing : computedConfig.initialBucketing
        });
    };

    const checkIfVisitorShouldBeNew = (fsSdk: IFlagship): boolean => {
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
            return false;
        }
        // log if visitor id
        if (state?.fsVisitor) {
            state.log.debug(
                `unable to update visitor after re-render because of strong update (old vs new): envId (${state.fsVisitor?.envId} vs ${fsSdk.envId}) or vId (${state.fsVisitor?.id} vs ${id})`
            );
        }
        return true;
    };

    const postInitSdkForClientSide = (fsSdk: IFlagship): void => {
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

        if (onInitStart && !isVisitorDefined) {
            tryCatchCallback(onInitStart);
        }

        // if already previous visitor
        const newVisitorDetected = checkIfVisitorShouldBeNew(fsSdk);
        // NOTE: whenever the visitor is updated or created and no matter (fetchNow/activateNow is true/false), it will ALWAYS emit "ready" event.
        const visitorInstance = newVisitorDetected
            ? fsSdk.newVisitor(id, context as FlagshipVisitorContext)
            : (fsSdk as any).updateVisitor(state.fsVisitor, context);
        setState((s) => ({
            ...s,
            status: {
                ...s.status,
                isVisitorDefined: !!visitorInstance,
                isLoading: true
            },
            fsVisitor: visitorInstance,
            fsModifications: visitorInstance.fetchedModifications || null,
            fsSdk
        }));
        visitorInstance.on('ready', (readyData: ReadyListenerOutput) => {
            const { withError } = readyData;
            setState((s) => ({
                ...s,
                status: {
                    ...s.status,
                    isVisitorDefined: !!visitorInstance,
                    isLoading: false,
                    lastRefresh: new Date().toISOString(),
                    hasError: withError,
                    firstInitSuccess: (!newVisitorDetected && s.status.firstInitSuccess) || new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsSdk,
                fsModifications: visitorInstance.fetchedModifications || null,
                private: {
                    previousFetchedModifications: visitorInstance.fetchedModifications || undefined
                }
            }));
        });
        visitorInstance.on('saveCache', (args: SaveCacheArgs) => {
            if (onSavingModificationsInCache) {
                tryCatchCallback(() => onSavingModificationsInCache(args));
            }
        });
    };

    // Call Flagship once if SSR detected
    if (!isJest && isServer && !isVisitorDefined) {
        state.log.debug(`SDK run on server side detected.`);
        const fsSdk = initSdk();
        const visitorInstance = fsSdk.newVisitor(id, context as FlagshipVisitorContext);
        setState((s) => ({
            ...s,
            status: {
                ...s.status,
                isVisitorDefined: !!visitorInstance
            },
            fsVisitor: visitorInstance,
            fsModifications: visitorInstance.fetchedModifications || null,
            fsSdk
        }));
    } else if ((isJest || isNative || isBrowser) && !isVisitorDefined && firstInitSuccess === null) {
        const fsSdk = initSdk();
        postInitSdkForClientSide(fsSdk); // same for native (= React native)
    }

    const updateVisitorIfIdentityChanged = (): boolean => {
        const isBeingAuthenticated = previousIsAuthenticated.current === false && isAuthenticated === true;
        const isBeingAnonymous = previousIsAuthenticated.current === true && isAuthenticated === false;
        const hasVisitorIdentityChange = isBeingAnonymous || isBeingAuthenticated;
        const updateVisitorAndStatus = (fsV: IFlagshipVisitor, isLoadingValue: boolean): void => {
            setState((s) => ({
                ...s,
                fsModifications: fsV.fetchedModifications,
                status: {
                    ...s.status,
                    isLoading: isLoadingValue
                },
                fsVisitor: fsV
            }));
        };
        if (!fsVisitor) {
            handleError(
                new Error(
                    'Trying to change the anonymous status of visitor that has not been initialized or does not exist.'
                )
            );
        } else {
            if (isBeingAnonymous) {
                // make sure the fsVisitor has an id to avoid the "no anonymous" error when unauthenticate.
                if (!fsVisitor.anonymousId) {
                    fsVisitor.anonymousId = id;
                }
                fsVisitor.unauthenticate(id).then(() => updateVisitorAndStatus(fsVisitor, false));
            } else if (isBeingAuthenticated) {
                fsVisitor.authenticate(id).then(() => updateVisitorAndStatus(fsVisitor, false)); // As explain in the doc, the id might or might not be the same as the anonymous id.
            }

            if (hasVisitorIdentityChange) {
                updateVisitorAndStatus(fsVisitor, true);
            }
        }

        previousIsAuthenticated.current = isAuthenticated;

        return hasVisitorIdentityChange;
    };

    // Call FlagShip any time context get changed.
    useEffect(() => {
        // DON'T RUN THE CODE FIRST TIME RUNNING. Already init before the first rendering.
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (!id && !errorData.hasError) {
            const errorMsg =
                'No visitor id found. Make sure you\'ve set in prop something like this: visitorData={{id: "MY_VISITOR_ID_VALUE"}} inside the FlagshipProvider component.';
            handleError(new Error(errorMsg));
            return;
        }
        if (isServer) {
            state.log.warn(`useEffect triggered in a server environment, SDK stopped.`);
            return;
        }
        let previousBucketing = null;

        // STEP 1: First check if the isAuthenticated has changed (this step must be in this useEffect as it listen the visitorId as well)
        const isVisitorIdentityChanged = updateVisitorIfIdentityChanged();
        if (isVisitorIdentityChanged) {
            return; // If true, means, already updated so don't need to go further
        }

        // STEP 2: if step 1 is falsy, then check bucketing
        if (state.fsSdk && state.fsSdk.config.decisionMode === 'Bucketing') {
            state.fsSdk.stopBucketingPolling(); // force bucketing to stop
            state.log.info(
                'Bucketing automatically stopped because a setting props from FlagshipProvider has changed. Bucketing will restart automatically if decisionMode is still "Bucketing"'
            );

            state.fsSdk.eventEmitter.removeAllListeners(); // remove all listeners

            previousBucketing = state.fsSdk.bucket?.data || null;
        }

        // STEP 3: refresh bucketing with new SDK instance
        const fsSdk = initSdk(previousBucketing);

        // STEP 4: check if should update the visitor or create a brand new one.
        postInitSdkForClientSide(fsSdk);
    }, [envId, id, isAuthenticated, JSON.stringify(configuration) + JSON.stringify(context)]);

    useEffect(() => {
        const isSdkReady = state.status.isVisitorDefined && state.status.firstInitSuccess !== null;
        if (onUpdate) {
            tryCatchCallback(() => {
                onUpdate(
                    {
                        status: { ...state.status, isSdkReady },
                        fsModifications: state.fsModifications,
                        config: { ...state.config, ...state.fsVisitor?.config }
                    },
                    state.fsVisitor
                );
            });
        }
    }, [state?.config, state?.fsModifications, state.status]);

    useEffect(() => {
        if (onInitDone && !!firstInitSuccess && firstInitSuccess === lastRefresh && !isLoading) {
            tryCatchCallback(onInitDone);
        }
    }, [state?.status]);

    // NOTE: DEBUG only
    // useEffect(() => {
    //     console.log(JSON.stringify({ status: state.status, fsSdk: state.fsSdk }));
    // }, [state]);

    const handleDisplay = (): React.ReactNode => {
        const isFirstInit = !fsVisitor || !firstInitSuccess;
        if (isLoading && loadingComponent && isFirstInit && fetchNow) {
            return <>{loadingComponent}</>;
        }
        return <>{children}</>;
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
    fetchNow: true,
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
