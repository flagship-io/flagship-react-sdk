import { useFsSynchronize } from '@flagship.io/react-sdk';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import React from 'react';
import { Alert, Col, Row, Form } from 'react-bootstrap';
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
                            <Form.Label>listenedValue</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={listenedValue}
                                onClick={(e) =>
                                    setValue(e.currentTarget.checked)
                                }
                                label={`listenedValue=${listenedValue}`}
                            />
                        </Form.Group>
                        <Form.Group controlId="demoFsSynchronize.ControlSelect2">
                            <Form.Label>listenedValue</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={activateAllModifications}
                                onClick={(e) =>
                                    setActivate(e.currentTarget.checked)
                                }
                                label={`activateAllModifications=${activateAllModifications}`}
                            />
                        </Form.Group>
                    </Form>
                    <div>
                        Switch value of <b>listenedValue</b> will trigger a
                        synchronize as it is set in the first argument of{' '}
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
