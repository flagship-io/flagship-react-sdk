import { useContext, useState } from "react";
import {
  ERROR_SDK_NOT_READY,
  ERROR_VISITOR_NOT_SET,
} from "../../constants/errorMessage";
import { appContext } from "../../App";
import { FlagData } from "../../pages/Home";


export type Props = {
  flagData?: FlagData
}

export default function FlagActivate({flagData}:Props) {
  const [activateOk, setActivateOk] = useState({ error: "", ok: false });

  const { appState } = useContext(appContext);

  const onSubmit =async () => {
   
    if (!appState.isSDKReady) {
      setActivateOk({ error: ERROR_SDK_NOT_READY, ok: false });
      return;
    }

    if (!appState.hasVisitor) {
      setActivateOk({ error: ERROR_VISITOR_NOT_SET, ok: false });
      return;
    }
    if (!flagData) {
      return
    }
    await flagData.flag?.userExposed();
    setActivateOk({ error: "", ok: true });
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

{activateOk.error && (
        <div className="alert alert-warning mt-3 mb-3">
          {JSON.stringify(activateOk.error)}
        </div>
      )}

      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        Submit
      </button>

      {activateOk.ok && (
        <div className="alert alert-success mt-3 mb-3">
          {"successful operation"}
        </div>
      )}
    </div>
  );
}
