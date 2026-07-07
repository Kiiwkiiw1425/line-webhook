// services/embeddingService.js

const axios = require('axios');

const API_KEY =
  process.env.GEMINI_API_KEY;

async function createEmbedding(text) {

  const response =
    await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${API_KEY}`,
      {
        content: {
          parts: [
            {
              text
            }
          ]
        }
      }
    );

  return response.data.embedding.values;
}

module.exports = {
  createEmbedding
};
