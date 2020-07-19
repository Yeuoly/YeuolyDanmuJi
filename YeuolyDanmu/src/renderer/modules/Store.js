import Store from 'electron-store';
const store = new Store();

export const modifyStorage = (...args) => store.set(...args);

export const getStorage = (...args) => store.get(...args);

export const deleteStorage = (...args) => store.delete(...args);

export const isExistStorage = (...args) => store.has(...args);