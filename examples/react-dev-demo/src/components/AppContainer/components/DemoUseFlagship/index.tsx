import { useFlagship } from '@flagship.io/react-sdk';
import React, { useContext } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { AppSettings, SettingContext } from '../../../../App';
import CodeBlock from '../../../common/CodeBlock';
import PlayWithHits from './components/normal/PlayWithHits';
import PlayWithModificationInfo from './components/normal/PlayWithModificationInfo';
import PlayWithModifications from './components/normal/PlayWithModifications';
import PlayWithHitsQA from './components/qa/PlayWithHits';
import PlayWithModificationInfoQA from './components/qa/PlayWithModificationInfo';
import PlayWithModificationsQA from './components/qa/PlayWithModifications';

export const DemoUseFlagship = () => {
    const { status: fsStatus } = useFlagship();
    const demoHookName = 'useFlagship';
    const { QA } = useContext(SettingContext) as AppSettings;
    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={demoHookName} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{demoHookName}</Alert.Heading>
                    <p>
                        Use <b>{demoHookName}</b> hook to get access to further stuff such as <i>modifications</i>,{' '}
                        <i>sdk status</i>, <i>hits</i> :
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

                    <p>It gives you some information about the current status of the SDK:</p>
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
                    {QA.enabled ? <PlayWithHitsQA></PlayWithHitsQA> : <PlayWithHits></PlayWithHits>}
                    <div className="fsAnchor" id="getModificationInfos"></div>
                    <h3 className="mt3">
                        4 - Get modification <i>informations</i>
                    </h3>
                    {!QA.enabled && <PlayWithModificationInfo></PlayWithModificationInfo>}
                    <PlayWithModificationInfoQA></PlayWithModificationInfoQA>
                </Alert>
            </Col>
        </Row>
    );
};
