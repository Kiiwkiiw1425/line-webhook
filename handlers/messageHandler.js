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

  // default เป็น AI
  const state = getState(userId) || { mode: 'ai' };

  // ===== switch mode =====
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

  // ===== greeting =====
  if (blacklist.includes(userText)) {
    return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานได้เลยครับ'));
  }

  // ===== category/manual =====
  const matched = matchCategory(userText);
  if (matched && categoryMenus[matched]) {
    if (state.mode === 'human') {
      return reply(replyToken, categoryMenus[matched]);
    }
    return reply(replyToken, helpModePreset('เมนูนี้เปิดได้ในโหมดเจ้าหน้าที่'));
  }

  // ===== AI MODE (RAG) =====
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

    if (!hits || hits.length === 0) {
      return reply(replyToken, {
        type: 'text',
        text: 'ไม่พบข้อมูลในคู่มือสำหรับคำถามนี้'
      });
    }

    const { answer } = await askAI(userText, hits);

    return reply(replyToken, [
      { type: 'text', text: answer || NO_DATA_REPLY },
      backToAIPreset('หากต้องการสอบถามเพิ่มเติม สามารถติดต่อเจ้าหน้าที่ได้')
    ]);
  }

  // ===== HUMAN MODE =====
  if (state.mode === 'human') {
    return reply(
      replyToken,
      backToAIPreset(
        'ผมบันทึกข้อความให้เจ้าหน้าที่แล้ว หากต้องการกลับไปถาม AI กดปุ่มด้านล่าง'
      )
    );
  }

  // ===== fallback =====
  return reply(replyToken, helpModePreset('เลือกโหมดการใช้งานครับ'));
}

module.exports = { handleTextMessage };
