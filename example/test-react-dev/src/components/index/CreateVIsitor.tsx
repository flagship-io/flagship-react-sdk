import { primitive, useFlagship, Modification } from "@flagship.io/react-sdk";
import { useContext, useEffect, useState } from "react";
import { IVisitorData } from "../../@types/types";
import { appContext } from "../../App";
import { ERROR_SDK_NOT_READY } from "../../constants/errorMessage";

const CreateVisitor = () => {
  const fs = useFlagship();
  const { appState, setAppState } = useContext(appContext);
  const [visitorData, setVisitorData] = useState<
    IVisitorData & { contextJSON: string }
  >({
    id: "",
    contextJSON: "{}",
    hasConsented: false,
  });
  const [evalError, setEvalError] = useState<{ error?: unknown }>({});
  const [flags, setFlags] = useState<Modification[]>([]);

  useEffect(() => {
    
    setFlags(fs.modifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fs.modifications)]);
  
  useEffect(() => {
    setVisitorData({
      id:fs.visitorId || "",
      contextJSON: JSON.stringify(fs.context)|| "{}",
      hasConsented: !!fs.hasConsented ,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({visitorId: fs.visitorId, context: fs.context,hasConsented: fs.hasConsented})]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appState.isSDKReady) {
      setEvalError({ error: ERROR_SDK_NOT_READY });
      return;
    }

    setEvalError({ error: undefined });
    const localError: Record<string, string> = {};

    let context: Record<string, primitive> = {};
    try {
      context = JSON.parse(visitorData.contextJSON);
    } catch (error) {
      localError.contextJSON = "Invalid JSON";
    }
    if (!visitorData.id) {
      localError.visitorID = "is required";
    }

    if (Object.keys(localError).length) {
      setEvalError({ error: localError });
      return;
    }
    setFlags([]);
    setAppState((prev) => ({
      ...prev,
      visitorData: {
        ...prev.visitorData,
        id: visitorData.id,
        context,
        hasConsented: visitorData.hasConsented,
      },
      hasVisitor: true,
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Visitor ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Visitor ID"
          value={visitorData.id}
          required
          onChange={(e) => {
            setVisitorData((prev) => ({ ...prev, id: e.target.value }));
          }}
        />
        <small id="emailHelp" className="form-text text-muted">
          Set your Flagship Visitor ID.
        </small>
      </div>

      <div className="form-group">
        <label>Visitor Context (JSON)</label>
        <textarea
          className="form-control"
          placeholder="Visitor Context"
          required
          value={visitorData.contextJSON}
          style={{ height: 200 }}
          onChange={(e) => {
            setVisitorData((prev) => ({
              ...prev,
              contextJSON: e.target.value,
            }));
          }}
        ></textarea>
        <small id="emailHelp" className="form-text text-muted">
          Set your Flagship Visitor Context.
        </small>
      </div>

      {appState.featureFlags.consent && (
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={visitorData.hasConsented}
            onChange={(e) => {
              setVisitorData((prev) => ({
                ...prev,
                hasConsented: e.target.checked,
              }));
            }}
          />
          <label className="form-check-label">Visitor consent</label>
        </div>
      )}

      {evalError.error && (
        <div className="alert alert-danger">
          {JSON.stringify(evalError.error)}
        </div>
      )}
      {flags.length > 0 && (
        <div className="alert alert-success">
          Visitor ID and context set successfully
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      <div>
        <br />
        <h2 className="mt-5">Visitor content:</h2>
      </div>
      <pre className="mt-3">{JSON.stringify(flags, null, 4)}</pre>
    </form>
  );
};

export default CreateVisitor;
