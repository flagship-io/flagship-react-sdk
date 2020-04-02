import { useContext, useEffect } from 'react';
import FlagshipContext from './FlagshipContext';

export const useFlagship = () => {
  const { ...everything } = useContext(FlagshipContext);
  return everything;
};

export const useFsActivate = modificationKeys => {
  const { fsVisitor } = useContext(FlagshipContext);
  return fsVisitor.activateModifications(
    modificationKeys.map(key => {
      return { key };
    })
  );
};

export const useFsModifications = (modificationsRequested, activateAllModifications = false) => {
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
export const useFsModificationsCache = (modificationsRequested, activateAllModifications = false) => {
  const { fsVisitor } = useContext(FlagshipContext);
  return fsVisitor.getModificationsCache(modificationsRequested, activateAllModifications);
};
