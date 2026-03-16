// services/ragStore.js
const fs = require('fs');
const path = require('path');

const INDEX_PATH = process.env.RAG_INDEX_PATH || './data/rag-index.json';

let index = null;

function loadIndex() {
  if (!index) {
    index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  }
  return index;
}

function retrieve(query) {
  const { items } = loadIndex();
  // (ในระบบจริง จะมี embedding + similarity)
  return items.slice(0, 3); // ทดสอบเบื้องต้น
}

module.exports = { retrieve };
