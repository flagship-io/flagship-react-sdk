import CodeBlock from '../../../common/CodeBlock';
import React, { useContext } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';

import { AppSettings, SdkSettings, SettingContext } from '../../../../App';
import config from '../../../../config';
import PlayConfigQA from './components/qa/PlayConfig';
import PlayVisitorDataQA from './components/qa/PlayVisitorData';
import PlayVisitorData from './components/normal/PlayVisitorData';
import PlayConfig from './components/normal/PlayConfig';

export const DemoInitialization = () => {
    const name = 'initialization';
    const { currentSettings: currSettings, setSettings, QA } = useContext(
        SettingContext
    ) as AppSettings;
    const [newSettings, setNewSettings] = React.useState<SdkSettings>({
        ...currSettings
    });

    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={name} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{name}</Alert.Heading>
                    <p>
                        The <b>{name}</b> is proceed with{' '}
                        <b>FlagshipProvider</b>. In this demo app, it is plugged
                        like so:
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`import React from 'react';
import { FlagshipProvider } from "@flagship.io/react-sdk";

const App: React.FC = () => (
  <>
      <FlagshipProvider
      envId={${currSettings.envId}}
      config={
        ${JSON.stringify(currSettings.sdkConfig, null, 2)}
      }
      visitorData={
        ${JSON.stringify(currSettings.visitorData, null, 2)}
    }
      onInitStart={() => {
        console.log("init start");
      }}
      onInitDone={() => {
        console.log("init done");
      }}
      onUpdate={({ fsModifications }) => {
        console.log(
            'React SDK updated with modifications:' + JSON.stringify(fsModifications)
        );
      }}
      loadingComponent={
        <Container className="mt3">
          <Row>
            <Col xs={12}>Loading Flagship React SDK...</Col>
          </Row>
        </Container>
      }
    >
      <Header />
      <AppContainer />
    </FlagshipProvider>
  </>
);          `}
                    />
                    <p>
                        To understand impact of each props, you can change some
                        value dynamically here:{' '}
                    </p>
                    <h3
                        style={{
                            borderBottom: '1px solid grey',
                            marginBottom: '16px',
                            paddingBottom: '8px'
                        }}
                    >
                        1 - Playing with <i>config</i>
                    </h3>
                    {QA.enabled ? (
                        <PlayConfigQA></PlayConfigQA>
                    ) : (
                        <PlayConfig></PlayConfig>
                    )}
                    <h3
                        style={{
                            borderBottom: '1px solid grey',
                            marginBottom: '16px',
                            paddingBottom: '8px'
                        }}
                    >
                        2 - Playing with <i>visitorData</i>
                    </h3>
                    {QA.enabled ? (
                        <PlayVisitorDataQA></PlayVisitorDataQA>
                    ) : (
                        <PlayVisitorData></PlayVisitorData>
                    )}
                </Alert>
            </Col>
        </Row>
    );
};
