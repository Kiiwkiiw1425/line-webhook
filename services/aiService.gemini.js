// services/aiService.gemini.js

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-1.5-flash-001';

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing');
  process.exit(1);
}

const ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * ✅ ถาม Gemini โดยรวม knowledge ทุก chunk แล้วสรุปครั้งเดียว
 */
async function askAI(question, hits) {
  if (!hits || hits.length === 0) {
    return {
      answer: 'ไม่พบข้อมูลที่เกี่ยวข้องในระบบ'
    };
  }

  // ✅ รวมทุกขั้นตอนจาก RAG ให้ AI เห็นทั้งหมด
  const combinedContext = hits
    .map((h, i) => `ขั้นตอนที่ ${i + 1}: ${h.content}`)
    .join('\n');

  const prompt = `
คุณเป็นผู้ช่วยระบบ DPIS6

คำสั่ง:
- ใช้ข้อมูลด้านล่างเท่านั้น
- สรุปขั้นตอนทั้งหมดให้ครบ
- เรียงลำดับขั้นตอนให้เข้าใจง่าย
- ตอบเป็นคำตอบเดียว ห้ามแยกหลายข้อความ
- ห้ามเดา ห้ามเพิ่มข้อมูล

ข้อมูลจากคู่มือ:
${combinedContext}

คำถาม:
${question}

รูปแบบคำตอบ:
- ใช้ bullet หรือเลขลำดับ
- เขียนเป็นภาษาไทยสุภาพ
`.trim();

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
          maxOutputTokens: 1024
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
