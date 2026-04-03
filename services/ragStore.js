const fs = require('fs');
const path = require('path');

const RAG_PATH = path.join(__dirname, '..', 'data', 'rag-index.json');
let documents = [];

function normalize(text='') {
  return text.replace(/\s+/g,'').toLowerCase();
}

const raw = JSON.parse(fs.readFileSync(RAG_PATH, 'utf8'));
documents = raw.items || [];

async function retrieve(query) {
  const nq = normalize(query);

  const scored = documents.map(d => {
    const text = normalize(d.content || '');
    let score = 0;
    if (text.includes(nq) || nq.includes(text)) score += 3;
    if (nq.includes('ขั้นตอน') && text.includes('ขั้นตอน')) score += 2;
    return { ...d, score };
  })
  .filter(d => d.score > 0)
  .sort((a,b) => b.score - a.score);

  return scored.slice(0,1); // ✅ top‑1
}

module.exports = { retrieve };
