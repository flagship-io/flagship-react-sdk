import { Campaign } from "./type";
import style from "./index.module.css";
import { VariationGroupItem } from "./VariationGroupItem";
import { fsModuleQAContext } from "./fsModuleQAContext";
import { useCallback, useContext, useEffect, useState } from "react";

export function CampaignItem({ data }: { data: Campaign }) {  
  const [variationGroups, setVariationGroups] = useState(data.variationGroups)
  const fsModuleContext = useContext(fsModuleQAContext)

  useEffect(()=>{
    setVariationGroups(data.variationGroups)
  }, [data.variationGroups])

  const onVariationSelected = useCallback((arg: {variationGroupId: string,variationId: string })=>{
    setVariationGroups(state =>{
      return state.map(value=>{   
        value.variations.forEach(variation=>{
          variation.isSelected = false
          if (variation.id === arg.variationId) {
            variation.isSelected = true;
          }
        })
        return value
      })
    })
    fsModuleContext.onVariationSelected({campaignId: data.id, ...arg})
  }, [])

  return (
    <div className={style.campaign}>
      <div>
        Campaign name `{data.id}` `{data.type}`
      </div>
      <hr className={style["main-hr"]} />
      {variationGroups.map((item) => {
        return <VariationGroupItem data={item} key={item.id} onVariationSelected={onVariationSelected} />;
      })}
    </div>
  );
}
