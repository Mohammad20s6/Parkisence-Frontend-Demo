const storage = {
  get(key) {
    const item = localStorage.getItem(key);

    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export default storage;
