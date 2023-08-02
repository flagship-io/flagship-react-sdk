import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import style from './index.module.css'
import { BucketingDTO, Campaign, ExposedVariations } from './type'
import { CampaignItem } from './CampaignItem'

export type FsDataCardProps = {
    onArrowClick: () => void,
    exposedVariations: ()=> ExposedVariations[],
    bucketing?: BucketingDTO
  }

  export type FsDataCard ={
    setBucketing:Dispatch<SetStateAction<Campaign[]>>
  }

  export const FlagshipContext = createContext<FsDataCard>({setBucketing:()=>{}})

  export function FsDataCard(props:FsDataCardProps) {
    
    const [bucketing, setBucketing] = useState<Campaign[]>([])
    const exposedVariations = props.exposedVariations()
    
    useEffect(()=>{
        const campaigns:Campaign[] = []
        exposedVariations.forEach(item=>{
            const campaign = props.bucketing?.campaigns?.find(x=>x.id === item.campaignId)
            if (!campaign) {
                return
            }
            campaigns.push(campaign)
            const variationGroup = campaign.variationGroups.find(x=> x.id === item.variationGroupId)
            variationGroup?.variations.map(item=>{
                item.isSelected = false
            })
            const variation = variationGroup?.variations.find(x=> x.id === item.variationId)
            if (!variation) {
                return
            }
            variation.isSelected = true
        })
        setBucketing(campaigns)
    },[JSON.stringify(exposedVariations), JSON.stringify(props.bucketing)])
    
    return (
      <div className={style.card}>
        <div className={`${style['card-header']} ${style['card-header-d-flex']}`}>
          <div>Header</div>
          <div className={style['close-card']} onClick={props.onArrowClick} >X</div>
        </div>
        <div className={style['card-body']}>
            <FlagshipContext.Provider value={{setBucketing}}>
                {bucketing.map((item, index)=>{
                    return <CampaignItem data={item} key={index}/>
                })}
            </FlagshipContext.Provider>
               
        </div>
      </div>
    )
  }