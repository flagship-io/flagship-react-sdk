import { type BucketingDTO, DecisionMode, type IBucketingConfig, type IDecisionApiConfig, type IEdgeConfig, type IFlagshipConfig } from "./deps";

export enum INTERNAL_EVENTS {
    FsTriggerRendering = 'FS_TRIGGER_RENDERING'
}


export interface EdgeConfig extends IFlagshipConfig {
  decisionMode: DecisionMode.BUCKETING_EDGE;
  /**
   * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
   */
  initialBucketing?: BucketingDTO;
}

export type SDKConfig = IBucketingConfig | IDecisionApiConfig | IEdgeConfig;