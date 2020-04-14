/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/accessible-emoji */
import CodeBlock from "@tenon-io/tenon-codeblock";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import "./App.css";
import Header from "./components/Header";
import { FlagshipProvider } from "@flagship.io/react-sdk";
import { AppContainer } from "./components/AppContainer";

const App: React.FC = () => (
  <>
    <FlagshipProvider
      envId="bn1ab7m56qolupi5sa0g"
      config={{
        fetchNow: true,
        enableConsoleLogs: true,
      }}
      onInitStart={() => {
        console.log("init start");
      }}
      onInitDone={() => {
        console.log("init done");
      }}
      visitorData={{
        id: "test-vid",
        context: {},
      }}
      loadingComponent={<div>Loading...</div>}
    >
      <Header />
      <AppContainer />
    </FlagshipProvider>
  </>
);

export default App;
