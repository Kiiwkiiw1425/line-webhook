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
  const q = query.replace(/\s+/g, '');

  // ถ้าถามเรื่อง "ขั้นตอน" หรือ "วิธี"
  if (/ขั้นตอน|วิธี|ลงทะเบียน/.test(q)) {
    // ✅ ดึงทั้ง flow ตาม id
    return documents
      .filter(d => d.category === 'DPIS6-Registration')
      .sort((a, b) => a.id.localeCompare(b.id)); // reg-01 → reg-04
  }

  // fallback: ดึง item เดียว
  return documents.filter(d =>
    d.content.replace(/\s+/g,'').includes(q)
  ).slice(0,1);
}

module.exports = { retrieve };
