import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    DecisionApiResponseData,
    GetModificationsOutput,
    SaveCacheArgs,
    FsLogger
} from '@flagship.io/js-sdk';
// eslint-disable-next-line import/no-cycle
import FlagshipErrorBoundary from './FlagshipErrorBoundary';
import loggerHelper from './lib/loggerHelper';

export declare type FsStatus = {
    isLoading: boolean;
    hasError: boolean;
    lastRefresh: string | null;
};

declare type FsState = {
    fsVisitor: IFlagshipVisitor | null;
    fsModifications: GetModificationsOutput | null;
    status: FsStatus;
    log: FsLogger | null;
};

export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
    enableErrorLayout: boolean;
}

const initState: FsState = {
    fsVisitor: null,
    log: null,
    fsModifications: null,
    status: {
        isLoading: true,
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
    defaultModifications?: DecisionApiResponseData;
    onInitStart?(): void;
    onInitDone?(): void;
    onSavingModificationsInCache?(args: SaveCacheArgs): void;
    onUpdate?(sdkData: {
        fsVisitor: IFlagshipVisitor | null;
        fsModifications: GetModificationsOutput | null;
    }): void;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
    children,
    envId,
    config,
    visitorData,
    loadingComponent,
    defaultModifications,
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
    const [hasError, setError] = useState(false);
    const {
        status: { isLoading },
        fsVisitor
    } = state;

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
        if (defaultModifications) {
            visitorInstance.fetchedModifications = { ...defaultModifications }; // initialize immediately with something
        }
        if (onInitStart) {
            onInitStart();
        }
        visitorInstance.on('saveCache', (args) => {
            if (onSavingModificationsInCache) {
                onSavingModificationsInCache(args);
            }
        });
        visitorInstance.on('ready', () => {
            setState({
                ...state,
                status: {
                    ...state.status,
                    isLoading: false,
                    lastRefresh: new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsModifications:
                    (visitorInstance.fetchedModifications &&
                        visitorInstance.fetchedModifications.campaigns) ||
                    null
            });
            if (onInitDone) {
                onInitDone();
            }
        });
    }, [
        envId,
        id,
        ...Object.values(config as FlagshipSdkConfig),
        ...Object.values(context as FlagshipVisitorContext)
    ]);

    useEffect(() => {
        if (!isLoading) {
            if (onUpdate) {
                onUpdate({
                    fsVisitor: state.fsVisitor,
                    fsModifications: state.fsModifications
                });
            }
        }
    }, [state]);

    const handlingDisplay = (): React.ReactNode => {
        const isFirstInit = !fsVisitor;
        if (loadingComponent && isFirstInit) {
            return <>{loadingComponent}</>;
        }
        return <>{children}</>;
    };

    const handleError = (error: Error): void => {
        setError(!!error);
    };
    return (
        <FlagshipContext.Provider value={{ state, setState, hasError }}>
            <FlagshipErrorBoundary
                customerChildren={children}
                onError={handleError}
                sdkSettings={config as FlagshipReactSdkConfig}
                log={state.log}
            >
                {handlingDisplay()}
            </FlagshipErrorBoundary>
        </FlagshipContext.Provider>
    );
};

FlagshipProvider.defaultProps = {
    config: {
        enableErrorLayout: false
    },
    loadingComponent: undefined,
    defaultModifications: undefined,
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
