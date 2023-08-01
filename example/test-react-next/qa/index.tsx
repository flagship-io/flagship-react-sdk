import React, { useState } from 'react'
import style from './index.module.css'

const arrowDownImage = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDIxYTEgMSAwIDAgMS0uNzEtLjI5bC04LThhMSAxIDAgMSAxIDEuNDItMS40Mmw3LjI5IDcuMyA3LjI5LTcuM2ExIDEgMCAwIDEgMS40MiAxLjQybC04IDhBMSAxIDAgMCAxIDE2IDIxWiIgZGF0YS1uYW1lPSJMYXllciAyIiBmaWxsPSIjNDhkNGQ0IiBjbGFzcz0iZmlsbC0wMDAwMDAiPjwvcGF0aD48cGF0aCBkPSJNMCAwaDMydjMySDB6IiBmaWxsPSJub25lIj48L3BhdGg+PC9zdmc+"

export function FsDataCard() {
  return (
    <div>
      Yes
    </div>
  )
}

export type ArrowDownType = {
  onArrowClick: () => void
}
export function ArrowDown(props: ArrowDownType){
    return (
    <div className={style["arrow-down"]} onClick={props.onArrowClick} >
      <img className={style["arrow-down-img"]} src={arrowDownImage}/>
      </div>
    )
}

export default function Index () {
  const [showCard, setShowCard] = useState(false)  
  const toggleShowCard= ()=>{
    setShowCard(state=> !state)
  }
  return (
  <div className={`${style.main} ${showCard?style["main-card"]:""}`} >
    {showCard? <FsDataCard/> : <ArrowDown onArrowClick={toggleShowCard}/>}
  </div>)
}
