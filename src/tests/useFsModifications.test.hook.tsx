import { renderHook } from '@testing-library/react-hooks';
import { useFsModifications } from '../FlagshipHooks';

const defaultParams = [
    {
        key: 'btnColor',
        defaultValue: 'green',
        activate: false
    }
];

describe('useFsModifications hook', () => {
    it('should not throw an error', () => {
        renderHook(() => useFsModifications(defaultParams));
    });
});
