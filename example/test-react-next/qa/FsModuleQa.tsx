import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./index.module.css";
import { ArrowDown } from "./ArrowDown";
import { FsDataCard } from "./FsDataCard";
import { BucketingDTO, ExposedVariations, ForcedVariation } from "./type";

export type Props = {
  onVariationsForced:(forcedVariations: ForcedVariation[])=>void
  exposedVariations: () => ExposedVariations[];
  bucketing?: BucketingDTO;
};
function FsModuleQa({ exposedVariations, bucketing, onVariationsForced }: Props) {
  const [showCard, setShowCard] = useState(false);
  const originalExposedVariations = useRef<string[]>([])
  const toggleShowCard =useCallback(() => {
    setShowCard((state) => !state);
  },[]);

  const getOriginalExposedVariations = ()=>{
    if (originalExposedVariations.current.length === 0) {
      originalExposedVariations.current = exposedVariations().map(item=> item.variationId)
  }
  }
  
 getOriginalExposedVariations()

  console.log("FsModuleQa");

  return (
    <div className={`${style.main} ${showCard ? style["main-card"] : ""}`}>
      {showCard ? (
        <FsDataCard
          onVariationsForced={onVariationsForced}
          onArrowClick={toggleShowCard}
          exposedVariations={exposedVariations}
          bucketing={bucketing}
          originalExposedVariations={originalExposedVariations.current}
        />
      ) : (
        <ArrowDown onArrowClick={toggleShowCard} />
      )}
    </div>
  );
}

export default React.memo(FsModuleQa);
