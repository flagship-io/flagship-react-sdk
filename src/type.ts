import { Visitor, IFlagshipConfig, FlagDTO, CampaignDTO, primitive } from '@flagship.io/js-sdk'
import { Dispatch, SetStateAction } from 'react'

export interface FsSdkState {
    /**
     * Boolean. When true, the SDK is still not ready to render your App otherwise it'll use default modifications.
     */
    isLoading: boolean;
    /**
     * Boolean. true after it has fully finished initialization tasks, false otherwise.
     */
    isSdkReady: boolean;

    lastModified?: Date;
    /**
     * Boolean. When true the flagship visitor instance is truthy, false otherwise.
     */
    isVisitorDefined?: boolean;
    /**
     * String or null. The last update date occurred on the flagship visitor instance.
     */
    lastRefresh?: string;
    /**
     * String or null. When null no initialization succeed yet. When string contains stringified date of last successful initialization.
     */
    firstInitSuccess?: string;
  }
export interface FsContextState {
    visitor?: Visitor;
    config?: IFlagshipConfig;
    flags?: Map<string, FlagDTO>;
    sdkState: FsSdkState;
    initialCampaigns?: CampaignDTO[];
    initialFlags?: Map<string, FlagDTO> | FlagDTO[];
  }

export type VisitorData = {
    id?: string;
    context?: Record<string, primitive>;
    isAuthenticated?: boolean;
    hasConsented: boolean;
  };
export interface FsContext {
    state: FsContextState;
    setState?: Dispatch<SetStateAction<FsContextState>>;
  }
