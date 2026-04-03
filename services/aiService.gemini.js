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
 * ✅ AI สรุปจาก RAG (Summary Only)
 * - ใช้ทุก chunk
 * - สรุปสั้น 4–6 bullet
 * - ไม่ลงรายละเอียด (ไว้กดอ่านต่อ)
 */
async function askAI(question, hits) {
  if (!hits || hits.length === 0) {
    return {
      answer: 'ไม่พบข้อมูลที่เกี่ยวข้องในระบบ'
    };
  }

  // ✅ รวมทุกขั้นตอนจาก RAG
  const combinedContext = hits
    .map((h, i) => `ขั้นตอนที่ ${i + 1}: ${h.content}`)
    .join('\n');

  const prompt = `
คุณเป็นผู้ช่วยระบบ DPIS6

บทบาท:
- สรุปภาพรวมขั้นตอนจากคู่มือ
- ตอบสั้น กระชับ ชัดเจน
- ไม่ลงรายละเอียดเชิงลึก
- ไม่เกิน 4–6 bullet หรือ 5–7 บรรทัด

ข้อห้าม:
- ห้ามเดา
- ห้ามเพิ่มข้อมูลนอกเหนือจากข้อมูลด้านล่าง
- ห้ามอธิบายละเอียด (ผู้ใช้จะกด "อ่านต่อ" เอง)

ข้อมูลจากคู่มือ:
${combinedContext}

คำถาม:
${question}

รูปแบบคำตอบ:
- ใช้ bullet หรือเลขลำดับ
- ภาษาไทยสุภาพ
- อ่านง่ายบน LINE
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
          temperature: 0.15,
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
        ?.trim() ||
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
