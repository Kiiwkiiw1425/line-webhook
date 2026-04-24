// services/ragStore.js

const fs = require('fs');
const path = require('path');

// ✅ ใช้ไฟล์ RAG ตัวใหม่
const RAG_INDEX_PATH = path.join(
  __dirname,
  '..',
  'data',
  'rag-registration.json'
);

// โหลด RAG data
const raw = JSON.parse(fs.readFileSync(RAG_INDEX_PATH, 'utf8'));
const documents = raw.items || [];

/* =================================================
 * Utility
 * ================================================= */

/**
 * normalize ภาษาไทย/อังกฤษ (ตัดช่องว่าง + lower)
 */
function normalize(text = '') {
  return text.replace(/\s+/g, '').toLowerCase();
}

/**
 * ตรวจว่าเป็นคำถามเชิงขั้นตอน/วิธีการไหม
 */
function isProcessQuestion(text) {
  return /ขั้นตอน|วิธี|ทำยังไง|อย่างไร|ยังไง/.test(text);
}

/**
 * ตรวจ category จากคำถามตรง ๆ
 */
function detectCategory(text) {
  if (/ลงทะเบียน|สมัคร|register/.test(text)) return 'Register';
  if (/รหัส|รหัสผ่าน|password|otp/.test(text)) return 'Password';
  return null;
}

/* =================================================
 * MAIN: retrieve (Context‑aware)
 * ================================================= */

/**
 * retrieve(query, context)
 * @param {string} query   ข้อความจากผู้ใช้
 * @param {object} context state ผู้ใช้ (เช่น lastTopic)
 */
async function retrieve(query, context = {}) {
  const q = normalize(query);

  // ✅ พยายามจับ category จากคำถาม
  let category = detectCategory(q);

  // ✅ ถ้าคำถามสั้น/คลุมเครือ (follow‑up) → ใช้ topic เดิม
  if (!category && context.lastTopic) {
    category = context.lastTopic;
  }

  // ✅ กรณีเป็นคำถามเชิง "ขั้นตอน/วิธี" และรู้ category
  if (isProcessQuestion(q) && category) {
    return documents
      .filter(d => d.category === category)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // ✅ กรณีถามสั้น ๆ เช่น "otp", "ลืมรหัส", "กรอกไม่ได้"
  if (category) {
    // หาคำที่ match ใน content ก่อน
    const hits = documents.filter(
      d =>
        d.category === category &&
        normalize(d.content).includes(q)
    );

    // ถ้าเจออย่างน้อย 1 → คืนทั้ง flow ของเรื่องนั้น
    if (hits.length > 0) {
      return documents
        .filter(d => d.category === category)
        .sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  // ✅ fallback ระดับสุดท้าย: keyword match ทั่วไป
  const keywordHits = documents.filter(d =>
    normalize(d.content).includes(q)
  );

  return keywordHits.slice(0, 3);
}

module.exports = { retrieve };
