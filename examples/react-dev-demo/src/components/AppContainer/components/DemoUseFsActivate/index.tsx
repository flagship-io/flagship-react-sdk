import { useFsActivate } from '@flagship.io/react-sdk';
import CodeBlock from '../../../common/CodeBlock';
import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

export const DemoUseFsActivate = () => {
    useFsActivate(['btnColor', 'otherKey1', 'otherKey2']);
    const demoHookName = 'useFsActivate';
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
                        codeString={`useFsActivate([
    'btnColor',
    'otherKey1',
    'otherKey2'
]);                        `}
                    />
                    <div>
                        In this example, keys{' '}
                        <i>btnColor, otherKey1, otherKey2</i> have been
                        activated. You can check on networks, a http request
                        "activate" for each key specified in the array.
                    </div>
                </Alert>
            </Col>
        </Row>
    );
};
