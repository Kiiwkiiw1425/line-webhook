// services/stateStore.js
const store = new Map(); // userId -> state

// ตั้งค่า
const STATE_TTL_MS   = 30 * 60 * 1000;   // อายุ state (30 นาที)
const NOTIFY_COOLDOWN_MS = 60 * 60 * 1000; // แจ้งทีมงานซ้ำได้ไม่ถี่เกิน (60 นาที)

function now() { return Date.now(); }

function getState(userId) {
  const s = store.get(userId);
  if (!s) return { mode: null };
  if (now() - (s.lastActivityAt || s.updatedAt || 0) > STATE_TTL_MS) {
    store.delete(userId);
    return { mode: null };
  }
  return s;
}

function setState(userId, patch) {
  const prev = getState(userId);
  const next = { ...prev, ...patch, updatedAt: now() };
  store.set(userId, next);
  return next;
}

function touch(userId) {
  const prev = getState(userId);
  store.set(userId, { ...prev, lastActivityAt: now(), updatedAt: now() });
}

// ควรแจ้งทีมงานไหม (กันสแปมด้วย cooldown)
function shouldNotify(state) {
  if (!state?.notifiedAt) return true;
  return (now() - state.notifiedAt) > NOTIFY_COOLDOWN_MS;
}

// ใช้โดย idle monitor
function listStates() {
  return Array.from(store.entries()).map(([userId, s]) => ({ userId, ...s }));
}

// จบการสนทนา (ล้าง state)
function clearConversation(userId) {
  store.delete(userId);
}

module.exports = {
  getState,
  setState,
  touch,
  listStates,
  clearConversation,
  shouldNotify,
  STATE_TTL_MS
};
