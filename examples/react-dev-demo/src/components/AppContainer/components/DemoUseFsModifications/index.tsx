import React, { useContext } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { AppSettings, SettingContext } from '../../../../App';
import PlayWithParams from './components/normal/PlayWithParams';
import PlayWithParamsQA from './components/qa/PlayWithParams';

export const DemoUseFsModifications = () => {
    const demoHookName = 'useFsModifications';
    const { QA } = useContext(SettingContext) as AppSettings;
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    {QA.enabled ? <PlayWithParamsQA></PlayWithParamsQA> : <PlayWithParams></PlayWithParams>}
                </Alert>
            </Col>
        </Row>
    );
};
