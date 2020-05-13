import React, { Dispatch, SetStateAction } from 'react';
import { FlagshipSdkConfig } from '@flagship.io/js-sdk';
import { FsState } from '../../FlagshipContext';
// import manyModifInManyCampaigns from './apiAnswers/manyModifInManyCampaigns';
import oneModifInMoreThanOneCampaign from './apiAnswers/oneModifInMoreThanOneCampaign';
import { vId } from './env';

export const apiAnswers = {
    // manyModifInManyCampaigns,
    oneModifInMoreThanOneCampaign
};

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
            firstInitSuccess: null,
            hasError: false
        },
        private: {
            previousFetchedModifications: undefined
        }
    }
};

export const providerProps = {
    visitorData: {
        id: vId,
        context: { isAuth: true, isVip: false }
    },
    config: {
        fetchNow: true,
        enableConsoleLogs: true,
        enableErrorLayout: true,
        nodeEnv: 'production'
    },
    envId: 'bn1ab7m56qolupi5sa0g'
};

export const fetchedModifications = [
    {
        id: 'bqtvkps9h7j02m34fj2g',
        variation: {
            id: 'bqtvkps9h7j02m34fj40',
            modifications: {
                type: 'JSON',
                value: {}
            },
            reference: true
        },
        variationGroupId: 'bqtvkps9h7j02m34fj3g'
    },
    {
        id: 'bqjfstuirtfg01mctmn0',
        variation: {
            id: 'bqjfstuirtfg01mctmp0',
            modifications: { type: 'JSON', value: { discount: '10%' } },
            reference: false
        },
        variationGroupId: 'bqjfstuirtfg01mctmo0'
    }
];
