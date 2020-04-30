import React, { useContext } from 'react';
import { Alert, Col, Row, Button } from 'react-bootstrap';
import { SettingContext, AppSettings } from '../../../../App';

export const DemoErrorBoundary = () => {
    const demoHookName = 'Safe Mode';
    const [triggerError, setTriggerError] = React.useState(false);
    React.useEffect(() => {
        if (triggerError) {
            throw new Error('Flagship - Creating an error just for test...');
        }
        setTriggerError(false);
    }, [triggerError]);

    const { currentSettings, setSettings, QA } = useContext(
        SettingContext
    ) as AppSettings;
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
                        crash.
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
                        {currentSettings.sdkConfig.nodeEnv === 'production' && (
                            <div className="mv3">
                                <b>NOTE:</b> You might not see the banner
                                because you are in 'production' environment. You
                                need to change value of <i>nodeEnv</i> in{' '}
                                <a href="#playWithConfig">SDK settings</a>.
                            </div>
                        )}
                        {!currentSettings.sdkConfig.enableErrorLayout && (
                            <div className="mv3">
                                <b>NOTE:</b> You might not see the banner
                                because the setting <i>enableErrorLayout</i> is
                                disabled, you need to change the value in{' '}
                                <a href="#playWithConfig">SDK settings</a>.
                            </div>
                        )}
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};
