import { Dispatch, ReactNode, SetStateAction } from 'react'

import { Visitor, IFlagshipConfig, FlagDTO, CampaignDTO, primitive, BucketingDTO, FetchFlagsStatus, FSSdkStatus, IHit, IFlag } from '@flagship.io/js-sdk'

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

/**
 * Props for the FlagshipProvider component.
 */
export interface FlagshipProviderProps extends IFlagshipConfig {
    /**
     * This is the data to identify the current visitor using your app.
     */
    visitorData: VisitorData | null;
    /**
     * The environment ID for your Flagship project.
     */
    envId: string;
    /**
     * The API key for your Flagship project.
     */
    apiKey: string;
    /**
     * This component will be rendered when Flagship is loading at first initialization only.
     * By default, the value is undefined. It means it will display your app and it might
     * display default modifications value for a very short moment.
     */
    loadingComponent?: ReactNode;
    /**
     * The child components to be rendered within the FlagshipProvider.
     */
    children?: ReactNode;
    /**
     * Callback function called when the SDK is updated. For example, after a synchronize is triggered or visitor context has changed.
     * @param params - An object containing the updated SDK data.
     */
    onUpdate?(params: {
      fsModifications: Map<string, FlagDTO>;
      config: IFlagshipConfig;
      status: FsSdkState;
    }): void;
    /**
     * This is an object of the data received when fetching bucketing endpoint.
     * Providing this prop will make bucketing ready to use and the first polling will immediately check for an update.
     * If the shape of an element is not correct, an error log will give the reason why.
     */
    initialBucketing?: BucketingDTO;
    /**
     * An array of initial campaigns to be used by the SDK.
     */
    initialCampaigns?: CampaignDTO[];

    /**
     * This is a set of flag data provided to avoid the SDK to have an empty cache during the first initialization.
     */
    initialFlagsData?: Map<string, FlagDTO> | FlagDTO[];
    /**
     * If true, it'll automatically call fetchFlags when the bucketing file has updated.
     */
    fetchFlagsOnBucketingUpdated?: boolean;

    /**
     * Callback function that will be called when the fetch flags status changes.
     *
     * @param newStatus - The new status of the flags fetch.
     * @param reason - The reason for the status change.
     */
    onFetchFlagsStatusChanged?: ({ status, reason }: FetchFlagsStatus) => void;
    /**
     * If true, the newly created visitor instance won't be saved and will simply be returned. Otherwise, the newly created visitor instance will be returned and saved into the Flagship.
     *
     * Note: By default, it is false on server-side and true on client-side.
     */
    shouldSaveInstance?: boolean;
  }

/**
 * Represents the output of the `useFlagship` hook.
 */
export type UseFlagshipOutput = {
  /**
   * The visitor ID.
   */
  visitorId?: string;
  /**
   * The anonymous ID.
   */
  anonymousId?: string | null;
  /**
   * The visitor context.
   */
  context?: Record<string, primitive>;
  /**
   * Indicates whether the visitor has consented for protected data usage.
   */
  hasConsented?: boolean;
  /**
   * Sets whether the visitor has consented for protected data usage.
   * @param hasConsented - True if the visitor has consented, false otherwise.
   */
  setConsent: (hasConsented: boolean) => void;
  /**
   * The flags data.
   */
  flagsData: FlagDTO[];
  /**
   * The status of the Flagship SDK.
   */
  readonly sdkState: FsSdkState;

  readonly sdkStatus: FSSdkStatus;

  readonly fetchStatus?: FetchFlagsStatus
  /**
   * Updates the visitor context values, matching the given keys, used for targeting.
   * A new context value associated with this key will be created if there is no previous matching value.
   * Context keys must be strings, and value types must be one of the following: number, boolean, string.
   * @param context - A collection of keys and values.
   */
  updateContext(context: Record<string, primitive>): void;
  /**
   * Clears the actual visitor context.
   */
  clearContext(): void;
  /**
   * Authenticates an anonymous visitor.
   * @param visitorId - The visitor ID.
   */
  authenticate(visitorId: string): void;
  /**
   * Changes an authenticated visitor to an anonymous visitor.
   */
  unauthenticate(): void;

  /**
   * Sends a hit or multiple hits to the Flagship server.
   * @param hit - The hit or array of hits to send.
   */
  sendHits(hit: IHit): Promise<void>;
  sendHits(hits: IHit[]): Promise<void>;
  sendHits(hits: IHit | IHit[]): Promise<void>;

  /**
   * Return a [Flag](#flag-class)  object by its key.
   *  If no flag matches the given key, an empty flag will be returned.
   * Call exists() to check if the flag has been found.
   * @param key - The flag key.
   * @param defaultValue - The default value.
   * @returns The flag object.
   */
  getFlag<T>(key: string, defaultValue: T): IFlag<T>;
  /**
   * Invokes the `decision API` or refers to the `bucketing file` to refresh all campaign flags based on the visitor's context.
   */
  fetchFlags: () => Promise<void>;
  /**
   * Batches and sends all hits that are in the pool before the application is closed.
   * @returns A promise that resolves when all hits are sent.
   */
  close(): Promise<void>;
};
