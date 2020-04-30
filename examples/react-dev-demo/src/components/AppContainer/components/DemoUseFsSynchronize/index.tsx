import { useFsSynchronize } from '@flagship.io/react-sdk';
import React from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';

import CodeBlock from '../../../common/CodeBlock';
import PlayWithSynchronize from './components/normal';

export const DemoUseFsSynchronize: React.FC = () => {
    const demoHookName = 'useFsSynchronize';
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <PlayWithSynchronize></PlayWithSynchronize>
                </Alert>
            </Col>
        </Row>
    );
};
