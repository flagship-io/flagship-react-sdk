import { useEffect, useState } from "react";
import { globalLogs } from "../App";

export default function Log() {

  const [logs, setLogs] = useState(globalLogs.logs);


  useEffect(()=>{
    setLogs(globalLogs.logs);
  },[])
  
  const onSubmitClear =(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    globalLogs.logs =""
    setLogs("");
  }

  return <div>
  <div style={{position: "relative"}}>
    <h2 className="mt-5">SDK logs</h2>
    <form onSubmit={onSubmitClear} >
      <button
        type="submit"
        className="btn btn-primary"
        style={{position: "absolute", right: 0}}
      >
        clear
      </button>
    </form>
    <form  >
      <br /><br />
      <textarea
        className="form-control"
        style={{height: 564}}
        disabled={true}
        value={logs}
      >
      </textarea>
    </form>
  </div>
</div>;
}
