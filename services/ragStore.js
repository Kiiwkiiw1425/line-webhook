// services/ragStore.js
const fs = require('fs');
const path = require('path');

const RAG_INDEX_PATH = path.join(
  __dirname,
  '..',
  'data',
  'rag-registration.json'
);

// โหลด RAG data
const raw = JSON.parse(fs.readFileSync(RAG_INDEX_PATH, 'utf8'));
const documents = raw.items || [];

/**
 * normalize ภาษาไทย/อังกฤษแบบเบา
 */
function normalize(text = '') {
  return text.replace(/\s+/g, '').toLowerCase();
}

/**
 * ตรวจว่าเป็นคำถามเชิง "ขั้นตอน/วิธี" ไหม
 */
function isProcessQuestion(text) {
  return /ขั้นตอน|วิธี|ทำยังไง|อย่างไร/.test(text);
}

/**
 * ตรวจ category จากคำถาม (simple rule-based)
 */
function detectCategory(text) {
  if (/ลงทะเบียน|สมัคร|register/.test(text)) return 'Register';
  if (/รหัส|รหัสผ่าน|password|otp/.test(text)) return 'Password';
  return null;
}

async function retrieve(query) {
  const q = normalize(query);
  const category = detectCategory(q);

  // ✅ กรณีเป็นคำถามเชิงขั้นตอน + รู้ category
  if (isProcessQuestion(q) && category) {
    return documents
      .filter(d => d.category === category)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // ✅ กรณีถามสั้น ๆ เช่น "ลืมรหัส" / "เปลี่ยนรหัส"
  if (category) {
    const hits = documents.filter(
      d =>
        d.category === category &&
        normalize(d.content).includes(q)
    );

    // ถ้าเจออย่างน้อย 1 chunk → คืนทั้ง flow
    if (hits.length > 0) {
      return documents
        .filter(d => d.category === category)
        .sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  // ✅ fallback: keyword match (คืนได้หลาย item)
  return documents
    .filter(d => normalize(d.content).includes(q))
    .slice(0, 3);
}

module.exports = { retrieve };
