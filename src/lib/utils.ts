export const isObject = (obj: any): boolean => {
    return obj !== undefined && obj !== null && obj.constructor == Object;
};

export const smartJoin = (array: any[]): string => {
    return array.reduce((reducer, element) => {
        let newString = '';
        let newReducer = reducer;
        if (isObject(element)) {
            newString = JSON.stringify(element);
        } else if (Array.isArray(element)) {
            newString = smartJoin(element);
        } else {
            newString = element.toString();
        }
        newReducer += newString;
        return newReducer;
    }, '');
};
