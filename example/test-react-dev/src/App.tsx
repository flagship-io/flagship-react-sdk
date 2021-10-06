import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.css';
import { DecisionMode, FlagshipProvider} from "../../../"
import {ENV_ID, API_KEY} from './config'
import Home from './Home';

import {campaigns} from './campaigns'

interface IVisitorData{
  id: string
  context?: {
          age: number
  },
  isAuthenticated: boolean
}

interface IAppContext {
  visitorData: IVisitorData
  setVisitorData: Dispatch<SetStateAction<IVisitorData>>;
}
const initStat = {
  visitorData:{
    id:"visitor_0",
    context:{
      age:20
    },
    isAuthenticated:false
  },
  setVisitorData:()=>{}
}

export const appContext = React.createContext<IAppContext>(initStat)

let count=0

const loadingComponent = ()=>{
  return <div>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. At doloremque neque eveniet voluptatem dicta optio sint quam vero tempore! Tempora exercitationem recusandae numquam dicta illum quisquam non est distinctio ad!
  </div>
}
function App() {
  const [visitorData,setVisitorData] = useState<IVisitorData>(initStat.visitorData)
  const [dynamicProp, setDynamicProp] = useState(1);
  useEffect(()=>{
    let count = 1
    const intervalID = setInterval(()=>{
      count++
      setDynamicProp(Math.random());
    }, 2000)
    return ()=>{
      clearInterval(intervalID)
    }
  },[])
  
  useEffect(()=>{
    // console.log("visitorData",visitorData);
  },[visitorData])

  const onClick=()=>{
    count++
    console.log("count",count);
    setVisitorData({...visitorData,id:'visitor_'+ count, isAuthenticated: !visitorData.isAuthenticated})
  }
  return(
  <FlagshipProvider decisionApiUrl={"https://decision.flagship.io/v2/"}  visitorData={visitorData} pollingInterval={5}  envId={ENV_ID} timeout={5} apiKey={API_KEY} fetchNow={true} >
    <Home dynamicProp={0} />
    <button style={{width:100, height:50}} onClick={()=>{onClick()}}>click me</button>
  </FlagshipProvider>
  )
}

export default App;
