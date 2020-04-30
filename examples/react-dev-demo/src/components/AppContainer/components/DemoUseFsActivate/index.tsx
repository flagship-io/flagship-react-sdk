import React, { useContext } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import PlayWithActivate from './components/normal';
import { AppSettings, SettingContext } from '../../../../App';
import PlayWithActivateQA from './components/qa';

export const DemoUseFsActivate: React.FC = () => {
    const demoHookName = 'useFsActivate';
    const { QA } = useContext(SettingContext) as AppSettings;
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    {QA.enabled ? (
                        <PlayWithActivateQA></PlayWithActivateQA>
                    ) : (
                        <PlayWithActivate></PlayWithActivate>
                    )}
                </Alert>
            </Col>
        </Row>
    );
};
