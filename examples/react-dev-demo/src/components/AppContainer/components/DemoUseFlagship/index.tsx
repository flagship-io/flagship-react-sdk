import { useFlagship } from '@flagship.io/react-sdk';
import React, { useContext } from 'react';
import { Alert, Col, Row, Button, Nav } from 'react-bootstrap';
import CodeBlock from '../../../common/CodeBlock';
import { TransactionHit } from '@flagship.io/js-sdk';
import PlayWithHits from './components/normal/PlayWithHits';
import { SettingContext, AppSettings } from '../../../../App';
import PlayWithModificationsQA from './components/qa/PlayWithModifications';
import PlayWithModifications from './components/normal/PlayWithModifications';

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
    const { QA } = useContext(SettingContext) as AppSettings;
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
                    {QA.enabled ? (
                        <PlayWithModificationsQA></PlayWithModificationsQA>
                    ) : (
                        <PlayWithModifications></PlayWithModifications>
                    )}
                    <h3>
                        2 - Reading <i>fsStatus</i>
                    </h3>

                    <p>
                        It gives you some information about the current status
                        of the SDK:
                    </p>
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
