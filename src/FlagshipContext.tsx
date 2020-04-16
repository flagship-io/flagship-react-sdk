import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
// / <reference path="@flagship.io/js-sdk/flagship.d.ts" />
import flagship, {
    FlagshipSdkConfig,
    FlagshipVisitorContext,
    IFlagshipVisitor,
    DecisionApiResponseData,
    GetModificationsOutput
} from '@flagship.io/js-sdk';

declare type FsStateType = {
    fsVisitor: IFlagshipVisitor | null;
    fsModifications: GetModificationsOutput | null;
    status: {
        isLoading: boolean;
        lastRefresh: string | null;
    };
};
export interface FlagshipReactSdkConfig extends FlagshipSdkConfig {
    runInBackground?: 'exceptInit' | 'never';
}

const initState: FsStateType = {
    fsVisitor: null,
    fsModifications: null,
    status: {
        isLoading: true,
        lastRefresh: null
    }
};

const FlagshipContext = React.createContext<{
    state: FsStateType;
    setState: Dispatch<SetStateAction<FsStateType>> | null;
}>({ state: { ...initState }, setState: null });

interface FlagshipProviderProps {
    children: React.ReactNode;
    loadingComponent: React.ReactNode;
    envId: string;
    config: FlagshipReactSdkConfig;
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
    onSavingModificationsInCache(
        modifications: flagship.DecisionApiResponseData | null
    ): void;
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
    const { runInBackground } = config;

    // Call FlagShip any time context get changed.
    useEffect(() => {
        const fsSdk = flagship.initSdk(envId, config);
        const visitorInstance = fsSdk.newVisitor(
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
        visitorInstance.on('ready', () => {
            // TODO: if modifications set, make sure not http request are trigger
            if (modifications) {
                visitorInstance.fetchedModifications = { ...modifications }; // override everything
            }
            // TODO: plug onSaveCache call back with JS SDK
            onSavingModificationsInCache(visitorInstance.fetchedModifications);
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
        if (isLoading) {
            switch (runInBackground) {
                case 'never':
                    return <>{children}</>;
                case 'exceptInit':
                    return isFirstInit ? (
                        <>{loadingComponent}</>
                    ) : (
                        <>{children}</>
                    );
                default:
                    // TODO: log that not supposed to be here
                    return <>{children}</>;
            }
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
        runInBackground: 'exceptInit'
    },
    loadingComponent: null,
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
