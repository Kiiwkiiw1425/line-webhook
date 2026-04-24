// services/ragStore.js

const fs = require('fs');
const path = require('path');

const RAG_INDEX_PATH = path.join(
  __dirname,
  '..',
  'data',
  'rag-registration.json'
);

const raw = JSON.parse(fs.readFileSync(RAG_INDEX_PATH, 'utf8'));
const documents = raw.items || [];

/**
 * normalize ภาษาไทยแบบเบา ๆ
 */
function normalize(text = '') {
  return text.replace(/\s+/g, '').toLowerCase();
}

/**
 * detect ว่าเป็นคำถามเชิง "ขั้นตอน"
 */
function isProcessQuestion(text) {
  return /ขั้นตอน|วิธี|ทำยังไง|อย่างไร/.test(text);
}

/**
 * detect category จากคำถาม (simple + intent-friendly)
 */
function detectCategory(text) {
  if (/ลงทะเบียน|สมัคร|register/.test(text)) return 'Register';
  if (/รหัส|รหัสผ่าน|password|otp/.test(text)) return 'Password';
  return null;
}

async function retrieve(query) {
  const q = normalize(query);

  const category = detectCategory(q);

  // ✅ กรณีเป็นคำถามเชิงขั้นตอน + รู้ category → คืนทั้ง flow
  if (isProcessQuestion(q) && category) {
    return documents
      .filter(d => d.category === category)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // ✅ กรณีเป็นคำถาม keyword ตรง category (เช่น "ลงทะเบียน")
  if (category) {
    const hits = documents.filter(
      d =>
        d.category === category &&
        normalize(d.content).includes(q)
    );

    // ถ้าเจอบางส่วน → คืนทั้งหมดใน flow เดียวกัน
    if (hits.length > 0) {
      return documents
        .filter(d => d.category === category)
        .sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  // ✅ fallback: keyword match เฉพาะจุด (คืนได้หลาย item)
  const keywordHits = documents.filter(d =>
    normalize(d.content).includes(q)
  );

  return keywordHits.slice(0, 3);
}

module.exports = { retrieve };
