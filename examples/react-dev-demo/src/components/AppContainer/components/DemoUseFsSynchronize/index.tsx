import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import PlayWithSynchronize from './components/normal';

export const DemoUseFsSynchronize: React.FC = () => {
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id="campaignsSynchronization" />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>Campaigns synchronization</Alert.Heading>
                    <PlayWithSynchronize></PlayWithSynchronize>
                </Alert>
            </Col>
        </Row>
    );
};
