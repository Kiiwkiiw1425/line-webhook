// services/aiService.gemini.js
const axios = require('axios');

/**
 * ==============================
 * CONFIG
 * ==============================
 */

// รุ่นที่เหมาะกับ Free tier + chatbot
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set');
  process.exit(1);
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// จำกัดความยาว output กันข้อความยาวเกิน LINE
const MAX_OUTPUT_TOKENS = 1024;

// คำที่ใช้บอกว่า AI "ไม่มั่นใจ/ไม่ควรใช้"
const FAIL_KEYWORDS = ['ไม่แน่ใจ', 'ไม่มีข้อมูล', 'ไม่สามารถ', 'ไม่พบข้อมูล', 'ขออภัย'];
const FORBIDDEN_GUESS_WORDS = ['น่าจะ', 'อาจจะ', 'โดยทั่วไป', 'คาดว่า', 'ประมาณ'];

// ข้อความระบบ (บทบาท/ข้อห้าม/สไตล์ภาษา)
const SYSTEM_PROMPT = `
บทบาทของคุณคือ "ผู้ช่วยระบบ DPIS6"

ขอบเขตงาน:
- ตอบคำถามเฉพาะเรื่องระบบ DPIS6 เท่านั้น
- ใช้ข้อมูลจากเอกสารที่ระบบส่งให้ (knowledge) เท่านั้น

ข้อห้าม:
- ห้ามใช้ความรู้ทั่วไป
- ห้ามคาดเดา
- ห้ามเติมข้อมูลเอง
- ห้ามอธิบายนอกเหนือ DPIS6

กติกาการตอบ:
- ตอบสั้น กระชับ ชัดเจน เป็นทางการ
- หากไม่พบข้อมูลในเอกสาร ให้ตอบประโยคเดียวว่า:
  "ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่"

รูปแบบภาษา:
- ภาษาไทยสุภาพ
- ไม่ใช้คำว่า "น่าจะ", "อาจจะ", "โดยทั่วไป"
`.trim();

/**
 * ==============================
 * UTILS
 * ==============================
 */

// ตรวจว่า AI ควรถูกมองว่า "ตอบไม่สำเร็จ"
function aiFailed(answer, opts = {}) {
  const { hadKnowledge = true } = opts;

  // ถ้าไม่มีแหล่งความรู้เลย ถือว่า fail ทันที (ปิดความรู้)
  if (!hadKnowledge) return true;

  if (!answer) return true;

  const text = answer.trim();

  // สั้นเกินไป → มักจะไม่ใช่คำตอบที่มีสาระ
  if (text.length < 30) return true;

  // มี keyword ที่บอกว่าไม่มั่นใจ
  if (FAIL_KEYWORDS.some(k => text.includes(k))) return true;

  // มีคำแนวคาดเดา/กว้าง
  if (FORBIDDEN_GUESS_WORDS.some(k => text.includes(k))) return true;

  return false;
}

// ตัดความยาวให้ปลอดภัยกับ LINE
function safeText(text, max = 4800) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 3) + '...' : text;
}

// รวม knowledge (snippets) เป็นข้อความเดียว พร้อมหัวเรื่อง/คะแนน (ถ้ามี)
function knowledgeToText(knowledge = []) {
  if (!Array.isArray(knowledge) || knowledge.length === 0) return '';
  const lines = knowledge.map((k, i) => {
    const head = `[#${i + 1}${k.category ? ` | ${k.category}` : ''}${typeof k.score === 'number' ? ` | score=${k.score.toFixed(2)}` : ''}]`;
    return `${head}\n${k.content || ''}`;
  });
  return `ต่อไปนี้คือข้อความจากคู่มือภายใน ให้ตอบโดยอ้างอิงข้อมูลเหล่านี้เท่านั้น หากไม่พบคำตอบในข้อมูล ให้ตอบว่า "ไม่มีข้อมูล หรือไม่มีคำตอบ กรุณาติดต่อเจ้าหน้าที่":\n\n${lines.join('\n\n')}`;
}

/**
 * ==============================
 * MAIN FUNCTION
 * ==============================
 */

/**
 * ถาม AI (รองรับ RAG)
 * @param {string} question - คำถามจากผู้ใช้
 * @param {Array} context - ประวัติการสนทนา (ถ้ามี)
 * @param {Array<{id?:string,category?:string,content:string,score?:number}>} knowledge - snippets จาก RAG (ถ้ามี)
 * @returns {Promise<{answer: string|null, failed: boolean, error?: string}>}
 */
async function askAI(question, context = [], knowledge = []) {
  try {
    // Guardrail ก่อนเรียกโมเดล: ถ้าไม่มี knowledge → ไม่เรียก AI (ตามหลัก closed-book)
    const hadKnowledge = Array.isArray(knowledge) && knowledge.length > 0;
    const knowledgeText = knowledgeToText(knowledge);

    if (!hadKnowledge) {
      // ไม่ค้นเจออะไรใน RAG → กลับ failed ให้ชั้นบนจัดการ
      return { answer: null, failed: true };
    }

    // สร้าง payload ให้ Gemini
    const contents = [
      // System Prompt: บทบาท/ข้อห้าม/สไตล์ภาษา
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },

      // Knowledge จาก RAG
      ...(knowledgeText ? [{ role: 'user', parts: [{ text: knowledgeText }] }] : []),

      // ประวัติสนทนา (ถ้ามี)
      ...context,

      // คำถามจากผู้ใช้
      { role: 'user', parts: [{ text: question }] }
    ];

    const response = await axios.post(
      `${ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents,
        generationConfig: {
          temperature: 0.2,            // เน้นความเสถียร/ความตรง
          maxOutputTokens: MAX_OUTPUT_TOKENS
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 12000
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';

    const cleaned = safeText(answer);
    const failed = aiFailed(cleaned, { hadKnowledge });

    return { answer: cleaned || null, failed };
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    return { answer: null, failed: true, error: err.message };
  }
}

module.exports = { askAI };
