// services/ragStore.js

const fs = require('fs');
const path = require('path');

/**
 * --------------------------------------------------
 * 1) LOAD ALL RAG FILES (rag-*.json)
 * --------------------------------------------------
 */

const DATA_DIR = path.join(__dirname, '..', 'data');

// โหลดทุกไฟล์ที่ขึ้นต้นด้วย rag- และลงท้าย .json
function loadAllRagFiles() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter(name => name.startsWith('rag-') && name.endsWith('.json'));

  let items = [];

  for (const file of files) {
    try {
      const filePath = path.join(DATA_DIR, file);
      const json = require(filePath);

      if (Array.isArray(json.items)) {
        items = items.concat(json.items);
      }
    } catch (err) {
      console.error(`❌ Failed to load RAG file: ${file}`, err.message);
    }
  }

  return items;
}

// โหลดครั้งเดียวตอน start server
const RAG_ITEMS = loadAllRagFiles();

console.log(`✅ RAG loaded: ${RAG_ITEMS.length} items`);

/**
 * --------------------------------------------------
 * 2) NORMALIZE TEXT (สำคัญมากสำหรับภาษาไทย)
 * --------------------------------------------------
 */

function normalize(text = '') {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\wก-๙]/g, '');
}

/**
 * --------------------------------------------------
 * 3) KEYWORD-BASED SEARCH (robust)
 * --------------------------------------------------
 */

function keywordMatch(query, text) {
  const q = normalize(query);
  const t = normalize(text);
  return t.includes(q);
}

/**
 * --------------------------------------------------
 * 4) RETRIEVE FUNCTION (MAIN API)
 * --------------------------------------------------
 */

function retrieve(query, options = {}) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const {
    category = null,      // optional filter by category
    limit = 6             // default limit
  } = options;

  const results = [];

  for (const item of RAG_ITEMS) {
    if (category && item.category !== category) {
      continue;
    }

    if (
      keywordMatch(query, item.title) ||
      keywordMatch(query, item.content)
    ) {
      results.push(item);
    }
  }

  // ลบซ้ำด้วย id
  const unique = Array.from(
    new Map(results.map(item => [item.id, item])).values()
  );

  return unique.slice(0, limit);
}

/**
 * --------------------------------------------------
 * 5) EXPORT
 * --------------------------------------------------
 */

module.exports = {
  retrieve,
  RAG_ITEMS
};
