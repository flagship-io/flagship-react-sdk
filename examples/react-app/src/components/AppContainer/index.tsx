/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from 'react';
import {
  Alert, Button, Col, Container, Row,
} from 'react-bootstrap';
import { useFsModificationsCache } from "@flagship.io/react-sdk";
import CodeBlock from '@tenon-io/tenon-codeblock';

export const AppContainer = () => {
    const modifs = useFsModificationsCache([
        { key: "btn-color", defaultValue: "GREEN", activate: false },
      ]);
    return (
        <Container className="mt3">
        <Row>
          <Col>
            <a className="fsAnchor" id="initialization" />
            <Alert variant="dark" className="fs-alert">
              <Alert.Heading>Test</Alert.Heading>
             <p>Use <b>useFsModificationsCache</b> hook to get the modifications:</p>
              <CodeBlock
                className="mv3"
                codeString={`const modifs = useFsModificationsCache([{ key: "btn-color", defaultValue: "GREEN", activate: false }]);`}
              />
             <p>Output: </p>
             <CodeBlock
                className="mv3"
                codeString={JSON.stringify(modifs)}
              />
            </Alert>
          </Col>
        </Row>
      </Container>
    )
}