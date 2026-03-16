// services/aiService.gemini.js
const axios = require('axios');

/**
 * ==============================
 * CONFIG
 * ==============================
 */

// รุ่นที่เหมาะกับ Free tier + chatbot
// เปลี่ยนเป็นรุ่นอื่นได้ภายหลัง โดยไม่ต้องแก้โค้ดที่เรียก
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set');
  process.exit(1);
}

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// จำกัดความยาว output กันข้อความยาวเกิน LINE
const MAX_OUTPUT_TOKENS = 1024;

// คำที่ใช้บอกว่า AI "ไม่มั่นใจ"
const FAIL_KEYWORDS = [
  'ไม่แน่ใจ',
  'ไม่มีข้อมูล',
  'ไม่สามารถ',
  'ไม่พบข้อมูล',
  'ขออภัย'
];

/**
 * ==============================
 * UTILS
 * ==============================
 */

// ตรวจว่า AI ควรถูกมองว่า "ตอบไม่สำเร็จ"
function aiFailed(answer) {
  if (!answer) return true;

  const text = answer.trim();

  // สั้นเกินไป
  if (text.length < 30) return true;

  // มี keyword ที่บอกว่าไม่มั่นใจ
  return FAIL_KEYWORDS.some(k => text.includes(k));
}

// ตัดความยาวให้ปลอดภัยกับ LINE
function safeText(text, max = 4800) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 3) + '...' : text;
}

/**
 * ==============================
 * MAIN FUNCTION
 * ==============================
 */

/**
 * ถาม AI
 * @param {string} question - ข้อความจาก user
 * @param {Array} context - (optional) conversation history
 * @returns {Promise<{answer: string|null, failed: boolean, error?: string}>}
 */
async function askAI(question, context = []) {
  try {
    const contents = [
      // system prompt (ภาษาไทย + คุมสไตล์)
      {
        role: 'user',
        parts: [
          {
            text:
              'คุณคือผู้ช่วยฝ่ายบริการลูกค้า ตอบเป็นภาษาไทย ' +
              'ตอบสั้น กระชับ สุภาพ และตรงประเด็น ' +
              'ถ้าไม่มั่นใจให้ตอบตามความจริง'
          }
        ]
      },

      // context เดิม (ถ้ามี)
      ...context,

      // คำถามจากผู้ใช้
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
          temperature: 0.3,
          maxOutputTokens: MAX_OUTPUT_TOKENS
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 12000
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join('') || '';

    const cleaned = safeText(answer);
    const failed = aiFailed(cleaned);

    return {
      answer: cleaned || null,
      failed
    };
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    return {
      answer: null,
      failed: true,
      error: err.message
    };
  }
}

module.exports = { askAI };
