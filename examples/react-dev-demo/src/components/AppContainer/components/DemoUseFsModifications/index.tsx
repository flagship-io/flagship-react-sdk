import { useFsModifications } from '@flagship.io/react-sdk';
import React, { useContext } from 'react';
import { Alert, Col, Row, Button } from 'react-bootstrap';
import CodeBlock from '../../../common/CodeBlock';
import PlayWithParams from './components/normal/PlayWithParams';
import PlayWithParamsQA from './components/qa/PlayWithParams';
import { SettingContext, AppSettings } from '../../../../App';

export const DemoUseFsModifications = () => {
    const fsModifications = useFsModifications([
        {
            key: 'btnColor',
            defaultValue: 'green',
            activate: false
        }
    ]);
    const demoHookName = 'useFsModifications';
    const { QA } = useContext(SettingContext) as AppSettings;
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    {QA.enabled ? (
                        <PlayWithParamsQA></PlayWithParamsQA>
                    ) : (
                        <PlayWithParams></PlayWithParams>
                    )}
                </Alert>
            </Col>
        </Row>
    );
};
