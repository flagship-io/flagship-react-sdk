import { useContext } from "react";
import { appContext } from "../App";
import Environment from "../components/index/Environment";
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
  return (
    <>
      {appState.featureFlags.env && <EnvironmentSection />}
      {appState.featureFlags.visitor && <VisitorSection />}
    </>
  );
}
