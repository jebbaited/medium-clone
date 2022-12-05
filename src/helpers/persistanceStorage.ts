type IKeyStrings = 'accessToken' | 'current-theme';

export const getItem = (key: IKeyStrings): string => {
  return JSON.parse(localStorage.getItem(key));
};

export const setItem = (key: IKeyStrings, data: string): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeItem = (key: IKeyStrings): void => {
  localStorage.removeItem(key);
};
