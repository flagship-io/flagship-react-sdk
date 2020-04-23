import { useFsSynchronize } from '@flagship.io/react-sdk';
import React from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';

import CodeBlock from '../../../common/CodeBlock';

export const DemoUseFsSynchronize: React.FC = () => {
    const [listenedValue, setValue] = React.useState(false);
    const [activateAllModifications, setActivate] = React.useState(false);
    useFsSynchronize([listenedValue], activateAllModifications);
    const demoHookName = 'useFsSynchronize';
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to trigger activation of
                        a modification:
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`useFsActivate([listenedValue], activateAllModifications);`}
                    ></CodeBlock>
                    <Form>
                        <Form.Group controlId="demoFsSynchronize.ControlSelect1">
                            <Form.Label>Playing with 1st argument</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={listenedValue}
                                onChange={(e) =>
                                    setValue(e.currentTarget.checked)
                                }
                                label={`listenedValue=${listenedValue}`}
                            />
                        </Form.Group>
                        <Form.Group controlId="demoFsSynchronize.ControlSelect2">
                            <Form.Label>Playing with 2nd argument</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={activateAllModifications}
                                onChange={(e) =>
                                    setActivate(e.currentTarget.checked)
                                }
                                label={`activateAllModifications=${activateAllModifications}`}
                            />
                        </Form.Group>
                    </Form>
                    <div>
                        When <b>listenedValue</b> value changed, it will trigger
                        a synchronize as it is set in the first argument of{' '}
                        <b>useFsActivate</b>.
                    </div>
                    <div>
                        You can also notice that enabling{' '}
                        <b>activateAllModifications</b> to true will modify the
                        payload sent to the Flagship API and thus trigger an
                        activate.
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};
