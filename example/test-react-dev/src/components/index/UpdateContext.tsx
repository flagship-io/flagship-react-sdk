import { primitive, useFlagship } from "@flagship.io/react-sdk";
import { useContext, useState } from "react";
import { appContext } from "../../App";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";

export default function UpdateContext() {
  const [contextKey, setContextKey] = useState<string>("");
  const [contextValue, setContextValue] = useState<string>("");
  const [contextType, setContextType] = useState<string>("bool");
  const [newContext, setNewContext] = useState<Record<string, primitive>>();
  const [evalError, setEvalError] = useState<{ error?: unknown }>({});
  const { appState } = useContext(appContext);
  const fs = useFlagship();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appState.isSDKReady) {
      setEvalError({ error: ERROR_SDK_NOT_READY });
      return;
    }

    if (!appState.hasVisitor) {
      setEvalError({ error: ERROR_VISITOR_NOT_SET });
      return;
    }

    let value: primitive;

    switch (contextType) {
      case "bool":
        try {
          value = JSON.parse(contextValue);
          if (typeof value !== "boolean") {
            setEvalError({ error: "value must be a boolean" });
            return;
          }
        } catch (error) {
          setEvalError({ error: "value must be a boolean" });
          return;
        }

        break;
      case "double":
      case "int":
      case "long":
      case "float":
        value = Number(contextValue);
        if (isNaN(value)) {
          setEvalError({ error: "value must be a number" });
          return;
        }
        break;
      default:
        value = contextValue;
        break;
    }

    fs.updateContext({ [contextKey]: value });
    fs.synchronizeModifications().then(() => {
      setNewContext({ [contextKey]: value });
      setContextKey("")
      setContextValue("")
      setContextType("bool")
    });
  };
  return (
    <>
      <h2 className="mt-5">Stand alone update context</h2>
      <small className="form-text text-muted">
        (Will also call synchronize)
      </small>
      <br />

      <form onSubmit={onSubmit}>
        <div className="row" style={{ alignItems: "center" }}>
          <div className="col-sm-3">
            <div className="form-group">
              <label>Context key</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Key"
                value={contextKey}
                onChange={(e) => setContextKey(e.target.value)}
              />
            </div>
          </div>

          <div className="col-sm-3">
            <div className="form-group">
              <label>Context type</label>
              <select
                required
                className="form-control"
                placeholder="Type"
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
              >
                <option value="bool">bool</option>
                <option value="double">double</option>
                <option value="int">int</option>
                <option value="long">long</option>
                <option value="float">float</option>
                <option value="string">string</option>
              </select>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="form-group">
              <label>Context value</label>
              <input
                type="text"
                className="form-control"
                placeholder="Default"
                value={contextValue}
                onChange={(e) => setContextValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        {evalError.error && (
          <div className="alert alert-warning mt-3 mb-3">
            {JSON.stringify(evalError.error)}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>

        {newContext && (
          <div className="alert alert-success mt-3 mb-3">
            New context: {JSON.stringify(newContext)}
          </div>
        )}
      </form>
    </>
  );
}
