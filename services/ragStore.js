// services/ragStore.js

const fs = require('fs');
const path = require('path');

/* =================================================
 * Load RAG Data
 * ================================================= */

const RAG_PASSWORD_PATH = path.join(
  __dirname,
  '..',
  'data',
  'rag-password.json'
);

const raw = JSON.parse(
  fs.readFileSync(RAG_PASSWORD_PATH, 'utf8')
);

const documents = raw.items || [];

/* =================================================
 * Utils
 * ================================================= */

function normalize(text = '') {
  return text
    .replace(/\s+/g, '')
    .toLowerCase();
}

function isProcessQuestion(text = '') {
  return /ขั้นตอน|วิธี|ทำยังไง|อย่างไร|ยังไง|เปลี่ยน|ลืม/.test(text);
}

function detectCategory(text) {

  if (
    /เปลี่ยนรหัสผ่าน|ลืมรหัสผ่าน|รีเซ็ตรหัส|otp|password|รหัสผ่าน|รหัส|เข้าไม่ได้|ไม่ได้otp/.test(
      text
    )
  ) {
    return 'Password';
  }

  if (
    /ลงทะเบียน|สมัคร|register/.test(text)
  ) {
    return 'Register';
  }

  return null;
}

/* =================================================
 * Main
 * ================================================= */

async function retrieve(query, context = {}) {

  const q = normalize(query);

  let category = detectCategory(q);

  if (!category && context.lastTopic) {
    category = context.lastTopic;
  }

  // =========================
  // category match
  // =========================

  if (category) {

    const categoryDocs = documents.filter(
      d => d.category === category
    );

    if (categoryDocs.length > 0) {
      return categoryDocs;
    }
  }

  // =========================
  // title match
  // =========================

  const titleHits = documents.filter(doc =>
    normalize(doc.title).includes(q)
  );

  if (titleHits.length > 0) {
    return titleHits;
  }

  // =========================
  // content match
  // =========================

  const contentHits = documents.filter(doc =>
    normalize(doc.content).includes(q)
  );

  if (contentHits.length > 0) {
    return contentHits;
  }

  // =========================
  // keyword fallback
  // =========================

  const words = q.split(/[,\s]+/);

  const keywordHits = documents.filter(doc => {

    const source =
      normalize(doc.title) +
      normalize(doc.content);

    return words.some(word =>
      source.includes(word)
    );
  });

  return keywordHits.slice(0, 5);
}

module.exports = {
  retrieve
};
