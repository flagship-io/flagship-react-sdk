import { useContext, useEffect } from 'react';
import {
    FsModifsRequestedList,
    GetModificationsOutput,
    IFlagshipVisitor,
    HitShape
} from '@flagship.io/js-sdk';
import FlagshipContext, { FsStatus } from './FlagshipContext';
// import { FlagshipConsumer as FlagshipContext } from './FlagshipContext';

declare type ModificationKeys = Array<string>;
declare type UseFsActivateOutput = void;
declare type UseFsSynchronize = void;
declare type UseFsModificationsOutput = GetModificationsOutput;

const reportNoVisitor = (): void => {
    console.error(
        'Error: flagship-react-sdk not correctly initialized... Make sure fsVisitor is ready.'
    );
};

export const useFsActivate = (
    modificationKeys: ModificationKeys,
    applyEffectScope = []
): UseFsActivateOutput => {
    const { state } = useContext(FlagshipContext);
    useEffect(() => {
        const { fsVisitor } = state;
        if (!fsVisitor) {
            reportNoVisitor();
        } else {
            fsVisitor.activateModifications(
                modificationKeys.map((key) => ({ key }))
            );
        }
    }, applyEffectScope);
};

export const useFsSynchronize = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyEffectScope: any[] = [],
    activateAllModifications = false
): UseFsSynchronize => {
    const { state, setState } = useContext(FlagshipContext);
    useEffect(() => {
        const { fsVisitor } = state;
        if (!fsVisitor) {
            reportNoVisitor();
        } else {
            fsVisitor
                .synchronizeModifications(activateAllModifications)
                .then((/* statusCode */) => {
                    if (setState) {
                        setState({
                            ...state,
                            fsVisitor,
                            status: {
                                ...state.status,
                                isLoading: false,
                                lastRefresh: new Date().toISOString()
                            }
                        });
                    } else {
                        throw new Error(
                            'Error: useFsSynchronize > useEffect, setState is undefined'
                        );
                    }
                });
        }
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
    activateAllModifications = false
): UseFsModificationsOutput => {
    if (!fsVisitor) {
        console.log('fsVisitor not initialized, returns default value');
        return safeMode_getCacheModifications(
            modificationsRequested,
            activateAllModifications
        );
    }
    return fsVisitor.getModifications(
        modificationsRequested,
        activateAllModifications
    );
};

export const useFsModifications = (
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false
): UseFsModificationsOutput => {
    const {
        state: { fsVisitor }
    } = useContext(FlagshipContext);
    return getCacheModifications(
        fsVisitor,
        modificationsRequested,
        activateAllModifications
    );
};

export declare type UseFlagshipParams = {
    modifications: {
        requested: FsModifsRequestedList;
        activateAll?: boolean;
    };
};
export declare type UseFlagshipOutput = {
    modifications: GetModificationsOutput;
    status: FsStatus;
    hit: {
        send(hit: HitShape): void;
        sendMultiple(hits: HitShape[]): void;
    };
};

// Prototype
export const useFlagship = ({
    modifications: {
        requested: modificationsRequested,
        activateAll: activateAllModifications = false
    }
}: UseFlagshipParams): UseFlagshipOutput => {
    const {
        state: { fsVisitor, status }
    } = useContext(FlagshipContext);
    if (status.hasError) {
        return {
            modifications: safeMode_getCacheModifications(
                modificationsRequested,
                activateAllModifications
            ),
            status,
            hit: {
                send: (): void => {
                    console.log(
                        'SDK React - send hit skipped because is out of order.'
                    );
                },
                sendMultiple: (): void => {
                    console.log(
                        'SDK React - send multiple hits skipped because is out of order.'
                    );
                }
            }
        };
    }
    const logSdkNotReady = () => {
        console.error('SDK React not ready yet.');
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
    throw new Error('test test');
    send.bind(fsVisitor);
    sendMultiple.bind(fsVisitor);
    return {
        modifications: getCacheModifications(
            fsVisitor,
            modificationsRequested,
            activateAllModifications
        ),
        status,
        hit: {
            send,
            sendMultiple
        }
    };
};
