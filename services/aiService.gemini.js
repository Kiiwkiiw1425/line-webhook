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
 * ✅ AI อธิบายแบบมนุษย์ (RAG-assisted generative)
 */
async function askAI(question, hits) {
  const context =
    hits && hits.length > 0
      ? hits.map((h, i) => `ข้อมูลที่ ${i + 1}: ${h.content}`).join('\n')
      : 'ยังไม่มีข้อมูลจากคู่มือในหัวข้อนี้';

  const prompt = `
คุณเป็นผู้ช่วยแนะนำการใช้งานระบบ DPIS6

ลักษณะการตอบ:
- สุภาพ เป็นกันเอง เหมือนเจ้าหน้าที่พูดกับผู้ใช้งาน
- เรียบเรียงใหม่ได้ ไม่ต้องใช้คำเหมือนเอกสาร
- อธิบายให้เข้าใจง่าย

ข้อมูลอ้างอิง:
${context}

คำถามของผู้ใช้:
${question}

รูปแบบคำตอบ:
- เริ่มต้นด้วยประโยคสุภาพ
- อธิบายสิ่งที่พอช่วยได้จากข้อมูลที่มี
- ลงท้ายด้วยการเสนอความช่วยเหลือเพิ่มเติม
`.trim();

  try {
    const response = await axios.post(
      ENDPOINT,
      {
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 400
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join('')
        .trim() ||
      'ขออภัยครับ ระบบยังไม่สามารถให้คำตอบได้ในขณะนี้';

    return { answer };

  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    return {
      answer: 'ขออภัยครับ ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง'
    };
  }
}

module.exports = { askAI };
