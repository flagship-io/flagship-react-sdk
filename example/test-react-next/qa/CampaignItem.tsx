import { Campaign } from "./type"
import style from './index.module.css'
import { VariationGroupItem } from "./VariationGroupItem"

export function CampaignItem({data}:{ data:Campaign}) {
    return (
        <div className={style.campaign}>
            <div>Campaign name `{data.id}` `{data.type}`</div>
            <hr className={style['main-hr']} />
                {data.variationGroups.map((item, index)=>{
                    return <VariationGroupItem data={item} key={index} />
                })}
        </div>
    )
}