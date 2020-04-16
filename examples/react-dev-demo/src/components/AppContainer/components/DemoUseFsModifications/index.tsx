import { useFsModifications } from '@flagship.io/react-sdk';
import CodeBlock from '@tenon-io/tenon-codeblock';
import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

export const DemoUseFsModifications = () => {
    const demoHookName = 'useFsModifications';
    const fsModifications = useFsModifications([
        {
            key: 'btnColor',
            defaultValue: 'green',
            activate: false
        }
    ]);
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to get the modifications:
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`const todo = 'todo';`}
                    />
                    {/* <p>Output: </p>
                    <div>
                        <button style={{ color: fsModifications.btnColor }}>
                            I'm a button customized with Flagship
                        </button>
                    </div>
                    <CodeBlock
                        className="mv3"
                        codeString={`
              <div>
              <button style={{ color: ${fsModifications.btnColor} }}>
                  I'm a button customized with Flagship
              </button>
          </div>
              `}
                    /> */}
                </Alert>
            </Col>
        </Row>
    );
};
