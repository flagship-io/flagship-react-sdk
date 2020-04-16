import { useContext, useEffect } from 'react';
import { FsModifsRequestedList } from '@flagship.io/js-sdk';
import FlagshipContext from './FlagshipContext';

declare type ModificationKeys = Array<string>;
declare type UseFlagshipOutput = any; // TODO
declare type UseFsActivateOutput = any; // TODO
declare type UseFsModificationsOutput = any; // TODO
declare type UseFsModificationsCacheOutput = any; // TODO

export const useFlagship = (): UseFlagshipOutput => {
    const { ...everything } = useContext(FlagshipContext);
    // TODO: debug
    return everything;
};

export const useFsActivate = (
    modificationKeys: ModificationKeys
): UseFsActivateOutput => {
    const {
        state: { fsVisitor }
    } = useContext(FlagshipContext);
    if (!fsVisitor) {
        throw new Error(
            'Error: flagship-react-sdk not correctly initialized... Make sure fsVisitor is ready.'
        );
    }
    return fsVisitor.activateModifications(
        modificationKeys.map((key) => ({ key }))
    );
};

export const useFsSynchronize = (
    applyEffectScope = [],
    activateAllModifications = false
): UseFsModificationsOutput => {
    const { state, setState } = useContext(FlagshipContext);
    const { fsVisitor } = state;

    if (!fsVisitor) {
        throw new Error(
            'Error: flagship-react-sdk not correctly initialized... Make sure fsVisitor is ready.'
        );
    }

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
};

// NOTES:
/*
two possible solutions to avoid massive 'activate api' calls:
1) wrap the 'useFsModificationsCache' in a useEffect and plug correctly the useEffect the way you need
2) in the JS SDK, make a cache to understand if the activate call already be done before.
*/
export const useFsModifications = (
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications = false
): UseFsModificationsCacheOutput => {
    const {
        state: { fsVisitor }
    } = useContext(FlagshipContext);
    if (!fsVisitor) {
        throw new Error(
            'Error: flagship-react-sdk not correctly initialized... Make sure fsVisitor is ready.'
        );
    }
    return fsVisitor.getModificationsCache(
        modificationsRequested,
        activateAllModifications
    );
};
