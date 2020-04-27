import { renderHook, WaitOptions } from '@testing-library/react-hooks';
import React from 'react';
import { shallow } from 'enzyme';
import { useFsModifications } from '../FlagshipHooks';
import FlagshipContext, {
    FsStatus,
    FlagshipProvider
} from '../FlagshipContext';
import { defaultContext, providerProps } from './mock/index';

const defaultParams = [
    {
        key: 'btnColor',
        defaultValue: 'green',
        activate: false
    }
];

// const waitSdkReady = async (waitForNextUpdate: WaitOptions | undefined) => {
//     await waitForNextUpdate();
// };

describe('useFsModifications hook', () => {
    test('it should mock the context', async () => {
        let isReady = false;
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
        const { result, wait } = renderHook(
            () => useFsModifications(defaultParams),
            {
                wrapper
            }
        );
        await wait(() => isReady);
        // expect(result.error).toEqual(Error("It's over 9000!"));
        expect(result.current).toEqual({
            btnColor: 'green'
        });
    });
});
