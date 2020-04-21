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

export declare type FsStatus = {
    isLoading: boolean;
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
        lastRefresh: null
    }
};

const FlagshipContext = React.createContext<{
    state: FsState;
    setState: Dispatch<SetStateAction<FsState>> | null;
}>({ state: { ...initState }, setState: null });

interface FlagshipProviderProps {
    children: React.ReactNode;
    loadingComponent: React.ReactNode;
    envId: string;
    config: FlagshipSdkConfig;
    visitorData: {
        id: string;
        context?: FlagshipVisitorContext;
    };
    modifications?: DecisionApiResponseData;
    onInitStart(): void;
    onInitDone(sdkData: {
        fsVisitor: IFlagshipVisitor | null;
        fsModifications: GetModificationsOutput | null;
    }): void;
    onSavingModificationsInCache(args: SaveCacheArgs): void;
}

export const FlagshipProvider: React.SFC<FlagshipProviderProps> = ({
    children,
    envId,
    config,
    visitorData,
    loadingComponent,
    modifications,
    onSavingModificationsInCache,
    onInitStart,
    onInitDone
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
        onInitStart();
        visitorInstance.on('saveCache', (args) => {
            onSavingModificationsInCache(args);
        });
        visitorInstance.on('ready', () => {
            // TODO: if modifications set, make sure not http request are trigger
            if (modifications) {
                visitorInstance.fetchedModifications = { ...modifications }; // override everything
            }
            setState({
                ...state,
                status: {
                    isLoading: false,
                    lastRefresh: new Date().toISOString()
                },
                fsVisitor: visitorInstance,
                fsModifications:
                    (visitorInstance.fetchedModifications &&
                        visitorInstance.fetchedModifications.campaigns) ||
                    null
            });
        });
    }, [
        envId,
        id,
        ...Object.values(config),
        ...Object.values(context as FlagshipVisitorContext)
    ]);

    useEffect(() => {
        if (!isLoading) {
            onInitDone({
                fsVisitor: state.fsVisitor,
                fsModifications: state.fsModifications
            });
        }
    }, [state]);

    const handlingDisplay = (): React.ReactNode => {
        const isFirstInit = !fsVisitor;
        if (loadingComponent && isFirstInit) {
            return <>{loadingComponent}</>;
        }
        return <>{children}</>;
    };
    return (
        <FlagshipContext.Provider value={{ state, setState }}>
            {handlingDisplay()}
        </FlagshipContext.Provider>
    );
};

FlagshipProvider.defaultProps = {
    config: {
        // Nothing yet
    },
    loadingComponent: undefined,
    modifications: undefined,
    onInitStart: (): void => {
        // do nothing
    },
    onInitDone: (): void => {
        // do nothing
    }
};

export const FlagshipConsumer = FlagshipContext.Consumer;
export default FlagshipContext;
