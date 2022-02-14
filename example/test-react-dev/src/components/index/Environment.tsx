import { DecisionMode } from "@flagship.io/js-sdk";
import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../../App";

export default function Environment() {
  const { setAppState, appState } = useContext(appContext);

  const [evalError, setEvalError] = useState<{ error?: unknown }>({});
  const [localData, setLocalData] = useState({
    envId: "",
    apiKey: "",
    timeout: 2,
    decisionMode: DecisionMode.DECISION_API,
    pollingInterval: 2,
  });

  useEffect(() => {
    setLocalData((prev) => ({
      ...prev,
      envId: appState.envId,
      apiKey: appState.apiKey,
      timeout: appState.timeout,
      decisionMode: appState.decisionMode,
      pollingInterval: appState.pollingInterval,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onEnvIDChange = (value: string) => {
    setLocalData((prev) => ({ ...prev, envId: value }));
  };
  const onApiKeyChange = (value: string) => {
    localData.apiKey = value;
    setLocalData((prev) => ({ ...prev, apiKey: value }));
  };
  const onTimeoutChange = (value: string) => {
    setLocalData((prev) => ({ ...prev, timeout: +value }));
  };
  const onDecisionModeChange = (value: string) => {
    setLocalData((prev) => ({
      ...prev,
      decisionMode:
        value === "1" ? DecisionMode.DECISION_API : DecisionMode.BUCKETING,
    }));
  };
  const onPollingIntervalChange = (value: string) => {
    setLocalData((prev) => ({ ...prev, pollingInterval: +value }));
  };
  const onSubmit = () => {
    setEvalError({ error: undefined });
    const localError: Record<string, string> = {};
    Object.entries(localData).forEach(([key, value]) => {
      if (!value) {
        localError[key] = `${key} is required`;
      }
    });
    if (Object.keys(localError).length) {
      setEvalError({ error: localError });
      return;
    }
    setAppState((prev) => ({
      ...prev,
      ...localData,
    }));
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-group">
        <label>Environment ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Environment ID"
          required
          value={localData.envId}
          onChange={(e) => {
            onEnvIDChange(e.target.value);
          }}
        />
        <small id="emailHelp" className="form-text text-muted">
          Set your Flagship Environment ID first.
        </small>
      </div>
      <div className="form-group">
        <label>API Key</label>
        <input
          type="text"
          className="form-control"
          placeholder="API Key"
          value={localData.apiKey}
          required
          onChange={(e) => {
            onApiKeyChange(e.target.value);
          }}
        />
        <small className="form-text text-muted">Set your API Key.</small>
      </div>
      <div className="form-group">
        <label>Timeout (seconds)</label>
        <input
          type="text"
          className="form-control"
          placeholder="Timeout"
          required
          value={localData.timeout}
          onChange={(e) => {
            onTimeoutChange(e.target.value);
          }}
        />
        <small className="form-text text-muted">Set your timeout.</small>
      </div>

      <div className="form-group">
        <label>Flagship Mode</label>
        <select
          className="form-control"
          placeholder="Flagship Mode"
          required
          value={
            localData.decisionMode === DecisionMode.DECISION_API ? "1" : "2"
          }
          onChange={(e) => {
            onDecisionModeChange(e.target.value);
          }}
        >
          <option value={1}>API</option>
          <option value={2}>Bucketing</option>
        </select>
      </div>

      <div className="form-group">
        <label>Polling time interval(seconds)</label>
        <input
          type="text"
          className="form-control"
          placeholder="Polling interval"
          required
          value={localData.pollingInterval}
          onChange={(e) => {
            onPollingIntervalChange(e.target.value);
          }}
        />
        <small className="form-text text-muted">
          Set your polling interval.
        </small>
      </div>

      {evalError.error && (
        <div className="alert alert-danger">
          {JSON.stringify(evalError.error)}
        </div>
      )}
      {appState.isSDKReady && (
        <div className="alert alert-success">
          Flagship client successfully initialized
        </div>
      )}

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  );
}
