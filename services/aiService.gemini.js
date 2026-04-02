// services/aiService.gemini.js
const axios = require('axios');

/**
 * ==============================
 * CONFIG
 * ==============================
 */

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set');
  process.exit(1);
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_OUTPUT_TOKENS = 1024;

// คำที่บ่งบอกว่า AI ไม่ควรเชื่อถือ
const FAIL_KEYWORDS = [
  'ไม่แน่ใจ',
  'ไม่สามารถ',
  'ขออภัย',
  'อาจจะ',
  'น่าจะ',
  'โดยทั่วไป'
];

// ==============================
// SYSTEM PROMPT (หัวใจสำคัญ)
// ==============================
const SYSTEM_PROMPT = `
บทบาทของคุณคือ "ผู้ช่วยระบบ DPIS6"

ขอบเขตงาน:
- ตอบคำถามเฉพาะเกี่ยวกับระบบ DPIS6 เท่านั้น
- ใช้ข้อมูลจากเอกสารที่ระบบส่งให้ (knowledge) เท่านั้น

ข้อห้าม:
- ห้ามใช้ความรู้ทั่วไป
- ห้ามคาดเดา
- ห้ามเติมข้อมูลเอง
- ห้ามอธิบายนอกเหนือเอกสาร

กติกาการตอบ:
- ตอบสั้น กระชับ ชัดเจน เป็นภาษาไทยสุภาพ
- หากข้อมูลไม่ชัดเจน ให้สรุปจากข้อมูลที่ใกล้เคียงที่สุด
- หากไม่พบข้อมูลในเอกสาร ให้ตอบว่า:
  "ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่"
`.trim();

/**
 * ==============================
 * UTILS
 * ==============================
 */

// ตรวจว่า AI ควรถูกมองว่า "ตอบไม่สำเร็จ"
function aiFailed(answer) {
  if (!answer) return true;

  const text = answer.trim();

  // สั้นเกินไป มักไม่ใช่คำตอบที่มีสาระ
  if (text.length < 20) return true;

  // มีคำที่สื่อถึงการเดา / เลี่ยงตอบ
  if (FAIL_KEYWORDS.some(k => text.includes(k))) return true;

  return false;
}

// จำกัดความยาวให้เหมาะกับ LINE
function safeText(text, max = 4800) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 3) + '...' : text;
}

// รวม knowledge จาก RAG เป็นข้อความเดียว
function knowledgeToText(knowledge = []) {
  if (!Array.isArray(knowledge) || knowledge.length === 0) return '';

  const lines = knowledge.map((k, i) => {
    return `[#${i + 1}${k.category ? ` | ${k.category}` : ''}]\n${k.content}`;
  });

  return `
ต่อไปนี้คือข้อมูลจากคู่มือภายใน
คุณต้องตอบคำถามโดยอ้างอิงข้อมูลเหล่านี้เท่านั้น
หากไม่พบคำตอบในข้อมูล ให้ตอบว่า:
"ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่"

${lines.join('\n\n')}
`.trim();
}

/**
 * ==============================
 * MAIN FUNCTION
 * ==============================
 */

/**
 * ถาม AI (รองรับ RAG)
 * @param {string} question
 * @param {Array} knowledge - snippets จาก RAG
 * @param {Array} context - ประวัติสนทนา (optional)
 */
async function askAI(question, knowledge = [], context = []) {
  try {
    const hadKnowledge = Array.isArray(knowledge) && knowledge.length > 0;

    // ✅ ไม่มี knowledge → ไม่เรียก LLM แต่ตอบข้อความมาตรฐาน
    if (!hadKnowledge) {
      return {
        answer: 'ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่',
        failed: false
      };
    }

    const knowledgeText = knowledgeToText(knowledge);

    const contents = [
      // System Prompt
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },

      // Knowledge จาก RAG
      {
        role: 'user',
        parts: [{ text: knowledgeText }]
      },

      // Context เดิม (ถ้ามี)
      ...context,

      // คำถามผู้ใช้
      {
        role: 'user',
        parts: [{ text: question }]
      }
    ];

    const response = await axios.post(
      `${ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: MAX_OUTPUT_TOKENS
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join('') || '';

    const cleaned = safeText(answer);
    const failed = aiFailed(cleaned);

    return {
      answer: failed ? 'ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่' : cleaned,
      failed: false
    };
  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    return {
      answer: 'ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่',
      failed: true,
      error: err.message
    };
  }
}

module.exports = { askAI };
