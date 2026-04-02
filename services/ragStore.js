// services/ragStore.js
const fs = require('fs');
const path = require('path');

// ✅ ชี้ไปที่ไฟล์ที่คุณมีจริง
const RAG_INDEX_PATH = path.join(__dirname, '..', 'data', 'rag-index.json');

let documents = [];

// โหลด knowledge ตอน start app
try {
  if (fs.existsSync(RAG_INDEX_PATH)) {
    const raw = fs.readFileSync(RAG_INDEX_PATH, 'utf8');
    documents = JSON.parse(raw);
    console.log(`✅ Loaded ${documents.length} RAG knowledge chunks`);
  } else {
    console.warn('⚠️ rag-index.json not found – RAG will return no results');
  }
} catch (err) {
  console.error('❌ Failed to load rag-index.json:', err.message);
}

/**
 * ✅ Simple RAG Retrieval
 * @param {string} query
 * @param {number} topK
 */
async function retrieve(query, topK = 3) {
  if (!query || documents.length === 0) return [];

  const tokens = query.split(/\s+/);

  const scored = documents
    .map(doc => {
      const text = doc.content || '';
      const score = tokens.reduce(
        (sum, t) => (text.includes(t) ? sum + 1 : sum),
        0
      );
      return { ...doc, score };
    })
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

module.exports = { retrieve };
