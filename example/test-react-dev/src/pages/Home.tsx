import { useContext } from "react";
import { appContext } from "../App";
import Environment from "../components/index/Environment";

export default function Home() {
  const { appState } = useContext(appContext);
  return <>{appState.featureFlags.env && <Environment />}</>;
}
