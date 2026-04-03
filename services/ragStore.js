// services/ragStore.js
const fs = require('fs');
const path = require('path');

const RAG_INDEX_PATH = path.join(__dirname, '..', 'data', 'rag-index.json');

let documents = [];

// โหลด RAG index ตอน start
try {
  if (fs.existsSync(RAG_INDEX_PATH)) {
    const raw = fs.readFileSync(RAG_INDEX_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    // ✅ จุดสำคัญ: ใช้ parsed.items
    documents = Array.isArray(parsed.items) ? parsed.items : [];

    console.log(`✅ Loaded ${documents.length} RAG knowledge items`);
  } else {
    console.warn('⚠️ rag-index.json not found – RAG disabled');
  }
} catch (err) {
  console.error('❌ Failed to load rag-index.json:', err.message);
}

/**
 * Simple keyword-based retrieval
 */
async function retrieve(query, topK = 3) {
  console.log('🔍 retrieve query =', query);
  console.log('📚 documents loaded =', documents.length);

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

  console.log('✅ RAG hits =', scored.length);
  return scored;
}

module.exports = { retrieve };
