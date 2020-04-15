import { useFsModifications } from "@flagship.io/react-sdk";
import CodeBlock from "@tenon-io/tenon-codeblock";
import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";

export const DemoUseFsModifications = () => {
  const fsModifications = useFsModifications([
    {
      key: "btnColor",
      defaultValue: "green",
      activate: false,
    },
  ]);
  const demoHookName = "useFsModifications";
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
          <CodeBlock
            className="mv3"
            codeString={JSON.stringify(fsModifications)}
          />
        </Alert>
      </Col>
    </Row>
  );
};
