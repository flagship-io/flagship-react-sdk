import { Campaign } from "./type";
import style from "./index.module.css";
import { VariationGroupItem } from "./VariationGroupItem";
import { fsModuleQAContext } from "./fsModuleQAContext";
import { useCallback, useContext } from "react";

export function CampaignItem({ data }: { data: Campaign }) {

  const fsModuleContext = useContext(fsModuleQAContext)

  const onVariationSelected = useCallback((arg: {variationGroupId: string,variationId: string })=>{
    fsModuleContext.onVariationSelected({campaignId: data.id, ...arg})
  }, [])

  return (
    <div className={style.campaign}>
      <div>
        Campaign name `{data.id}` `{data.type}`
      </div>
      <hr className={style["main-hr"]} />
      {data.variationGroups.map((item) => {
        return <VariationGroupItem data={item} key={item.id} onVariationSelected={onVariationSelected} />;
      })}
    </div>
  );
}
