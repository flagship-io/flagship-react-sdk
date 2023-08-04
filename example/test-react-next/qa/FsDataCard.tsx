import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./index.module.css";
import { BucketingDTO, Campaign, ExposedVariations, ForcedVariation } from "./type";
import { CampaignItem } from "./CampaignItem";
import { fsModuleQAContext } from "./fsModuleQAContext";
import { Header } from "./Header";

export type FsDataCardProps = {
    onVariationsForced: (forcedVariations: ForcedVariation[]) => void
    onArrowClick: () => void;
    exposedVariations: () => ExposedVariations[];
    bucketing?: BucketingDTO;
};

export function FsDataCardFunc(props: FsDataCardProps) {
    const { onVariationsForced, bucketing, onArrowClick } = props
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [computeCampaigns, setComputeCampaigns] = useState(false)
    const exposedVariations = props.exposedVariations();
    const forceVariationsRef = useRef<ForcedVariation[]>([])
    const campaignsRef = useRef<Campaign[]>([])
  
    console.log("FsDataCard");

    useEffect(() => {
        const localCampaigns: Campaign[] = [];

        exposedVariations.forEach((item) => {
            const campaign = bucketing?.campaigns?.find(
                (x) => x.id === item.campaignId
            );
            if (!campaign) {
                return;
            }
            localCampaigns.push(campaign);
            const variationGroup = campaign.variationGroups.find(
                (x) => x.id === item.variationGroupId
            );
            variationGroup?.variations.forEach((item) => {
                item.isSelected = false;
            });
            const variation = variationGroup?.variations.find(
                (x) => x.id === item.variationId
            );
            if (!variation) {
                return;
            }
            variation.isSelected = true;
        });

        setCampaigns(localCampaigns);
        campaignsRef.current = localCampaigns
    }, [JSON.stringify(exposedVariations), bucketing?.campaigns, computeCampaigns]);

    const onVariationSelected = useCallback((item: ExposedVariations) => {
        const forceVariations = forceVariationsRef.current
        const forceVariation = forceVariations.find(x => x.variationGroupId === item.variationGroupId)
        if (forceVariation) {
            forceVariation.variationId = item.variationId
            return
        }
        forceVariationsRef.current.push(item)
    }, [])

    const onValidation = () => {
        onVariationsForced(forceVariationsRef.current)
    }

    const onSearchInputChange = useCallback((value:string)=>{
        if (!value) {
            setComputeCampaigns(state=> !state)
            return 
        }
        const localCampaigns: Campaign[] = [];
        campaignsRef.current.forEach(campaign=>{
            if (campaign.id.includes(value)) {
                localCampaigns.push(campaign)
                return 
            }
            campaign.variationGroups.forEach(variationGroup=>{
                if (variationGroup.id.includes(value)) {
                    localCampaigns.push(campaign)
                    return 
                }
                variationGroup.variations.forEach(variation=>{
                    if (variation.id.includes(value)) {
                        localCampaigns.push(campaign)
                        return
                    }
                    if (typeof variation.modifications.value === 'object') {
                        const flags = variation.modifications.value
                        for (const key in flags) {
                            if (key.includes(value) || `${flags[key]}`.includes(value)) {
                                localCampaigns.push(campaign)
                                return
                            }
                        }
                    }
                })
            })
        });
        setCampaigns(localCampaigns)
    },[])

    return (
        <div className={style.card}>
            <Header onArrowClick={onArrowClick} onValidation={onValidation} onSearchInputChange={onSearchInputChange} />
            <div className={style["card-body"]}>
                <fsModuleQAContext.Provider value={{ onVariationSelected }}>
                    {campaigns.map((item, index) => {
                        return <CampaignItem data={item} key={index} />;
                    })}
                </fsModuleQAContext.Provider>
            </div>
        </div>
    );
}

export const FsDataCard = React.memo(FsDataCardFunc);
