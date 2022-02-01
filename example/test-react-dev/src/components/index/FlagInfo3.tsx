import { useContext, useState } from "react";
import { appContext } from "../../App";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";
import { FlagData } from "../../pages/Home";


export type Props = {
  flagData?: FlagData
}

export default function FlagInfo({ flagData }:Props) {
  const [flagInfoOk, setFlagInfoOk] = useState<{
    error?: unknown;
    value?: unknown;
  }>({
    value:""
  });
  const { appState } = useContext(appContext);

  const onSubmit = () => {
    if (!appState.isSDKReady) {
      setFlagInfoOk({ error: ERROR_SDK_NOT_READY });
      return;
    }

    if (!appState.hasVisitor) {
      setFlagInfoOk({ error: ERROR_VISITOR_NOT_SET });
      return;
    }
    if (!flagData) {
      return;
    }
    const flagInfo = flagData.flag?.metadata;
    setFlagInfoOk({ value: flagInfo });
    
  };

  return (
    <div >
      { !!flagData &&<div className="alert alert-info">
      <div>key: { flagData.key }</div>
      <div>defaultValue : { flagData.defaultValue }</div>
    </div>}
    { !flagData &&
      <div  className="alert alert-warning">
      Please set get Flag first
    </div>
    }

      {flagInfoOk.error && (
        <div className="alert alert-warning mt-3 mb-3">
          {JSON.stringify(flagInfoOk.error)}
        </div>
      )}

      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        Submit
      </button>

      {(flagInfoOk.value || flagInfoOk.value==null) && (
        <div className="alert alert-success mt-3 mb-3">
          <pre>{JSON.stringify(flagInfoOk.value)}</pre>
        </div>
      )}
    </div>
  );
}
