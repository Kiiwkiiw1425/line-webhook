// services/ragStore.js

const documents = require('../data/knowledge.json');

function score(text, query) {
  let s = 0;
  query.split(' ').forEach(q => {
    if (text.includes(q)) s += 1;
  });
  return s;
}

async function retrieve(query, topK = 3) {
  const scored = documents
    .map(doc => ({
      ...doc,
      score: score(doc.text, query)
    }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

module.exports = { retrieve };
``
