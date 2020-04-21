import { useFlagship } from '@flagship.io/react-sdk';
import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import CodeBlock from '../../../common/CodeBlock';

export const DemoUseFlagship = () => {
    const fsParams = {
        modifications: {
            requested: [
                {
                    key: 'btnColor',
                    defaultValue: 'green',
                    activate: false
                }
            ]
        }
    };
    const output = useFlagship(fsParams);
    const {
        modifications: fsModifications,
        status: fsStatus,
        hit: fsHit
    } = output;
    const demoHookName = 'useFlagship';
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to get the modifications
                        and the SDK status (more feature for this hook soon):
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`import { useFlagship } from '@flagship.io/react-sdk';
const fsParams = {
    modifications: {
        requested: [
            {
                key: 'btnColor',
                defaultValue: 'green',
                activate: false
            }
        ]
    }
}
const output = useFlagship(fsParams);
const {
    modifications: fsModifications,
    status: fsStatus,
    hit: fsHit,
} = output;`}
                    />
                    <p>fsModifications output: </p>
                    <div>
                        <button
                            style={{
                                backgroundColor: fsModifications.btnColor
                            }}
                        >
                            I'm a button customized with Flagship
                        </button>
                    </div>
                    <CodeBlock
                        className="mv3"
                        codeString={`<div>
    <button style={{ backgroundColor: ${fsModifications.btnColor} }}>
        I'm a button customized with Flagship
    </button>
</div>              `}
                    />
                    <p>fsStatus output: </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`
fsStatus=${JSON.stringify(fsStatus, null, 2)};
                        `}
                    />
                </Alert>
            </Col>
        </Row>
    );
};
