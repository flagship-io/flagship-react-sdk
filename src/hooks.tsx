import { useContext, useEffect } from 'react';
import FlagshipContext from './FlagshipContext';
import { FsModifsRequestedList } from '@flagship.io/js-sdk'

declare type ModificationKeys = Array<string>

export const useFlagship = () => {
  const { ...everything } = useContext(FlagshipContext);
  return everything;
};


export const useFsActivate = (modificationKeys:ModificationKeys) => {
  const { fsVisitor } = useContext(FlagshipContext);
  return fsVisitor.activateModifications(
    modificationKeys.map(key => {
      return { key };
    })
  );
};

export const useFsModifications = (modificationsRequested: FsModifsRequestedList, activateAllModifications = false) => {
  const { fsVisitor } = useContext(FlagshipContext);

  useEffect(() => {
    fsVisitor.getModifications(modificationsRequested, activateAllModifications);
  }, []);
};

// NOTES:
/*
two possible solutions to avoid massive 'activate api' calls:
1) wrap the 'useFsModificationsCache' in a useEffect and plug correctly the useEffect the way you need
2) in the JS SDK, make a cache to understand if the activate call already be done before.
*/
export const useFsModificationsCache = (modificationsRequested:FsModifsRequestedList, activateAllModifications = false) => {
  const { fsVisitor } = useContext(FlagshipContext);
  return fsVisitor.getModificationsCache(modificationsRequested, activateAllModifications);
};
