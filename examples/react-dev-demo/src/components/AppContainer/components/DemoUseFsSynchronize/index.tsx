import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

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
