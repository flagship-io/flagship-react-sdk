import './App.css';

import { FlagshipProvider } from '@flagship.io/react-sdk';
import React, { createContext, Dispatch, SetStateAction } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { AppContainer } from './components/AppContainer';
import config from './config';
import AppHeader from './components/AppHeader';
interface VisitorContext {
    [key: string]: any;
}
export interface SdkSettings {
    envId: string;
    sdkConfig: {
        fetchNow: boolean;
        enableConsoleLogs: boolean;
    };
    visitorData: {
        id: string;
        context: VisitorContext;
    };
}
export interface AppSettings {
    currentSettings: SdkSettings;
    setSettings: Dispatch<SetStateAction<SdkSettings>>;
}

export const SettingContext = createContext<{
    currentSettings: SdkSettings;
    setSettings: Dispatch<SetStateAction<SdkSettings>>;
} | null>(null);

const App: React.FC = () => {
    const [currentSettings, setSettings] = React.useState<SdkSettings>({
        envId: config.envId,
        sdkConfig: { ...config.sdkConfig },
        visitorData: { ...config.visitorData }
    });
    return (
        <>
            <SettingContext.Provider value={{ currentSettings, setSettings }}>
                <FlagshipProvider
                    envId={currentSettings.envId}
                    config={currentSettings.sdkConfig}
                    visitorData={currentSettings.visitorData}
                    onInitStart={() => {
                        console.log('init start');
                    }}
                    onInitDone={() => {
                        console.log('init done');
                    }}
                    loadingComponent={
                        <Container className="mt3">
                            <Row>
                                <Col
                                    xs={12}
                                    style={{
                                        color: 'white',
                                        height: '100vh',
                                        fontSize: '5vw'
                                    }}
                                >
                                    Loading Flagship React SDK...
                                </Col>
                            </Row>
                        </Container>
                    }
                >
                    <AppHeader />
                    <AppContainer />
                </FlagshipProvider>
            </SettingContext.Provider>
        </>
    );
};

export default App;
