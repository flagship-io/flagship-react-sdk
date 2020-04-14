import CodeBlock from "@tenon-io/tenon-codeblock";
import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";

export const DemoInitialization = () => {
  const demoHookName = "initialization";
  return (
    <Row>
      <Col>
        <a className="fsAnchor" id={demoHookName} />
        <Alert variant="dark" className="fs-alert demoHook">
          <Alert.Heading>{demoHookName}</Alert.Heading>
          <p>
            Use <b>{demoHookName}</b> hook to get the modifications:
          </p>
          <CodeBlock className="mv3" codeString={`const todo = 'todo';`} />
          <p>Output: </p>
          <CodeBlock className="mv3" codeString={JSON.stringify({})} />
        </Alert>
      </Col>
    </Row>
  );
};
