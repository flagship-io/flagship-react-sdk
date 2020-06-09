import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { FlagshipProvider } from '../FlagshipContext';
import { useFlagship } from '../FlagshipHooks';
import { providerProps } from './mock';

const defaultParams = [
    {
        key: 'discount',
        defaultValue: '0%',
        activate: false
    }
];

describe('useFsModifications hook', () => {
    let isReady: boolean;
    let resultAfterApiCall;
    beforeAll(() => {
        //
    });
    beforeEach(() => {
        isReady = false;
    });
    afterEach(() => {
        //
    });
    test('it should give correct data when SDK not ready and update when it is', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }): any => (
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
            >
                {children}
            </FlagshipProvider>
        );
        const { result, waitForValueToChange } = renderHook(
            () => useFlagship({ modifications: { requested: defaultParams } }),
            {
                wrapper
            }
        );
        const resultBeforeApiCall = result.current;

        await waitForValueToChange(() => result.current);
        resultAfterApiCall = result.current;

        // BEFORE
        expect(resultBeforeApiCall.modifications).toEqual({
            discount: '0%'
        });
        expect(typeof resultBeforeApiCall.hit.send).toEqual('function');
        expect(typeof resultBeforeApiCall.hit.sendMultiple).toEqual('function');
        expect(resultBeforeApiCall.status.hasError).toEqual(false);
        expect(resultBeforeApiCall.status.isLoading).toEqual(true);
        expect(resultBeforeApiCall.status.lastRefresh).toEqual(null);
        // AFTER
        expect(resultAfterApiCall.modifications).toEqual({
            discount: '10%'
        });
        expect(typeof resultAfterApiCall.hit.send).toEqual('function');
        expect(typeof resultAfterApiCall.hit.sendMultiple).toEqual('function');
        expect(resultAfterApiCall.status.hasError).toEqual(false);
        expect(resultAfterApiCall.status.isLoading).toEqual(false);
        expect(typeof resultAfterApiCall.status.lastRefresh).toEqual('string');

        expect(isReady).toEqual(true);
    });
    test('it should give correct data when SDK not ready and update when it is, even when no arguments are set', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }): any => (
            <FlagshipProvider
                envId={providerProps.envId}
                {...providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
            >
                {children}
            </FlagshipProvider>
        );
        const { result, waitForValueToChange } = renderHook(
            () => useFlagship(),
            {
                wrapper
            }
        );
        const resultBeforeApiCall = result.current;

        await waitForValueToChange(() => result.current);
        resultAfterApiCall = result.current;

        // BEFORE
        expect(resultBeforeApiCall.modifications).toEqual({});
        expect(typeof resultBeforeApiCall.hit.send).toEqual('function');
        expect(typeof resultBeforeApiCall.hit.sendMultiple).toEqual('function');
        expect(resultBeforeApiCall.status.hasError).toEqual(false);
        expect(resultBeforeApiCall.status.isLoading).toEqual(true);
        expect(resultBeforeApiCall.status.lastRefresh).toEqual(null);
        // AFTER
        expect(resultAfterApiCall.modifications).toEqual({});
        expect(typeof resultAfterApiCall.hit.send).toEqual('function');
        expect(typeof resultAfterApiCall.hit.sendMultiple).toEqual('function');
        expect(resultAfterApiCall.status.hasError).toEqual(false);
        expect(resultAfterApiCall.status.isLoading).toEqual(false);
        expect(typeof resultAfterApiCall.status.lastRefresh).toEqual('string');

        expect(isReady).toEqual(true);
    });
});
