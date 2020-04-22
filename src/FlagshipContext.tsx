import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    DecisionApiResponseData,
    GetModificationsOutput,
    SaveCacheArgs
} from '@flagship.io/js-sdk';
import FlagshipErrorBoundary from './FlagshipErrorBoundary';

export declare type FsStatus = {
    isLoading: boolean;
    hasError: boolean;
    lastRefresh: string | null;
};

declare type FsState = {
    fsVisitor: IFlagshipVisitor | null;
    fsModifications: GetModificationsOutput | null;
    status: FsStatus;
};
// export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
//     // Nothing yet
// }

const initState: FsState = {
    fsVisitor: null,
    fsModifications: null,
    status: {
        isLoading: true,
        lastRefresh: null,
        hasError: false
    }
};

const FlagshipContext = React.createContext<{
    state: FsState;
    setState: Dispatch<SetStateAction<FsState>> | null;
}>({ state: { ...initState }, setState: null });

interface FlagshipProviderProps {
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    envId: string;
    config?: FlagshipSdkConfig;
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
    const [state, setState] = useState({ ...initState });
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
        setState({
            ...state,
            status: {
                ...state.status,
                hasError: !!error
            }
        });
    };
    return (
        <FlagshipErrorBoundary
            customerChildren={children}
            onError={handleError}
        >
            <FlagshipContext.Provider value={{ state, setState }}>
                {handlingDisplay()}
            </FlagshipContext.Provider>
        </FlagshipErrorBoundary>
    );
};

FlagshipProvider.defaultProps = {
    config: {
        // Nothing yet
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
