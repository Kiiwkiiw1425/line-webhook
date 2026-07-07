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

/* =================================================
 * AI Confidence Check
 * ================================================= */

const FAIL_PHRASES = [
  'ไม่ทราบ',
  'ไม่มีข้อมูล',
  'ไม่สามารถระบุ',
  'ไม่แน่ใจ',
  'ขออภัย',
  'ไม่พบข้อมูล'
];

function isFailedAnswer(text = '') {

  const answer = text.toLowerCase();

  if (!answer) return true;

  if (answer.length < 15) return true;

  return FAIL_PHRASES.some(word =>
    answer.includes(word.toLowerCase())
  );
}

/* =================================================
 * Build Prompt
 * ================================================= */

function buildPrompt(question, hits = []) {

  const hasKnowledge =
    Array.isArray(hits) &&
    hits.length > 0;

  const knowledge = hasKnowledge
    ? hits
        .map((h, i) =>
          `ข้อมูลที่ ${i + 1}\nหัวข้อ: ${h.title}\nเนื้อหา: ${h.content}`
        )
        .join('\n\n')
    : 'ไม่มีข้อมูลจากคู่มือ';

  return `
คุณคือผู้ช่วยระบบ DPIS6

หลักการตอบ:

1. ถ้ามีข้อมูลจากคู่มือ ให้ใช้ข้อมูลจากคู่มือเป็นหลัก
2. สามารถเรียบเรียงใหม่ให้เข้าใจง่ายได้
3. หากไม่มีข้อมูลจากคู่มือ สามารถตอบจากความรู้ทั่วไปได้
4. ห้ามคาดเดาฟังก์ชันเฉพาะของระบบ DPIS6
5. ถ้าไม่มั่นใจ ให้ตอบว่า
   "ไม่มีข้อมูลเพียงพอ กรุณาติดต่อเจ้าหน้าที่"

ข้อมูลจากคู่มือ:

${knowledge}

คำถาม:

${question}

รูปแบบการตอบ:

- สุภาพ
- ภาษาไทย
- กระชับ
- เน้นขั้นตอนการใช้งาน
- ถ้าเป็นวิธีดำเนินการให้ตอบเป็นลำดับขั้นตอน
`.trim();
}

/* =================================================
 * Ask Gemini
 * ================================================= */

async function askAI(question, context = [], hits = []) {

  try {

    const prompt =
      buildPrompt(question, hits);

    const response = await axios.post(
      ENDPOINT,
      {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join('')
        .trim() || '';

    return {
      answer,
      failed: isFailedAnswer(answer)
    };

  } catch (err) {

    console.error(
      '❌ Gemini API Error:',
      err.response?.data || err.message
    );

    return {
      answer: null,
      failed: true
    };
  }
}

module.exports = {
  askAI
};
