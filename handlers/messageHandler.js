// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

/* =================================================
 * Utils
 * ================================================= */

// คำตอบรับเฉย ๆ → เงียบ (เหมือนมนุษย์)
const ACK_WORDS = [
  'ครับ', 'ค่ะ', 'โอเค', 'ok',
  'เข้าใจแล้ว', 'ได้ครับ',
  'ขอบคุณ', 'ขอบคุณครับ', 'thanks'
];

function isAckOnly(text = '') {
  return ACK_WORDS.includes(text.trim().toLowerCase());
}

// สรุปจาก RAG ตรง ๆ (ใช้เมื่อ Gemini error)
function summarizeFromRag(hits) {
  return hits
    .map(h => `• ${h.title}\n${h.content}`)
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

  /* 0) ตอบรับเฉย ๆ → ไม่ต้องตอบ */
  if (isAckOnly(lowerText)) {
    return;
  }

  /* 1) โหมดเจ้าหน้าที่ → บอทเงียบ */
  if (state.mode === 'human') {
    return;
  }

  /* 2) RAG ต้องมาก่อนเสมอ (พร้อม context) */
  const hits = await retrieve(userText, state);

  /**
   * ✅ RULE สำคัญที่สุด
   * ถ้ามี RAG data → ต้องตอบ
   */
  if (hits.length > 0) {

    // จดจำหัวข้อสนทนา (เช่น Password / Register)
    setState(userId, {
      mode: 'ai',
      lastTopic: hits[0].category
    });

    let finalAnswer;

    try {
      // พยายามให้ Gemini เรียบเรียง
      const { answer } = await askAI(userText, hits);
      finalAnswer = answer;
    } catch (err) {
      // Gemini ล่ม (503) → ใช้ RAG ตรง ๆ
      console.warn('[Gemini Error] fallback to RAG:', err.message);
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

  /* 3) ไม่มี RAG จริง ๆ เท่านั้น ค่อยส่งเจ้าหน้าที่ */
  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ตอนนี้ยังไม่พบข้อมูลในหัวข้อนี้ในระบบ\n' +
      'หากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ สามารถพิมพ์ว่า “ติดต่อเจ้าหน้าที่” ได้เลยนะครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
