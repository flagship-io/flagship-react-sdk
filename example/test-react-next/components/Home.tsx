import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useFlagship, useFsFlag } from "../../../";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { HitType } from "@flagship.io/js-sdk";
import { useContext } from "react";
import { appContext } from "../pages/_app";


let count = 0
const Home: NextPage = () => {
  const context = useContext(appContext)
  const fs = useFlagship();

  const btnColorFlag = useFsFlag("js-qa-app", "default");

  const onSendHitClick = () => {
    fs.hit.sendMultiple([
      { type: HitType.PAGE_VIEW, documentLocation: "abtastylab" },
      { type: HitType.SCREEN, documentLocation: "abtastylab" },
    ]);
  };

  const onChangeVisitorIdClick = () => {
    count++;
    if (count === 5 || count === 7) {
      context.setVisitorData({});
      return;
    }
    context.setVisitorData((prev) => ({
      ...prev,
      id: "my_visitor_id_" + count,
      context: {
        age: 20,
        cacheEnabled: true,
      },
    }));
  };

  return (
    <div className={styles.container}>
     

      <main className={styles.main}>
      
      <div>
        <button
          style={{ width: 100, height: 50 }}
          onClick={() => {
            onChangeVisitorIdClick();
          }}
        >Change visitor Id</button>
      </div>

        <p>flag: js-qa-app</p>
        <p>value: {btnColorFlag.getValue()}</p>

        <button
          style={{ width: 100, height: 50 }}
          onClick={() => {
            onSendHitClick();
          }}
        > Send hits</button>

      </main>

    
    </div>
  );
};

export default Home;
