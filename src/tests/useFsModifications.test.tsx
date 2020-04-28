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
    let resultAfterApiCall;
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
    beforeAll(() => {
        //
    });
    beforeEach(() => {
        isReady = false;
    });
    afterEach(() => {
        //
    });
    test('it should give default value when SDK not ready and update when it is', async () => {
        // await waitForValueToChange(() => isReady);
        await waitForValueToChange(() => result.current);
        resultAfterApiCall = result.current;

        expect(resultBeforeApiCall).toEqual({
            discount: '0%'
        });
        expect(resultAfterApiCall).toEqual({
            discount: '10%'
        });
        expect(isReady).toEqual(true);
    });
});
