import { useContext, useState } from "react";
import { useFlagship } from "@flagship.io/react-sdk";
import { appContext } from "../../App";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";

export default function FlagValue() {
  const [flagKey, setFlagKey] = useState<string>("");
  const [flagDefaultValue, setFlagDefaultValue] = useState<string>("");
  const [flagType, setFlagType] = useState<string>("bool");
  const [flagActivate, setFlagActivate] = useState<boolean>(false);
  const [flagOk, setFlagOk] = useState<{ value?: unknown; error: unknown }>({
    value: "",
    error: "",
  });
  const { appState } = useContext(appContext);
  const fs = useFlagship();

  const checkFlagType = () => {
    let value: any = flagDefaultValue;

    switch (flagType) {
      case "bool":
        try {
          value = JSON.parse(flagDefaultValue);
          if (typeof value !== "boolean") {
            setFlagOk({ error: "Default value must be a boolean" });
            return null;
          }
        } catch (error) {
          setFlagOk({ error: "Default value must be a boolean" });
          return null;
        }

        break;
      case "double":
      case "int":
      case "long":
      case "float":
        value = Number(flagDefaultValue);
        if (isNaN(value)) {
          setFlagOk({ error: "Default value must be a number" });
          return null;
        }
        break;
      case "JSONArray":
        try {
          value = JSON.parse(flagDefaultValue);
          if (!Array.isArray(value)) {
            setFlagOk({ error: "Default value must be an array" });
            return null;
          }
        } catch (error) {
          setFlagOk({ error: "Default value must be an array" });
          return null;
        }
        break;
      case "JSONObject":
        try {
          value = JSON.parse(flagDefaultValue);
          if (typeof value !== "object" || Array.isArray(value)) {
            setFlagOk({ error: "Default value must be an object" });
            return null;
          }
        } catch (error) {
          setFlagOk({ error: "Default value must be an object" });
          return null;
        }
        break;
    }
    return value;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appState.isSDKReady) {
      setFlagOk({ error: ERROR_SDK_NOT_READY, value: false });
      return;
    }

    if (!appState.hasVisitor) {
      setFlagOk({ error: ERROR_VISITOR_NOT_SET, value: false });
      return;
    }

    let value = checkFlagType();
    if (value === null) {
      return;
    }
    const flags = fs.getModifications([
      {
        key: flagKey,
        defaultValue: value,
        activate: flagActivate,
      },
    ]);

    setFlagOk({ error: "", value: flags[flagKey] });
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
              value={flagKey}
              onChange={(e) => setFlagKey(e.target.value)}
            />
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label>Flag type</label>
            <select
              className="form-control"
              placeholder="Type"
              value={flagType}
              onChange={(e) => setFlagType(e.target.value)}
            >
              <option value="bool">bool</option>
              <option value="double">double</option>
              <option value="int">int</option>
              <option value="long">long</option>
              <option value="float">float</option>
              <option value="string">string</option>
              <option value="JSONObject">JSONObject</option>
              <option value="JSONArray">JSONArray</option>
            </select>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="form-group">
            <label>Default value</label>
            <input
              type="text"
              className="form-control"
              placeholder="Default"
              value={flagDefaultValue}
              onChange={(e) => setFlagDefaultValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={flagActivate}
          onChange={(e) => setFlagActivate(e.target.checked)}
        />
        <label className="form-check-label"> Activate </label>
      </div>

      {flagOk.error && (
        <div className="alert alert-warning mt-3 mb-3">
          {JSON.stringify(flagOk.error)}
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>

      {flagOk.value && (
        <div className="alert alert-success mt-3 mb-3">
          {JSON.stringify(flagOk.value)}
        </div>
      )}
    </form>
  );
}
