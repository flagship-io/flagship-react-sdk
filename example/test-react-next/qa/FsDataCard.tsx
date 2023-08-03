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

export type FsDataCardProps = {
    onVariationsForced: (forcedVariations: ForcedVariation[]) => void
    onArrowClick: () => void;
    exposedVariations: () => ExposedVariations[];
    bucketing?: BucketingDTO;
};

export function FsDataCardFunc(props: FsDataCardProps) {
    const { onVariationsForced, bucketing, onArrowClick } = props
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const exposedVariations = props.exposedVariations();
    const forceVariationsRef = useRef<ForcedVariation[]>([])

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
    }, [JSON.stringify(exposedVariations), bucketing?.campaigns]);

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

    return (
        <div className={style.card}>
            <div className={`${style["card-header"]} ${style["card-header-d-flex"]}`}>
                <div>Header</div>
                <div>
                    <div onClick={onValidation} >Yes</div>
                    <div className={style["close-card"]} onClick={onArrowClick}>
                        X
                    </div>
                </div>

            </div>
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
