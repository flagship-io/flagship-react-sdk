import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import { FlagshipProvider } from '../FlagshipContext';
import { providerProps, apiAnswers } from './mock';

// configure({ adapter: new Adapter() });
const defaultParams = [
    {
        key: 'discount',
        defaultValue: '0%',
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

describe('fsContext provider', () => {
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
    test('it should call Flagship API when mount', async () => {
        const { getByText, container } = render(
            <FlagshipProvider
                envId={providerProps.envId}
                config={providerProps.config}
                visitorData={providerProps.visitorData}
                onInitDone={() => {
                    isReady = true;
                }}
                loadingComponent={<div>Loading SDK</div>}
            >
                <div>Hello</div>
            </FlagshipProvider>
        );
        expect(container.querySelector('div')?.innerHTML).toEqual(
            'Loading SDK'
        );

        await waitFor(() => {
            if (!isReady) {
                throw new Error('not ready');
            }
        });
        expect(container.querySelector('div')?.innerHTML).toEqual('Hello');
        expect(isReady).toEqual(true);
    });
});
