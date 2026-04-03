// services/aiService.gemini.js

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash';

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
}

const ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * ✅ ถาม Gemini โดยใช้ context จาก RAG เพียง 1 chunk
 */
async function askAI(question, hits) {
  const context = hits[0].content;

  const prompt = `
คุณเป็นผู้ช่วยระบบ
ตอบคำถามโดยใช้ข้อมูลด้านล่างเท่านั้น
ห้ามเดา ห้ามเพิ่มข้อมูลนอกเหนือจากนี้

ข้อมูล:
${context}

คำถาม:
${question}
`;

  try {
    const response = await axios.post(
      ENDPOINT,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'ไม่สามารถประมวลผลคำตอบได้';

    return { answer };
  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    return {
      answer: 'ขออภัย ระบบไม่สามารถตอบคำถามได้ในขณะนี้'
    };
  }
}

module.exports = { askAI };
