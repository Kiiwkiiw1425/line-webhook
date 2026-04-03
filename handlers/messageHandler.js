// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { helpModePreset, backToAIPreset } = require('../quickreply/presets');
const categoryMenus = require('../manual');
const matchCategory = require('../utils/matchCategory');
const { askAI } = require('../services/aiService.gemini');
const { retrieve } = require('../services/ragStore');

const NO_DATA_REPLY =
  'ไม่พบข้อมูลที่ตรงกับคำถามนี้ในคู่มือ หากต้องการสอบถามเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้ครับ';

// คำทัก/คำพูดสั้น ๆ
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

// คำถามกว้าง ยังไม่ชัดเจน
function isBroadQuestion(text) {
  return (
    text.length <= 30 &&
    !text.includes('อย่างไร') &&
    !text.includes('วิธี') &&
    !text.includes('ขั้นตอน')
  );
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  // ค่าเริ่มต้น: โหมด AI
  const state = getState(userId) || { mode: 'ai' };

  // =====================
  // Switch Mode (คำสั่ง)
  // =====================
  if (['กลับไป ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ'
    });
  }

  if (['ติดต่อเจ้าหน้าที่', 'human', 'โหมดเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, backToAIPreset('เข้าสู่โหมดเจ้าหน้าที่แล้วครับ'));
  }

  // =========
  // Greeting
  // =========
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานได้เลยครับ'));
  }

  // =========================================
  // ✅ AI MODE (RAG ต้องได้ตอบเป็นอันดับแรก)
  // =========================================
  if (state.mode === 'ai') {
    console.log('🤖 AI MODE:', userText);

    // คำถามกว้าง → ชวนถามให้ชัด
    if (isBroadQuestion(userText)) {
      return reply(replyToken, {
        type: 'text',
        text:
          'คุณต้องการสอบถามเรื่องใดครับ เช่น ขั้นตอนการลงทะเบียน หรือการตั้งรหัสผ่าน'
      });
    }

    // ดึงข้อมูลจาก RAG
    const hits = await retrieve(userText);
    console.log('📦 RAG HITS:', hits.length);

    // ❌ ไม่มีข้อมูล
    if (!hits || hits.length === 0) {
      return reply(replyToken, {
        type: 'text',
        text: 'ไม่พบข้อมูลในคู่มือสำหรับคำถามนี้'
      });
    }

    // ✅ มีข้อมูล → ให้ AI ตอบ
    const { answer } = await askAI(userText, hits);

    return reply(replyToken, [
      { type: 'text', text: answer || NO_DATA_REPLY },
      backToAIPreset('หากต้องการดูเมนูหรือติดต่อเจ้าหน้าที่ กดปุ่มด้านล่าง')
    ]);
  }

  // ==================================
  // Category / Manual Menu (รองจาก AI)
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

  // =============
  // HUMAN MODE
  // =============
  if (state.mode === 'human') {
    return reply(
      replyToken,
      backToAIPreset(
        'ผมบันทึกข้อความให้เจ้าหน้าที่แล้ว หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง'
      )
    );
  }

  // =========
  // fallback
  // =========
  return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานครับ'));
}

module.exports = { handleTextMessage };
