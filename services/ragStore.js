const fs = require('fs');
const path = require('path');

const RAG_PATH = path.join(__dirname, '..', 'data', 'rag-index.json');
let documents = [];

function normalize(text='') {
  return text.replace(/\s+/g,'').toLowerCase();
}

const raw = JSON.parse(fs.readFileSync(RAG_PATH, 'utf8'));
documents = raw.items || [];

// services/ragStore.js
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
