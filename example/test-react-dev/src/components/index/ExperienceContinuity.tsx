import { useContext, useState } from "react"
import { appContext } from "../../App"
import {useFlagship} from '@flagship.io/react-sdk'
import { ERROR_SDK_NOT_READY, ERROR_VISITOR_NOT_SET } from "../../constants/errorMessage"


export default function ExperienceContinuity(){
    const fs = useFlagship()
    const [visitorUnauth, setVisitorUnauth] = useState({error:"", ok:false})
    const [visitorAuth,setVisitorAuth]= useState({error:"", ok:false})
    const [newVisitorId, setNewVisitorId] = useState("")
    const {appState} = useContext(appContext)

    const onSubmitAuthenticate =  (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!appState.isSDKReady) {
        setVisitorAuth({ error: ERROR_SDK_NOT_READY, ok:false });
        return;
      }
  
      if (!appState.hasVisitor) {
        setVisitorAuth({ error: ERROR_VISITOR_NOT_SET, ok:false });
        return;
      }
      fs.authenticate(newVisitorId)
      setVisitorAuth({error:"", ok:true})
    }

    const onSubmitUnauthorize =  (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!appState.isSDKReady) {
        setVisitorUnauth({ error: ERROR_SDK_NOT_READY, ok:false });
        return;
      }
  
      if (!appState.hasVisitor) {
        setVisitorUnauth({ error: ERROR_VISITOR_NOT_SET, ok:false });
        return;
      }
      fs.unauthenticate()
      setVisitorUnauth({error:"", ok:true})
    }

    return(
        <div>
    <h2 className="mt-5">(Optional) Authenticate your visitor</h2>
    <form onSubmit={onSubmitAuthenticate} >
      <div className="form-group">
        <label>New Visitor ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Visitor ID"
          required
          value={newVisitorId}
          onChange={(e)=>{setNewVisitorId(e.target.value)}}
        />
        <small id="emailHelp" className="form-text text-muted"
          >Set your new Flagship Visitor ID.</small
        >
      </div>

      <div className="alert alert-info">
        <div>Visitor ID: { fs.visitorId }</div>
        <div>Anonymous ID: { fs.anonymousId || "null" }</div>
      </div>

      {visitorAuth.error && <div className="alert alert-danger" >
        { visitorAuth.error }
      </div>}
      {visitorAuth.ok && <div className="alert alert-success" >
        Visitor authenticated successfully
      </div>}

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>

    <h2 className="mt-5">(Optional) Unauthenticate your visitor</h2>
    <form onSubmit={onSubmitUnauthorize} >
      <div className="alert alert-info">
        <div>Visitor ID: {fs.visitorId}</div>
        <div>Anonymous ID: {fs.anonymousId || "null" }</div>
      </div>

      {visitorUnauth.error && <div className="alert alert-danger" >
        {visitorUnauth.error }
      </div>}

     {visitorUnauth.ok && <div className="alert alert-success" v-if="visitorUnauth.ok">
        Visitor unauthenticated successfully
      </div>}

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>
    )
}