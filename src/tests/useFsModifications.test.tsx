import { renderHook, WaitOptions } from '@testing-library/react-hooks';
import React from 'react';
import mockAxios from 'jest-mock-axios';
import { shallow } from 'enzyme';
import { useFsModifications } from '../FlagshipHooks';
import FlagshipContext, {
    FsStatus,
    FlagshipProvider
} from '../FlagshipContext';
import { defaultContext, providerProps, apiAnswers } from './mock/index';

const defaultParams = [
    {
        key: 'btnColor',
        defaultValue: 'green',
        activate: false
    },
    {
        key: 'psp',
        defaultValue: 'null',
        activate: false
    }
];

const responseObj = {
    data: {
        ...apiAnswers.oneModifInMoreThanOneCampaign
    },
    status: 200,
    statusText: 'OK'
};

describe('useFsModifications hook', () => {
    afterEach(() => {
        mockAxios.reset();
    });
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
        const { result, waitForValueToChange } = renderHook(
            () => useFsModifications(defaultParams),
            {
                wrapper
            }
        );
        const promise = waitForValueToChange(() => isReady);
        mockAxios.mockResponse(responseObj);
        await promise;
        // expect(result.error).toEqual(Error("It's over 9000!"));
        // expect(mockAxios.post).toHaveBeenCalledWith(
        //     `https://decision-api.flagship.io/v1/${providerProps.envId}/campaigns?mode=normal`,
        //     {
        //         context: '',
        //         trigger_hit: false,
        //         visitor_id: ''
        //     }
        // );

        expect(result.current).toEqual({
            btnColor: 'green',
            psp: 'null'
        });
    });
});
