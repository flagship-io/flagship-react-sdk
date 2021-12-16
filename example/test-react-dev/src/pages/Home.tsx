import { useContext } from "react";
import { appContext } from "../App";
import Environment from "../components/index/Environment";
import ExperienceContinuity from "../components/index/ExperienceContinuity";
import FlagActivate from "../components/index/FlagActivate";
import FlagInfo from "../components/index/FlagInfo";
import FlagValue from "../components/index/FlagValue";
import Visitor from "../components/index/Visitor";

export default function Home() {
  const { appState } = useContext(appContext);

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

  const FlagActivateSection = () => {
    return (
      <div>
        <h2 className="mt-5">Stand alone activate modification</h2>
        <FlagActivate />
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

  return (
    <>
      {appState.featureFlags.env && <EnvironmentSection />}
      {appState.featureFlags.visitor && <VisitorSection />}
      {appState.featureFlags.experienceContinuity && <ExperienceContinuity />}
      {appState.featureFlags.flagValue && <FlagValueSection />}
      {appState.featureFlags.flagActivate && <FlagActivateSection />}
      {appState.featureFlags.flagInfo && <FlagInfoSection />}
    </>
  );
}
