import { useContext, useEffect } from 'react';
import {
    FsModifsRequestedList,
    GetModificationsOutput,
    IFlagshipVisitor
} from '@flagship.io/js-sdk';
import FlagshipContext, { FsStatus } from './FlagshipContext';
// import { FlagshipConsumer as FlagshipContext } from './FlagshipContext';

declare type ModificationKeys = Array<string>;
declare type UseFsActivateOutput = void;
declare type UseFsSynchronize = void;
declare type UseFsModificationsOutput = GetModificationsOutput;

const reportNoVisitor = (): void => {
    throw new Error(
        'Error: flagship-react-sdk not correctly initialized... Make sure fsVisitor is ready.'
    );
};

export const useFsActivate = (
    modificationKeys: ModificationKeys,
    applyEffectScope = []
): UseFsActivateOutput => {
    const {
        state: { fsVisitor }
    } = useContext(FlagshipContext);
    if (!fsVisitor) {
        reportNoVisitor();
    } else {
        useEffect(() => {
            fsVisitor.activateModifications(
                modificationKeys.map((key) => ({ key }))
            );
        }, applyEffectScope);
    }
};

export const useFsSynchronize = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyEffectScope: any[] = [],
    activateAllModifications = false
): UseFsSynchronize => {
    const { state, setState } = useContext(FlagshipContext);
    const { fsVisitor } = state;

    if (!fsVisitor) {
        reportNoVisitor();
    } else {
        useEffect(() => {
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
        }, applyEffectScope);
    }
};

// NOTES:
/*
two possible solutions to avoid massive 'activate api' calls:
1) wrap the 'useFsModificationsCache' in a useEffect and plug correctly the useEffect the way you need
2) in the JS SDK, make a cache to understand if the activate call already be done before.
*/
const getCacheModifications = (
    fsVisitor: IFlagshipVisitor | null,
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false
): UseFsModificationsOutput => {
    if (!fsVisitor) {
        reportNoVisitor();
        return {};
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
    return {
        modifications: getCacheModifications(
            fsVisitor,
            modificationsRequested,
            activateAllModifications
        ),
        status
    };
};
