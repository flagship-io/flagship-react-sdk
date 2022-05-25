import { VisitorData, FlagshipProvider, DecisionMode } from '@flagship.io/react-sdk';
import React, { Dispatch, SetStateAction, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ENV_ID, API_KEY } from '../config';
import App from './App'
import './index.css'


interface IAppContext {
  visitorData: VisitorData|null;
  setVisitorData: Dispatch<SetStateAction<VisitorData|null>>;
}
const initStat = {
  visitorData:null,
  setVisitorData: () => {},
};

export const appContext = React.createContext<IAppContext>(initStat);

const Main = ()=>{
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  
  return (
      <appContext.Provider
        value={{visitorData, setVisitorData }}
      >
      <FlagshipProvider
        decisionMode={ DecisionMode.BUCKETING }
        visitorData={visitorData}
        // fetchNow={false}
        envId={ENV_ID}
        apiKey={API_KEY}
      >
        <App/>
      </FlagshipProvider>
      </appContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
