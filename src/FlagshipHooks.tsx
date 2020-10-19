import { useContext, useEffect } from 'react';
import {
    FsModifsRequestedList,
    GetModificationsOutput,
    GetModificationInfoOutput,
    IFlagshipVisitor,
    HitShape
} from '@flagship.io/js-sdk';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import FlagshipContext, { FsStatus } from './FlagshipContext';

declare type ModificationKeys = Array<string>;
declare type UseFsActivateOutput = void;
declare type UseFsModificationsOutput = GetModificationsOutput;

const reportNoVisitor = (log: FsLogger | null): void => {
    if (log) {
        log.error('sdk not correctly initialized... Make sure fsVisitor is ready.');
    }
};

const safeModeLog = (log: FsLogger | null, functionName: string): void => {
    if (log) {
        log.error(`${functionName} is disabled because the SDK is in safe mode.`);
    }
};

export const useFsActivate = (
    modificationKeys: ModificationKeys,
    applyEffectScope: any[] = []
): UseFsActivateOutput => {
    const { state, hasError } = useContext(FlagshipContext);
    useEffect((): void => {
        const { fsVisitor } = state;

        if (hasError) {
            return safeModeLog(state.log, 'UseFsActivate');
        }
        if (!fsVisitor) {
            reportNoVisitor(state.log);
        } else {
            fsVisitor.activateModifications(modificationKeys.map((key) => ({ key })));
        }
        return undefined;
    }, applyEffectScope);
};

// NOTES:
/*
two possible solutions to avoid massive 'activate api' calls:
1) wrap the 'useFsModificationsCache' in a useEffect and plug correctly the useEffect the way you need
2) in the JS SDK, make a cache to understand if the activate call already be done before.
*/
const safeMode_getCacheModifications = (
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false
): UseFsModificationsOutput => {
    return modificationsRequested.reduce((reducer, modifRequested) => {
        const newReducer: UseFsModificationsOutput = { ...reducer };
        newReducer[modifRequested.key] = modifRequested.defaultValue;
        return newReducer;
    }, {});
};
const getCacheModifications = (
    fsVisitor: IFlagshipVisitor | null,
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false,
    log: FsLogger | null
): UseFsModificationsOutput => {
    if (!fsVisitor) {
        if (log) {
            log.warn('fsVisitor not initialized, returns default value');
        }
        return safeMode_getCacheModifications(modificationsRequested, activateAllModifications);
    }
    return fsVisitor.getModifications(modificationsRequested, activateAllModifications);
};

export const useFsModifications = (
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false
): UseFsModificationsOutput => {
    const {
        state: { fsVisitor, log },
        hasError
    } = useContext(FlagshipContext);

    if (hasError) {
        return safeMode_getCacheModifications(modificationsRequested, activateAllModifications);
    }

    return getCacheModifications(fsVisitor, modificationsRequested, activateAllModifications, log);
};

export declare type UseFlagshipParams = {
    modifications: {
        requested: FsModifsRequestedList;
        activateAll?: boolean;
    };
};

export declare type UseFlagshipOutput = {
    modifications: GetModificationsOutput;
    getModificationInfo: (key: string) => Promise<null | GetModificationInfoOutput>;
    synchronizeModifications(activate: boolean): Promise<number>;
    startBucketingPolling(): { success: boolean; reason?: string };
    stopBucketingPolling(): { success: boolean; reason?: string };
    status: FsStatus;
    hit: {
        send(hit: HitShape): void;
        sendMultiple(hits: HitShape[]): void;
    };
};

export const useFlagship = (options?: UseFlagshipParams): UseFlagshipOutput => {
    const computedOptions = options
        ? (options as UseFlagshipParams)
        : {
              modifications: { requested: [], activateAll: false }
          };
    const {
        modifications: { requested: modificationsRequested, activateAll: activateAllModifications = false }
    } = computedOptions;
    const {
        hasError,
        setState,
        state: { fsSdk, fsVisitor, status, log }
    } = useContext(FlagshipContext);
    if (hasError) {
        return {
            modifications: safeMode_getCacheModifications(modificationsRequested, activateAllModifications),
            status,
            synchronizeModifications: (activate = false): Promise<number> => {
                safeModeLog(log, 'synchronizeModifications');
                return new Promise((resolve) => resolve(400));
            },
            getModificationInfo: (): Promise<null> => {
                safeModeLog(log, 'getModificationInfo');
                return new Promise((resolve) => resolve(null));
            },
            startBucketingPolling: (): { success: boolean; reason?: string } => {
                safeModeLog(log, 'startBucketingPolling');
                return {
                    success: false,
                    reason: 'Safe mode enabled'
                };
            },
            stopBucketingPolling: (): { success: boolean; reason?: string } => {
                safeModeLog(log, 'startBucketingPolling');
                return {
                    success: false,
                    reason: 'Safe mode enabled'
                };
            },
            hit: {
                send: (): void => {
                    safeModeLog(log, 'send hit');
                },
                sendMultiple: (): void => {
                    safeModeLog(log, 'send multiple hits');
                }
            }
        };
    }
    const logSdkNotReady = () => {
        if (log) {
            log.error('SDK not ready yet.');
        }
    };
    const send = (hit: HitShape): void => {
        if (fsVisitor && fsVisitor.sendHit) {
            fsVisitor.sendHit(hit);
        } else {
            logSdkNotReady();
        }
    };
    const sendMultiple = (hits: HitShape[]): void => {
        if (fsVisitor && fsVisitor.sendHits) {
            fsVisitor.sendHits(hits);
        } else {
            logSdkNotReady();
        }
    };

    const synchronizeModifications = (activate = false): Promise<number> => {
        if (fsVisitor && fsVisitor.synchronizeModifications) {
            return fsVisitor.synchronizeModifications(activate).then((data) => {
                if (setState) {
                    setState((s) => ({ ...s, fsModifications: fsVisitor.fetchedModifications }));
                }
                return data;
            });
        }
        logSdkNotReady();
        return new Promise((resolve) => resolve(405));
    };
    send.bind(fsVisitor);
    sendMultiple.bind(fsVisitor);
    return {
        synchronizeModifications,
        modifications: getCacheModifications(fsVisitor, modificationsRequested, activateAllModifications, log),
        getModificationInfo: (key: string): Promise<GetModificationInfoOutput | null> => {
            return fsVisitor !== null
                ? (fsVisitor as IFlagshipVisitor).getModificationInfo(key)
                : new Promise((resolve) => resolve(null));
        },
        startBucketingPolling: (): { success: boolean; reason?: string } => {
            if (fsSdk) {
                return fsSdk.startBucketingPolling();
            }
            if (log) {
                log.error('startBucketingPolling not ready yet.');
            }
            return {
                success: false,
                reason: 'startBucketingPolling not ready yet.'
            };
        },
        stopBucketingPolling: (): { success: boolean; reason?: string } => {
            if (fsSdk) {
                return fsSdk.stopBucketingPolling();
            }
            if (log) {
                log.error('stopBucketingPolling not ready yet.');
            }
            return {
                success: false,
                reason: 'startBucketingPolling not ready yet.'
            };
        },
        status,
        hit: {
            send,
            sendMultiple
        }
    };
};
