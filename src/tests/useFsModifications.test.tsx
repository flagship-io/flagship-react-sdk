import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { FlagshipProvider } from '../FlagshipContext';
import { useFsModifications } from '../FlagshipHooks';
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

    beforeAll(() => {
        //
    });
    beforeEach(() => {
        isReady = false;
    });
    afterEach(() => {
        //
    });
    test('it should mock the context', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }): any => (
            <FlagshipProvider
                envId={providerProps.envId}
                config={providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
            >
                {children}
            </FlagshipProvider>
        );
        const { result, waitForValueToChange } = renderHook(
            () => useFsModifications(defaultParams),
            {
                wrapper
            }
        );
        const resultBeforeApiCall = result.current;
        // await waitForValueToChange(() => isReady);
        await waitForValueToChange(() => result.current);
        const resultAfterApiCall = result.current;

        expect(resultBeforeApiCall).toEqual({
            discount: '0%'
        });
        expect(resultAfterApiCall).toEqual({
            discount: '10%'
        });
        expect(isReady).toEqual(true);
    });
});
