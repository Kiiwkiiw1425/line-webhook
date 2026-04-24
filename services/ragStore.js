// services/ragStore.js

const fs = require('fs');
const path = require('path');

/* =================================================
 * Load RAG Data (Password / Register etc.)
 * ================================================= */

const RAG_PASSWORD_PATH = path.join(
  __dirname,
  '..',
  'data',
  'rag-password.json'
);

const raw = JSON.parse(fs.readFileSync(RAG_PASSWORD_PATH, 'utf8'));
const documents = raw.items || [];

/* =================================================
 * Utils
 * ================================================= */

/**
 * normalize ข้อความ
 * - ตัดช่องว่าง
 * - lower case
 */
function normalize(text = '') {
  return text.replace(/\s+/g, '').toLowerCase();
}

/**
 * คำถามเชิงขั้นตอน
 */
function isProcessQuestion(text) {
  return /ขั้นตอน|วิธี|ทำยังไง|อย่างไร|ยังไง/.test(text);
}

/**
 * ตรวจ category จากข้อความ
 * ✅ ครอบคำที่ผู้ใช้พิมพ์จริง
 */
function detectCategory(text) {
  if (/ลงทะเบียน|สมัคร|register/.test(text)) return 'Register';

  if (
    /รหัส|รหัสผ่าน|password|otp|ลืมรหัส|รีเซ็ตรหัส|กรอกไม่ได้|ไม่ได้otp/.test(
      text
    )
  ) {
    return 'Password';
  }

  return null;
}

/* =================================================
 * MAIN: retrieve (Context‑aware + RAG‑first)
 * ================================================= */

/**
 * retrieve(query, context)
 * @param {string} query   ข้อความผู้ใช้
 * @param {object} context state (เช่น lastTopic)
 */
async function retrieve(query, context = {}) {
  const q = normalize(query);

  // 1) จับ category จากคำถาม
  let category = detectCategory(q);

  // 2) ถ้าไม่เจอ แต่มี context → ใช้ context
  if (!category && context.lastTopic) {
    category = context.lastTopic;
  }

  // -------------------------------------------------
  // ✅ CASE 1: คำถามเชิงขั้นตอน → คืนทั้ง flow
  // -------------------------------------------------
  if (isProcessQuestion(q) && category) {
    return documents
      .filter(d => d.category === category)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // -------------------------------------------------
  // ✅ CASE 2: คำถามสั้น / follow‑up
  // เช่น "otp", "กรอกไม่ได้", "ลืมรหัส"
  // -------------------------------------------------
  if (category) {
    const hits = documents.filter(
      d =>
        d.category === category &&
        normalize(d.content).includes(q)
    );

    // ถ้าเจออย่างน้อย 1 → คืนทั้งเรื่อง (ไม่ตัดบท)
    if (hits.length > 0) {
      return documents
        .filter(d => d.category === category)
        .sort((a, b) => a.id.localeCompare(b.id));
    }

    // ถ้าไม่เจอ keyword ตรง ๆ แต่ยังอยู่ topic เดิม
    // → คืนทั้ง flow เพื่อไม่ให้ fallback
    if (context.lastTopic === category) {
      return documents
        .filter(d => d.category === category)
        .sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  // -------------------------------------------------
  // ✅ CASE 3: fallback keyword match (กันหลุด)
  // -------------------------------------------------
  const keywordHits = documents.filter(d =>
    normalize(d.content).includes(q)
  );

  return keywordHits.slice(0, 3);
}

module.exports = { retrieve };
