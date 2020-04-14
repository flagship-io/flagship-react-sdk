import { useFsActivate } from "@flagship.io/react-sdk";
import CodeBlock from "@tenon-io/tenon-codeblock";
import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";

export const DemoUseFsActivate = () => {
  const fsModifications = useFsActivate([
    {
      key: "btnColor",
      defaultValue: "green",
      activate: false,
    },
  ]);
  const demoHookName = "useFsActivate";
  return (
    <Row>
      <Col>
        <a className="fsAnchor" id={demoHookName} />
        <Alert variant="dark" className="fs-alert demoHook">
          <Alert.Heading>{demoHookName}</Alert.Heading>
          <p>
            Use <b>{demoHookName}</b> hook to get the modifications:
          </p>
          <CodeBlock
            className="mv3"
            codeString={`const fsModifications = useFsModificationsCache([{ key: "btn-color", defaultValue: "GREEN", activate: false }]);`}
          />
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
