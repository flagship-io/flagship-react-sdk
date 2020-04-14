import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useFsModificationsCache } from "@flagship.io/react-sdk";
import CodeBlock from "@tenon-io/tenon-codeblock";
import { DemoInitialization } from "./components/DemoInitialization";
import { DemoUseFsModifications } from "./components/DemoUseFsModifications";
import { DemoUseFsModificationsCache } from "./components/DemoUseFsModificationsCache";

export const AppContainer = () => {
  const fsModifications = useFsModificationsCache([
    {
      key: "btn-color",
      defaultValue: "GREEN",
      activate: false,
    },
  ]);
  return (
    <Container className="mt3">
      <DemoInitialization />
      <DemoUseFsModifications />
      <DemoUseFsModificationsCache />
    </Container>
  );
};
