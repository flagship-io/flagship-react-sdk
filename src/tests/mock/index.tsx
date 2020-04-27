import React, { Dispatch, SetStateAction } from 'react';
import { FlagshipSdkConfig } from '@flagship.io/js-sdk';
import { FsState } from '../../FlagshipContext';

export const defaultConfig: FlagshipSdkConfig = {
    // Nothing
};

export const DefaultLoadingComponent: React.SFC = () => (
    <div>Loading Flagship React SDK</div>
);

export const defaultContext: {
    hasError: boolean;
    state: FsState;
} = {
    hasError: false,
    state: {
        fsVisitor: null,
        log: null,
        fsModifications: null,
        status: {
            isLoading: true,
            lastRefresh: null,
            hasError: false
        }
    }
};

export const providerProps = {
    visitorData: {
        id: 'test-vid',
        context: { isAuth: true, numberTransaction: 12, isVip: false }
    },
    config: {
        fetchNow: true,
        enableConsoleLogs: true,
        enableErrorLayout: true,
        nodeEnv: 'production'
    },
    envId: 'bn1ab7m56qolupi5sa0g'
};
