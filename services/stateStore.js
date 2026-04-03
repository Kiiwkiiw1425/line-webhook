// services/stateStore.js

/**
 * In-memory state store
 * (ถ้าต้องการ scale จริง ควรย้ายไป Redis / DB)
 */

const store = {};

/**
 * ดึง state ของผู้ใช้
 * @param {string} userId
 */
function getState(userId) {
  return store[userId] || {};
}

/**
 * ตั้ง / อัปเดต state ของผู้ใช้
 * @param {string} userId
 * @param {object} newState
 */
function setState(userId, newState = {}) {
  if (!store[userId]) {
    store[userId] = {};
  }

  store[userId] = {
    ...store[userId],
    ...newState,
    updatedAt: Date.now()
  };
}

/**
 * เช็กว่าควรแจ้งเจ้าหน้าที่หรือยัง
 * (กัน notify ซ้ำถี่เกินไป)
 * @param {object} state
 */
function shouldNotify(state = {}) {
  const now = Date.now();
  const lastNotified = state.notifiedAt || 0;

  // แจ้งซ้ำได้ทุก 3 นาที
  const COOLDOWN_MS = 3 * 60 * 1000;

  return now - lastNotified > COOLDOWN_MS;
}

/**
 * ล้าง state การสนทนา (เช่น จบเคส)
 * @param {string} userId
 */
function clearConversation(userId) {
  delete store[userId];
}

/**
 * ✅ IMPORTANT
 * อัปเดตเวลาการใช้งานล่าสุด (ใช้ใน postbackHandler.js)
 * @param {string} userId
 */
function touch(userId) {
  if (!store[userId]) {
    store[userId] = {};
  }

  store[userId].lastActivity = Date.now();
}

// ✅ export ครบทุก function ที่ handler ใช้
module.exports = {
  getState,
  setState,
  shouldNotify,
  clearConversation,
  touch
};
