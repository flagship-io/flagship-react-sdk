import { useContext, useState } from "react";
import { useFlagship } from "@flagship.io/react-sdk";
import { appContext } from "../../App";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";

export default function FlagInfo() {
  const [flagInfoOk, setFlagInfoOk] = useState<{
    error?: unknown;
    value?: unknown;
  }>({});
  const [flagName, setFlagName] = useState("");
  const { appState } = useContext(appContext);

  const fs = useFlagship();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appState.isSDKReady) {
      setFlagInfoOk({ error: ERROR_SDK_NOT_READY });
      return;
    }

    if (!appState.hasVisitor) {
      setFlagInfoOk({ error: ERROR_VISITOR_NOT_SET });
      return;
    }
    const flagInfo = fs.getModificationInfo(flagName);

    setFlagInfoOk({ value: flagInfo });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col-sm-3">
          <div className="form-group">
            <label>Flag key</label>
            <input
              type="text"
              className="form-control"
              placeholder="Key"
              value={flagName}
              onChange={(e) => setFlagName(e.target.value)}
            />
          </div>
        </div>
      </div>
      {flagInfoOk.error && (
        <div className="alert alert-warning mt-3 mb-3">
          {JSON.stringify(flagInfoOk.error)}
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>

      {flagInfoOk.value && (
        <div className="alert alert-success mt-3 mb-3">
          <pre>{JSON.stringify(flagInfoOk.value)}</pre>
        </div>
      )}
    </form>
  );
}
