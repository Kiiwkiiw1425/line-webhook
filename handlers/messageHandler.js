// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

/* =================================================
 * Utils: Human-like behavior
 * ================================================= */

// คำตอบรับเฉย ๆ → เงียบ
const ACK_WORDS = [
  'ครับ','ค่ะ','โอเค','ok','เข้าใจแล้ว','ได้ครับ',
  'ขอบคุณ','ขอบคุณครับ','thanks','thank you'
];

function isAckOnly(text = '') {
  return ACK_WORDS.includes(text.trim().toLowerCase());
}

// สรุปจาก RAG ตรง ๆ (fallback เมื่อ AI error)
function summarizeFromRag(hits) {
  return hits
    .map(h => `• ${h.title || ''}\n${h.content}`)
    .join('\n\n');
}

/* =================================================
 * Main handler
 * ================================================= */

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();
  const state = getState(userId) || {};

  /* -------------------------------------------------
   * 0) คำตอบรับเฉย ๆ → ไม่ต้องตอบ
   * ------------------------------------------------- */
  if (isAckOnly(lowerText)) {
    return;
  }

  /* -------------------------------------------------
   * 1) เปลี่ยนโหมด (พิมพ์)
   * ------------------------------------------------- */
  if (['ai', 'โหมด ai', 'ถาม ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'กลับมาอยู่ในโหมด AI แล้วครับ 😊',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (['เจ้าหน้าที่', 'ติดต่อเจ้าหน้าที่', 'human'].includes(lowerText)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, {
      type: 'text',
      text: 'ผมโอนให้เจ้าหน้าที่ช่วยดูแลต่อนะครับ กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* -------------------------------------------------
   * 2) Human mode → บอทเงียบ
   * ------------------------------------------------- */
  if (state.mode === 'human') {
    return;
  }

  /* -------------------------------------------------
   * 3) AI MODE (Context-aware)
   * ------------------------------------------------- */

  /**
   * ✨ จุดสำคัญมาก ✨
   * ให้ retrieve รู้ context ก่อนหน้า (lastTopic)
   * เพื่อเข้าใจคำถามต่อเนื่อง เช่น
   * otp → กรอกไม่ได้
   */
  const hits = await retrieve(userText, state);

  // ถ้า RAG มีข้อมูล → ต้องตอบเสมอ
  if (hits.length > 0) {

    // ✅ จำ topic ล่าสุด (Register / Password / OTP ฯลฯ)
    setState(userId, {
      mode: 'ai',
      lastTopic: hits[0].category
    });

    let finalAnswer;

    try {
      // ✅ ใช้ Gemini เรียบเรียง
      const { answer } = await askAI(userText, hits);
      finalAnswer = answer;
    } catch (err) {
      // ✅ Gemini error (เช่น 503) → fallback จาก RAG
      console.warn('Gemini error, fallback to RAG:', err.message);
      finalAnswer =
        'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้นะครับ\n\n' +
        summarizeFromRag(hits);
    }

    return reply(replyToken, {
      type: 'text',
      text:
        `เดี๋ยวผมสรุปข้อมูลให้แบบเข้าใจง่ายนะครับ\n\n${finalAnswer}`,
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* -------------------------------------------------
   * 4) ไม่มีข้อมูลจริง ๆ เท่านั้น → fallback สุดท้าย
   * ------------------------------------------------- */
  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ตอนนี้ยังไม่พบข้อมูลในหัวข้อนี้ในระบบ\n' +
      'หากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ สามารถพิมพ์ว่า “ติดต่อเจ้าหน้าที่” ได้เลยนะครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
