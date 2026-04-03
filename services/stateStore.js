// services/stateStore.js
const store = {};

function getState(id) {
  return store[id] || {};
}

function setState(id, newState) {
  store[id] = { ...getState(id), ...newState };
}

function clearConversation(id) {
  delete store[id];
}

function shouldNotify(state = {}) {
  const now = Date.now();
  return now - (state.notifiedAt || 0) > 3 * 60 * 1000;
}

function touch(id) {
  setState(id, {
    lastActivity: Date.now(),
    promptedAfterInactive: false
  });
}

module.exports = {
  getState,
  setState,
  clearConversation,
  shouldNotify,
  touch
};
