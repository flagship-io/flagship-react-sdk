import { useContext, useEffect } from 'react';
import {
    FsModifsRequestedList,
    GetModificationsOutput
} from '@flagship.io/js-sdk';
import FlagshipContext from './FlagshipContext';

declare type ModificationKeys = Array<string>;
declare type UseFsActivateOutput = void;
declare type UseFsSynchronize = void;
declare type UseFsModificationsOutput = GetModificationsOutput | void;

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
        return reportNoVisitor();
    }

    useEffect(() => {
        fsVisitor.activateModifications(
            modificationKeys.map((key) => ({ key }))
        );
    }, applyEffectScope);

    return undefined;
};

export const useFsSynchronize = (
    applyEffectScope = [],
    activateAllModifications = false
): UseFsSynchronize => {
    const { state, setState } = useContext(FlagshipContext);
    const { fsVisitor } = state;

    if (!fsVisitor) {
        return reportNoVisitor();
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
    return undefined;
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
): UseFsModificationsOutput => {
    const {
        state: { fsVisitor }
    } = useContext(FlagshipContext);
    if (!fsVisitor) {
        return reportNoVisitor();
    }
    return fsVisitor.getModificationsCache(
        modificationsRequested,
        activateAllModifications
    );
};
