import './App.css';

import { FlagshipProvider, FlagshipReactSdkConfig } from '@flagship.io/react-sdk';
import React, { createContext, Dispatch, SetStateAction } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { AppContainer } from './components/AppContainer';
import config from './config';
import AppHeader from './components/AppHeader';
import QaHeader from './components/QaHeader';
interface VisitorContext {
    [key: string]: any;
}
export interface SdkSettings extends FlagshipReactSdkConfig {
    envId: string;
    nodeEnv?: string;
    enableSafeMode?: boolean;
    enableErrorLayout?: boolean;
    flagshipApi?: string;
    apiKey: string | null;
    visitorData: {
        id: string;
        context: VisitorContext;
    };
}
export interface AppSettings {
    currentSettings: SdkSettings;
    setSettings: Dispatch<SetStateAction<SdkSettings>>;
    QA: QA;
    setQA: Dispatch<SetStateAction<QA>>;
}

export interface QA {
    enabled: boolean;
    show: {
        settingsModal: boolean;
    };
}

export const SettingContext = createContext<AppSettings | null>(null);

const App: React.FC = () => {
    const [currentSettings, setSettings] = React.useState<SdkSettings>({
        envId: config.envId,
        fetchNow: config.fetchNow,
        decisionMode: config.decisionMode as 'API',
        pollingInterval: config.pollingInterval,
        enableConsoleLogs: config.enableConsoleLogs,
        enableErrorLayout: config.enableErrorLayout,
        enableSafeMode: config.enableSafeMode,
        timeout: config.timeout,
        flagshipApi: config.flagshipApi,
        apiKey: config.apiKey,
        nodeEnv: 'production',
        visitorData: { ...config.visitorData }
    });
    const [QA, setQA] = React.useState<QA>({
        enabled: false,
        show: {
            settingsModal: false
        }
    });
    return (
        <>
            <SettingContext.Provider value={{ currentSettings, setSettings, QA, setQA }}>
                <FlagshipProvider
                    envId={currentSettings.envId}
                    fetchNow={currentSettings.fetchNow}
                    enableConsoleLogs={currentSettings.enableConsoleLogs}
                    enableErrorLayout={currentSettings.enableErrorLayout}
                    pollingInterval={currentSettings.pollingInterval}
                    flagshipApi={currentSettings.flagshipApi}
                    apiKey={currentSettings.apiKey}
                    timeout={currentSettings.timeout}
                    decisionMode={currentSettings.decisionMode}
                    enableSafeMode={true}
                    nodeEnv={currentSettings.nodeEnv}
                    visitorData={currentSettings.visitorData}
                    onInitStart={() => {
                        console.log('onInitStart - triggered');
                    }}
                    onInitDone={() => {
                        console.log('onInitDone - triggered');
                    }}
                    onUpdate={({ fsModifications }) => {
                        console.log('onUpdate - triggered');
                    }}
                    onBucketingSuccess={({ status }) => {
                        if (status === '200') {
                            NotificationManager.info('Bucketing has been updated (status = 200)');
                        }
                    }}
                    loadingComponent={
                        <Container className="mt5">
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
                    <NotificationContainer />
                    <AppHeader />
                    <QaHeader />
                    <AppContainer />
                </FlagshipProvider>
            </SettingContext.Provider>
        </>
    );
};

export default App;
