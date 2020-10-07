import React, { useContext } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { AppSettings, SettingContext } from '../../../../App';
import CodeBlock from '../../../common/CodeBlock';
import PlayConfig from './components/normal/PlayConfig';
import PlayVisitorData from './components/normal/PlayVisitorData';
import PlayConfigQA from './components/qa/PlayConfig';
import PlayVisitorDataQA from './components/qa/PlayVisitorData';

export const DemoInitialization = () => {
    const name = 'initialization';
    const { currentSettings: currSettings, QA /* setSettings */ } = useContext(SettingContext) as AppSettings;

    return (
        <Row>
            <Col>
                <div className="fsAnchor" id={name} />
                <Alert variant="dark" className="fs-alert demoHook">
                    <Alert.Heading>{name}</Alert.Heading>
                    <p>
                        The <b>{name}</b> is proceed with <b>FlagshipProvider</b>. In this demo app, it is plugged like
                        so:
                    </p>
                    <CodeBlock
                        className="mv3"
                        codeString={`import React from 'react';
import { FlagshipProvider } from "@flagship.io/react-sdk";

const App: React.FC = () => (
  <>
      <FlagshipProvider
      envId={${currSettings.envId}}
      fetchNow={${typeof currSettings.fetchNow === 'undefined' ? 'false' : currSettings.fetchNow.toString()}}
      activateNow={${typeof currSettings.activateNow === 'undefined' ? 'false' : currSettings.activateNow.toString()}}
      enableConsoleLogs={${
          typeof currSettings.enableConsoleLogs === 'undefined' ? 'false' : currSettings.enableConsoleLogs.toString()
      }}
      decisionMode="${typeof currSettings.decisionMode === 'undefined' ? 'API' : currSettings.decisionMode.toString()}"
      pollingInterval={${
          typeof currSettings.pollingInterval === 'undefined' ? 'undefined' : currSettings.pollingInterval?.toString()
      }} // minute(s)
      timeout={${typeof currSettings.timeout === 'undefined' ? '2' : currSettings.timeout?.toString()}} // second(s)
      enableErrorLayout={${
          typeof currSettings.enableErrorLayout === 'undefined' ? 'false' : currSettings.enableErrorLayout.toString()
      }}
      enableSafeMode={${
          typeof currSettings.enableSafeMode === 'undefined' ? 'false' : currSettings.enableSafeMode.toString()
      }}
      nodeEnv="${typeof currSettings.nodeEnv === 'undefined' ? 'undefined' : currSettings.nodeEnv.toString()}"
      flagshipApi="${
          typeof currSettings.flagshipApi === 'undefined' ? 'undefined' : currSettings.flagshipApi.toString()
      }"
      apiKey="${!currSettings.apiKey ? 'null' : currSettings.apiKey.toString()}"
      visitorData=${JSON.stringify(currSettings.visitorData, null, 8).slice(0, -2)}
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
                    <p>To understand impact of each props, you can change some value dynamically here: </p>
                    <h3
                        id="playWithConfig"
                        style={{
                            borderBottom: '1px solid grey',
                            marginBottom: '16px',
                            paddingBottom: '8px'
                        }}
                    >
                        1 - Playing with <i>sdk settings</i>
                    </h3>
                    {QA.enabled ? <PlayConfigQA></PlayConfigQA> : <PlayConfig></PlayConfig>}
                    <h3
                        style={{
                            borderBottom: '1px solid grey',
                            marginBottom: '16px',
                            paddingBottom: '8px'
                        }}
                    >
                        2 - Playing with <i>visitorData</i>
                    </h3>
                    {QA.enabled ? <PlayVisitorDataQA></PlayVisitorDataQA> : <PlayVisitorData></PlayVisitorData>}
                </Alert>
            </Col>
        </Row>
    );
};
