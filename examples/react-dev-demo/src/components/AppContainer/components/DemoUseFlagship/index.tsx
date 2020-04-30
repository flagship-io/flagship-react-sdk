import { useFlagship } from '@flagship.io/react-sdk';
import React from 'react';
import { Alert, Col, Row, Button, Nav } from 'react-bootstrap';
import CodeBlock from '../../../common/CodeBlock';
import { TransactionHit } from '@flagship.io/js-sdk';
import PlayWithHits from './components/normal/PlayWithHits';

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
    const { modifications: fsModifications } = output;
    const { status: fsStatus, hit: fsHit } = useFlagship();
    const demoHookName = 'useFlagship';
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to get access to further
                        stuff such as <i>modifications</i>, <i>sdk status</i>,{' '}
                        <i>hits</i> :
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
const {
    modifications: fsModifications,
    status: fsStatus,
    hit: fsHit,
} = useFlagship(fsParams);`}
                    />
                    <h3>
                        1 - Playing with <i>fsModifications</i>
                    </h3>
                    <p>demo: </p>
                    <div>
                        <Button
                            variant="secondary"
                            style={{
                                backgroundColor: fsModifications.btnColor
                            }}
                        >
                            {`I'm a button customized with Flagship (backgroundColor=${fsModifications.btnColor})`}
                        </Button>
                    </div>
                    <CodeBlock
                        className="mv3"
                        codeString={`<Button
    variant="secondary"
    style={{
        backgroundColor: fsModifications.btnColor
    }}
>
    {\`I'm a button customized with Flagship (backgroundColor=\${fsModifications.btnColor})\`}
</Button>`}
                    />
                    <h3>
                        2 - Playing with <i>fsStatus</i>
                    </h3>
                    <div style={{ marginBottom: 16 }}>
                        If you're not familiar with the payload that you should
                        a provide to the hit you want to send, you'll have all
                        details available in the{' '}
                        <a href="https://github.com/abtasty/flagship-js-sdk/blob/master/README.md#shape-of-possible-hits-to-send-1">
                            SDK JS Hit documentation
                        </a>
                        .
                    </div>
                    <p>demo with Transaction Hit: </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`
fsStatus=${JSON.stringify(fsStatus, null, 2)};
                        `}
                    />
                    <div className="fsAnchor" id="sendHits"></div>
                    <h3>
                        3 - Playing with <i>hits</i>
                    </h3>
                    <PlayWithHits></PlayWithHits>
                </Alert>
            </Col>
        </Row>
    );
};
