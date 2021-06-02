const LOCAL_STORAGE_NODE = 'fsDevDemo';

export const saveLocalStorage: (callback: (oldPayload: any) => any) => { success: boolean; message: string } = (
  callback,
) => {
  const oldPayload = getLocalStorage();
  const newPayload = callback(oldPayload);
  if (newPayload && newPayload.constructor !== Object) {
    return {
      success: false,
      message: 'the new payload is not an object',
    };
  }
  if (newPayload === null) {
    localStorage.removeItem(LOCAL_STORAGE_NODE);
  } else {
    localStorage.setItem(LOCAL_STORAGE_NODE, JSON.stringify(newPayload));
  }
  return {
    success: true,
    message: 'ok',
  };
};

export const getLocalStorage = () => {
  let str;
  try {
    str = localStorage.getItem(LOCAL_STORAGE_NODE);
  } catch {
    str = null;
  }
  return !str ? null : JSON.parse(str);
};
