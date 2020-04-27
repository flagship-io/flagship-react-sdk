import React from 'react';
import { Alert, Col, Row, Button } from 'react-bootstrap';

export const DemoErrorBoundary = () => {
    const demoHookName = 'Safe Mode';
    const [triggerError, setTriggerError] = React.useState(false);
    React.useEffect(() => {
        if (triggerError) {
            throw new Error('Flagship - Creating an error just for test...');
        }
        setTriggerError(false);
    }, [triggerError]);
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id="safeMode" />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        When an error occurs unexpectedly, the React SDK switch
                        automatically into <b>{demoHookName}</b>. Thus, default
                        value of modifications will always be returned.
                        Moreover, other features will just log an error without
                        crash. In a node environment other than{' '}
                        <i>production</i>, you can enable
                        <i>enableErrorLayout</i> attribute, in the SDK settings{' '}
                        <a href="#initialization">(Check above)</a>.
                    </p>
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setTriggerError(true);
                            }}
                        >
                            Throw an error
                        </Button>
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};
