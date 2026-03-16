// services/stateStore.js
const store = new Map(); // key=userId => { mode, updatedAt }

function setState(userId, data) {
  store.set(userId, { ...data, updatedAt: new Date() });
}
function getState(userId) {
  const s = store.get(userId);
  if (!s) return { mode: null };
  // expire 30 นาที
  if (Date.now() - s.updatedAt.getTime() > 30 * 60 * 1000) {
    store.delete(userId);
    return { mode: null };
  }
  return s;
}

module.exports = { setState, getState };
