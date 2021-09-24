import React from 'react';
import logo from './logo.svg';
import {useFlagship} from "@flagship.io/react-sdk"

let age = 1
const Home= React.memo(()=>{
  console.log('home');
  const fs = useFlagship({modifications:{requested:[{key:"btnColor", defaultValue:"white"}]}} )
  
const click =()=>{
  age = age===1?1:2
  fs.updateContext({age})
}
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{fs.modificationsAsync}</p>
        <button style={{width:100, height:50}} value={"click me"} onClick={()=>{click()}}></button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
})

export default Home;
