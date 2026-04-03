// services/ragStore.js
const fs = require('fs');
const path = require('path');

const RAG_INDEX_PATH = path.join(__dirname, '..', 'data', 'rag-index.json');

const raw = JSON.parse(fs.readFileSync(RAG_INDEX_PATH, 'utf8'));
const documents = raw.items || [];

function normalize(text = '') {
  return text.replace(/\s+/g, '').toLowerCase();
}

async function retrieve(query) {
  const q = normalize(query);

  // ✅ คำถามเชิง "ขั้นตอน / วิธี" → ดึงทั้ง flow
  if (/ขั้นตอน|วิธี|ลงทะเบียน/.test(q)) {
    return documents
      .filter(d => d.category === 'DPIS6-Registration')
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // ✅ คำถามเจาะจุด → เอา item เดียว
  return documents
    .map(d => ({ ...d, score: normalize(d.content).includes(q) ? 1 : 0 }))
    .filter(d => d.score > 0)
    .slice(0, 1);
}

module.exports = { retrieve };
