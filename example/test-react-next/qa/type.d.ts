

export type Campaign = {
    id: string
    type: string
    slug?:string|null
    variationGroups:VariationGroup[]
}

export type Targetings = {
    operator: string;
    key: string;
    value: any;
}

export type Variation = {
    id: string;
    modifications: {
        type: string;
        value: any;
    };
    allocation?: number;
    reference?: boolean;
    isSelected?: boolean
}
export type VariationGroup = {
    id: string;
    targeting: {
        targetingGroups: Array<{
            targetings: Array<Targetings>;
        }>;
    };
    variations: Variation[];
}
export type BucketingDTO = {
    panic?: boolean;
    campaigns?: Campaign[];
}

export type ExposedVariations ={
    campaignId: string,
    variationGroupId: string,
    variationId: string
  }

  export type ForcedVariation = {
    campaignId: string,
    variationGroupId: string
    variationId: string
  }