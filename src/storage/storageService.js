import storage from "./localStorage";

const storageService = {
  getCollection(key) {
    return storage.get(key) || [];
  },

  saveCollection(key, data) {
    storage.set(key, data);
  },

  clearCollection(key) {
    storage.remove(key);
  },

  exists(key) {
    return storage.get(key) !== null;
  },
};

export default storageService;
