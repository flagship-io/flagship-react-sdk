import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import {useFlagship, useFsModifications} from "@flagship.io/react-sdk"

let age = 1
let count = 0
const Home= (props:{dynamicProp:number})=>{

  // const [dynamicProp, setDynamicProp] = useState(1);
  // useEffect(()=>{
  //   const intervalID = setInterval(()=>{
  //     count +=2
  //     setDynamicProp(Math.random());
  //   }, 2000)
  //   return ()=>{
  //     clearInterval(intervalID)
  //   }
  // },[])

  const fs = useFlagship()
  const {btnColor} = useFsModifications([{key:"btnColor", defaultValue:"white", activate:true}])

  setTimeout(() => {
    console.log("render Home", count);
  }, 1000);
  
const click =()=>{
  age = age===1?1:2
  fs.updateContext({age})
  console.log(fs.getModifications([{key:"btnColor", defaultValue:"white", activate:true}]));
  console.log(fs.getModificationInfo("btnColor"));
}
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{btnColor}</p>
        <button style={{width:100, height:50}} value={"click me"} onClick={()=>{click()}}></button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {props.dynamicProp} count {count}
        </a>
      </header>
    </div>
  );
}

export default Home;
