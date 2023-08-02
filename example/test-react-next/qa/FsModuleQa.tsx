import React, { useState } from 'react'
import style from './index.module.css'
import { ArrowDown } from './ArrowDown'
import { FsDataCard } from './FsDataCard'
import { BucketingDTO, Campaign, ExposedVariations } from './type'

export type Props ={
  exposedVariations: ()=> ExposedVariations[],
  bucketing?: BucketingDTO
}
export default function FsModuleQa ({exposedVariations, bucketing}:Props) {
  const [showCard, setShowCard] = useState(false)  
  const toggleShowCard= ()=>{
    setShowCard(state=> !state)
  }
  return (
  <div className={`${style.main} ${showCard?style["main-card"]:""}`} >
    {showCard? <FsDataCard onArrowClick={toggleShowCard} exposedVariations={exposedVariations} bucketing={bucketing} /> : <ArrowDown onArrowClick={toggleShowCard}/>}
  </div>)
}
