// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { helpModePreset, backToAIPreset } = require('../quickreply/presets');
const categoryMenus = require('../manual');
const matchCategory = require('../utils/matchCategory');
const { askAI } = require('../services/aiService.gemini');
const { retrieve } = require('../services/ragStore');

// =====================
// CONFIG
// =====================
const NO_DATA_REPLY =
  'ไม่พบข้อมูลที่ตรงกับคำถามนี้ในคู่มือ หากต้องการสอบถามเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ครับ';

const INACTIVE_LIMIT_MS = 30 * 60 * 1000; // 30 นาที

const blacklist = [
  'โอเค',
  'โอเคครับ',
  'ค่ะ',
  'ครับ',
  'จ้า',
  'ฮัลโหล',
  'สวัสดีครับ',
  'สวัสดีคับ',
  'สวัสดีค่ะ'
];

// =====================
// HELPERS
// =====================
function isBroadQuestion(text) {
  return (
    text.length <= 30 &&
    !text.includes('อย่างไร') &&
    !text.includes('วิธี') &&
    !text.includes('ขั้นตอน')
  );
}

// =====================
// MAIN HANDLER
// =====================
async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();
  const now = Date.now();

  const state = getState(userId) || { mode: 'ai' };

  // update last activity
  setState(userId, { lastActivity: now });

  // =====================
  // SWITCH MODE (คำสั่ง)
  // =====================
  if (['กลับไป ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ'
    });
  }

  if (['ติดต่อเจ้าหน้าที่', 'human', 'โหมดเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human', promptedAfterInactive: false });
    return reply(replyToken, backToAIPreset('เข้าสู่โหมดเจ้าหน้าที่แล้วครับ'));
  }

  // =========
  // GREETING
  // =========
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานได้เลยครับ'));
  }

  // =========================================
  //  AI MODE (RAG-first)
  // =========================================
  if (state.mode === 'ai') {
    console.log('🤖 AI MODE:', userText);

    if (isBroadQuestion(userText)) {
      return reply(replyToken, {
        type: 'text',
        text:
          'คุณต้องการสอบถามเรื่องใดครับ เช่น ขั้นตอนการลงทะเบียน หรือการตั้งรหัสผ่าน'
      });
    }

    const hits = await retrieve(userText);
    console.log('📦 RAG HITS:', hits.length);

    // 🔕 ไม่มีข้อมูล → นิ่ง
    if (!hits || hits.length === 0) {
      return;
    }

    const { answer } = await askAI(userText, hits);

    return reply(replyToken, [
      { type: 'text', text: answer || NO_DATA_REPLY },
      backToAIPreset('หากต้องการดูเมนูหรือติดต่อเจ้าหน้าที่ กดปุ่มด้านล่าง')
    ]);
  }

  // ==================================
  // CATEGORY / MANUAL (เฉพาะ human)
  // ==================================
  const matched = matchCategory(userText);
  if (matched && categoryMenus[matched]) {
    if (state.mode === 'human') {
      return reply(replyToken, categoryMenus[matched]);
    }
    return reply(
      replyToken,
      helpModePreset('เมนูนี้เปิดดูได้ในโหมดเจ้าหน้าที่')
    );
  }

  // =====================
  // HUMAN MODE (เงียบ)
  // =====================
  if (state.mode === 'human') {
    const lastActivity = state.lastActivity || now;
    const inactiveMs = now - lastActivity;

    //  ยัง active → เงียบ
    if (inactiveMs < INACTIVE_LIMIT_MS) {
      return;
    }

    //  idle เกิน 30 นาที → ถามครั้งเดียว
    if (!state.promptedAfterInactive) {
      setState(userId, { promptedAfterInactive: true });

      return reply(replyToken, {
        type: 'text',
        text: 'ยังต้องการคุยต่อหรือไม่ครับ',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'คุยต่อ',
                data: 'conv=continue'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: 'จบการสนทนา',
                data: 'conv=end'
              }
            }
          ]
        }
      });
    }

    // ถามไปแล้ว → เงียบ
    return;
  }

  // =========
  // FALLBACK
  // =========
  return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานครับ'));
}

module.exports = { handleTextMessage };
