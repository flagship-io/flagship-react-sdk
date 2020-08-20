import '@testing-library/jest-dom/extend-expect';

import { render, waitFor } from '@testing-library/react';
import React from 'react';

import {
    DecisionApiCampaign,
    IFlagshipVisitor,
    DecisionApiResponseData,
    GetModificationsOutput
} from '@flagship.io/js-sdk';
import { FlagshipProvider, FlagshipReactSdkConfig, FsOnUpdateArguments } from '../FlagshipContext';
import { providerProps, fetchedModifications } from './mock';

describe('fsContext provider', () => {
    let isReady: boolean;
    let spyWarnLogs: any;
    let spyErrorLogs: any;
    let spyInfoLogs: any;
    beforeAll(() => {
        //
    });
    beforeEach(() => {
        isReady = false;
        spyWarnLogs = jest.spyOn(console, 'warn').mockImplementation();
        spyErrorLogs = jest.spyOn(console, 'error').mockImplementation();
        spyInfoLogs = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        spyWarnLogs.mockRestore();
        spyErrorLogs.mockRestore();
        spyInfoLogs.mockRestore();
    });
    test('it should display a loading component if set in props', async () => {
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
                loadingComponent={<div>Loading SDK</div>}
            >
                <div>Hello</div>
            </FlagshipProvider>
        );
        expect(container.querySelector('div')?.innerHTML).toEqual('Loading SDK');

        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        expect(container.querySelector('div')?.innerHTML).toEqual('Hello');
        expect(isReady).toEqual(true);
    });
    test('it should working callbacks props ', async () => {
        const isCalled: {
            onSavingModificationsInCache: boolean;
            onInitStart: boolean;
            onInitDone: boolean;
            onUpdate: boolean;
            onUpdateParams: {
                sdkData?: FsOnUpdateArguments;
                sdkVisitor?: IFlagshipVisitor | null;
            };
        } = {
            onSavingModificationsInCache: false,
            onInitStart: false,
            onInitDone: false,
            onUpdate: false,
            onUpdateParams: {}
        };
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                    isCalled.onInitDone = true;
                }}
                onSavingModificationsInCache={() => {
                    isCalled.onSavingModificationsInCache = true;
                }}
                onInitStart={() => {
                    isCalled.onInitStart = true;
                }}
                onUpdate={(sdkData, sdkVisitor) => {
                    isCalled.onUpdate = true;
                    isCalled.onUpdateParams = { sdkData, sdkVisitor };
                }}
            >
                <div>Hello</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        expect(isCalled.onInitDone).toEqual(true);
        expect(isCalled.onInitStart).toEqual(true);
        expect(isCalled.onSavingModificationsInCache).toEqual(true);
        expect(isCalled.onUpdate).toEqual(true);
        expect(isCalled.onUpdateParams.sdkData).toHaveProperty('fsModifications');
        expect(((isCalled.onUpdateParams.sdkData as any).fsModifications as DecisionApiCampaign[]).length > 0).toEqual(
            true
        );
        expect(
            ((isCalled.onUpdateParams.sdkData as any).fsModifications as DecisionApiCampaign[]).filter(
                (i: any) => !i.variation.reference
            )
        ).toEqual(fetchedModifications);
        expect(isCalled.onUpdateParams.sdkVisitor).not.toBe(null);
        expect(isReady).toEqual(true);
    });
    test('it should log a warning ignore "initialModifications" props if badly set', async () => {
        let computedFsVisitor: IFlagshipVisitor | null = null;
        let computedSdkConfig: FlagshipReactSdkConfig | null = null;
        const customFetchedModifications = { modifications: [...fetchedModifications] };

        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                initialModifications={customFetchedModifications as any} // <------- testing this
                onInitStart={() => {
                    isReady = true;
                }}
                onUpdate={(sdkData, sdkVisitor) => {
                    if (sdkData && sdkData.config) {
                        computedSdkConfig = sdkData.config;
                    }
                    if (sdkVisitor) {
                        computedFsVisitor = sdkVisitor;
                    }
                }}
            >
                <div>Hello</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });

        const modifications: DecisionApiCampaign[] | null =
            computedFsVisitor &&
            ((computedFsVisitor as IFlagshipVisitor).fetchedModifications as DecisionApiCampaign[]);

        const extractedLog = spyWarnLogs.mock.calls[0][0].split(' - ')[2];

        expect(extractedLog).toEqual(
            'initialModifications props is not correctly set and has been ignored, please check the documentation.'
        );

        expect(modifications).toEqual(null);

        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).envId).toEqual(providerProps.envId);
        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).context).toEqual(
            providerProps.visitorData.context
        );
        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).id).toEqual(providerProps.visitorData.id);
        expect(computedSdkConfig).toEqual({
            activateNow: false,
            enableConsoleLogs: true,
            enableErrorLayout: true,
            decisionMode: 'API',
            pollingInterval: null,
            enableSafeMode: true,
            fetchNow: true,
            apiKey: null,
            flagshipApi: 'https://decision-api.flagship.io/v1/',
            initialModifications: null,
            initialBucketing: null,
            nodeEnv: 'production'
        });
        expect(isReady).toEqual(true);
    });
    test('it should consider other props', async () => {
        let computedFsVisitor: IFlagshipVisitor | null = null;
        let computedSdkConfig: FlagshipReactSdkConfig | null = null;
        const customFetchedModifications = fetchedModifications as DecisionApiCampaign[];
        customFetchedModifications[0].variation.modifications.value = {
            discount: '99%'
        };
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                initialModifications={customFetchedModifications} // <------- testing this
                onInitStart={() => {
                    isReady = true;
                }}
                onUpdate={(sdkData, sdkVisitor) => {
                    if (sdkData && sdkData.config) {
                        computedSdkConfig = sdkData.config;
                    }
                    if (sdkVisitor) {
                        computedFsVisitor = sdkVisitor;
                    }
                }}
            >
                <div>Hello</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });

        const modifications: DecisionApiCampaign[] | null =
            computedFsVisitor &&
            ((computedFsVisitor as IFlagshipVisitor).fetchedModifications as DecisionApiCampaign[]);
        expect(modifications).toEqual(customFetchedModifications);

        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).envId).toEqual(providerProps.envId);
        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).context).toEqual(
            providerProps.visitorData.context
        );
        expect(computedFsVisitor && (computedFsVisitor as IFlagshipVisitor).id).toEqual(providerProps.visitorData.id);
        expect(computedSdkConfig).toEqual({
            activateNow: false,
            enableConsoleLogs: true,
            enableErrorLayout: true,
            enableSafeMode: true,
            decisionMode: 'API',
            pollingInterval: null,
            fetchNow: true,
            apiKey: null,
            flagshipApi: 'https://decision-api.flagship.io/v1/',
            initialModifications: customFetchedModifications,
            initialBucketing: null,
            nodeEnv: 'production'
        });
        expect(isReady).toEqual(true);
    });
    test('it should working safe mode in production env', async () => {
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
                onInitStart={() => {
                    throw new Error('crash test');
                }}
            >
                <div>Hello I'm visible, even with safe mode</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        expect(container.querySelector('#flagshipSafeModeContainer')?.innerHTML).toEqual(
            "<div>Hello I'm visible, even with safe mode</div>"
        );

        expect(isReady).toEqual(true);
    });
    test('it should not trigger safe mode in production env if the setting is disabled', async () => {
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                enableSafeMode={false}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
                onInitStart={() => {
                    throw new Error('crash test');
                }}
            >
                <div>Hello I'm visible, even with safe mode</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        expect(container.querySelector('#flagshipSafeModeContainer')?.innerHTML).toEqual(undefined);

        expect(isReady).toEqual(true);
    });
    test('it should working safe mode in development env', async () => {
        const { container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                nodeEnv="development"
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
                onInitStart={() => {
                    throw new Error('crash test');
                }}
            >
                <div>Hello I'm visible, even with safe mode</div>
            </FlagshipProvider>
        );
        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        // should display a bottom bar on the screen for developer to debug
        expect(container.querySelectorAll('.fsErrorDebugContainer').length).toEqual(1);
        expect(container.querySelectorAll('.fsErrorDebugContainer')[0].innerHTML.includes('crash test')).toEqual(true);

        expect(isReady).toEqual(true);
    });
});
