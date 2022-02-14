import {  IFlag } from "@flagship.io/js-sdk";
import { useContext, useState } from "react";
import { appContext } from "../App";
import Environment from "../components/index/Environment";
import ExperienceContinuity from "../components/index/ExperienceContinuity";
import FlagActivate from "../components/index/FlagActivate";
import FlagActivate3 from "../components/index/FlagActivate3";
import FlagInfo from "../components/index/FlagInfo";
import FlagInfo3 from "../components/index/FlagInfo3";
import FlagValue from "../components/index/FlagValue";
import FlagValue3 from "../components/index/FlagValue3";
import Visitor from "../components/index/Visitor";


export type FlagData = {
  key?: string;
  defaultValue?: string;
  flag?: IFlag<unknown>
  type?:string
  activate?:boolean
  value?:unknown
}

export default function Home() {
  const { appState } = useContext(appContext);

  const [flagData, setFlagData] = useState<FlagData>()

  const EnvironmentSection = () => (
    <div>
      <h2>First, set your Flagship Environment ID & API Key</h2>
      <Environment />
    </div>
  );
  const VisitorSection = () => (
    <div>
      <h2 className="mt-5">Then, set your Visitor ID and context</h2>
      <Visitor />
    </div>
  );

  const FlagValueSection = () => (
    <div>
      <h2 className="mt-5">Then, get a Flag Value</h2>
      <FlagValue />
    </div>
  );

  const FlagValue3Section = () => (
    <div>
      <h2 className="mt-5">Then, get a Flag Value</h2>
      <FlagValue3 flagData={flagData} setFlagData={setFlagData} />
    </div>
  );

  const FlagActivateSection = () => {
    return (
      <div>
        <h2 className="mt-5">Stand alone activate modification</h2>
        <FlagActivate />
      </div>
    );
  };

  const FlagActivate3Section = () => {
    return (
      <div>
        <h2 className="mt-5">Stand alone activate modification</h2>
        <FlagActivate3 flagData={flagData} />
      </div>
    );
  };

  const FlagInfoSection = () => {
    return (
      <div>
        <h2 className="mt-5">Get modification information</h2>
        <FlagInfo />
      </div>
    );
  };

  const FlagInfo3Section = () => {
    return (
      <div>
        <h2 className="mt-5">Get modification information</h2>
        <FlagInfo3 flagData={flagData} />
      </div>
    );
  };

  return (
    <>
      {appState.featureFlags.env && <EnvironmentSection />}
      {appState.featureFlags.visitor && <VisitorSection />}
      {appState.featureFlags.experienceContinuity && <ExperienceContinuity />}
      {appState.featureFlags.flagValue && <FlagValueSection />}
      {appState.featureFlags.flagValue3 && <FlagValue3Section />}
      {appState.featureFlags.flagActivate && <FlagActivateSection />}
      {appState.featureFlags.flagActivate3 && <FlagActivate3Section />}
      {appState.featureFlags.flagInfo && <FlagInfoSection />}
      {appState.featureFlags.flagInfo3 && <FlagInfo3Section />}
    </>
  );
}
