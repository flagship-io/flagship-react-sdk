import { useContext, useState } from "react";
import { useFlagship } from "@flagship.io/react-sdk";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";
import { appContext } from "../../App";

export default function FlagActivate() {
  const [activateOk, setActivateOk] = useState({ error: "", ok: false });
  const [flagName, setFlagName] = useState("");

  const { appState } = useContext(appContext);
  const fs = useFlagship();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appState.isSDKReady) {
      setActivateOk({ error: ERROR_SDK_NOT_READY, ok: false });
      return;
    }

    if (!appState.hasVisitor) {
      setActivateOk({ error: ERROR_VISITOR_NOT_SET, ok: false });
      return;
    }
    fs.activateModification([flagName]);
    setActivateOk({ error: "", ok: true });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col-sm-3">
          <div className="form-group">
            <label>Flag key</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Key"
              value={flagName}
              onChange={(e) => setFlagName(e.target.value)}
            />
          </div>
        </div>
      </div>
      {activateOk.error && (
        <div className="alert alert-warning mt-3 mb-3">
          {JSON.stringify(activateOk.error)}
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>

      {activateOk.ok && (
        <div className="alert alert-success mt-3 mb-3">
          {"successful operation"}
        </div>
      )}
    </form>
  );
}
