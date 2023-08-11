import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./index.module.css";
import { BucketingDTO, Campaign, ExposedVariations, ForcedVariation, Variation, VariationGroup } from "./type";
import { CampaignItem } from "./CampaignItem";
import { fsModuleQAContext } from "./fsModuleQAContext";
import { Header } from "./Header";

export type FsDataCardProps = {
    onVariationsForced: (forcedVariations: ForcedVariation[]) => void
    onArrowClick: () => void;
    exposedVariations: () => ExposedVariations[];
    bucketing?: BucketingDTO;
    originalExposedVariations?:string[]
};

export function FsDataCardFunc(props: FsDataCardProps) {
    const { onVariationsForced, bucketing, onArrowClick, originalExposedVariations } = props
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [computeCampaigns, setComputeCampaigns] = useState(false)
    const exposedVariations = props.exposedVariations();
    const forceVariationsRef = useRef<ForcedVariation[]>([])
    const campaignsRef = useRef<Campaign[]>([])
    const searchText = useRef<string>("")
  
    useEffect(() => {
        const localCampaigns: Campaign[] = [];
        const variations:Variation[] = []
        const variationGroups:VariationGroup[] = []
        const variationId: string[] = []

        exposedVariations.forEach((item) => {
            const rootCampaigns = searchText.current? campaigns: bucketing?.campaigns            
            const campaign = rootCampaigns?.find(
                (x) => x.id === item.campaignId
            );
            if (!campaign) {
                return;
            }
            localCampaigns.push(campaign); 
            variationGroups.push(...campaign.variationGroups)
            variationId.push(item.variationId)
        });

        variationGroups.forEach(variationGroup=>{
            variations.push(...variationGroup.variations)
        })

        variations.forEach(variation=>{
            variation.isOriginal= false
            if (originalExposedVariations?.includes(variation.id)) {
                variation.isOriginal = true
            }

            if (variationId.includes(variation.id)) {
                variation.isSelected = true
                return
            }
            variation.isSelected = false
            
        })

        setCampaigns(localCampaigns);
        campaignsRef.current = localCampaigns
    }, [JSON.stringify(exposedVariations), bucketing?.campaigns, computeCampaigns]);

    const onVariationSelected = useCallback((item: ExposedVariations) => {
        const forceVariations = forceVariationsRef.current
        const forceVariation = forceVariations.find(x => x.campaignId === item.campaignId)
        if (forceVariation) {
            forceVariation.variationId = item.variationId
            forceVariation.variationGroupId = item.variationGroupId
            return
        }
        forceVariationsRef.current.push(item)
    }, [])

    const onValidation = () => {
        onVariationsForced(forceVariationsRef.current)
    }

    const onSearchInputChange = useCallback((value:string)=>{
        searchText.current = value
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
            for (const variationGroup of campaign.variationGroups) {
                if (variationGroup.id.includes(value)) {
                    localCampaigns.push(campaign)
                    return 
                }
                for (const variation of variationGroup.variations) {
                    if (variation.id.includes(value)) {
                        localCampaigns.push(campaign)
                        return
                    }
                    if (typeof variation.modifications.value === 'object') {
                        const flags = variation.modifications.value
                        const keys = Object.keys(flags)
                        const values:string[] = Object.values(flags)
                        if (keys.some(x=> x!==null && `${x}`.includes(value)) || values.some(x=> x!==null && `${x}`.includes(value))) {
                            localCampaigns.push(campaign)
                            return
                        }
                    }
                }
            }
        });
        
        setCampaigns(localCampaigns)
    },[])

    return (
        <div className={style.card}>
            <Header onArrowClick={onArrowClick} onValidation={onValidation} onSearchInputChange={onSearchInputChange} />
            <div className={style["card-body"]}>
                <fsModuleQAContext.Provider value={{ onVariationSelected }}>
                    {campaigns.map((item) => {
                        return <CampaignItem data={item} key={item.id} />;
                    })}
                </fsModuleQAContext.Provider>
            </div>
        </div>
    );
}

export const FsDataCard = React.memo(FsDataCardFunc);
