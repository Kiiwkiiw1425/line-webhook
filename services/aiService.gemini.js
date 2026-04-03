// services/aiService.gemini.js

const axios = require('axios');

// =====================
// CONFIG
// =====================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-1.5-flash-001';

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
  process.exit(1);
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// =====================
// MAIN FUNCTION
// =====================

/**
 * ✅ ถาม Gemini โดยใช้ข้อมูลจาก RAG (strict / closed-book)
 * @param {string} question
 * @param {Array<{ content: string }>} hits
 */
async function askAI(question, hits) {
  // ❌ ไม่มี knowledge → ไม่ควรเรียก AI
  if (!hits || hits.length === 0) {
    return {
      answer: 'ไม่พบข้อมูลที่เกี่ยวข้องในระบบ'
    };
  }

  // ใช้ chunk แรกเป็น context
  const context = hits[0].content;

  const prompt = `
คุณเป็นผู้ช่วยระบบ

กติกา:
- ตอบคำถามโดยใช้ข้อมูลด้านล่างเท่านั้น
- ห้ามเดา
- ห้ามใช้ความรู้ภายนอก
- ห้ามเพิ่มข้อมูลเอง

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
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join('') ||
      'ไม่สามารถประมวลผลคำตอบได้';

    return { answer };
  } catch (err) {
    console.error(
      '❌ Gemini API Error:',
      err.response?.data || err.message
    );

    return {
      answer: 'ขออภัย ระบบไม่สามารถตอบคำถามได้ในขณะนี้'
    };
  }
}

module.exports = { askAI };
