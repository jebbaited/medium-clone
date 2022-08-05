export const getItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setItem = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
