// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');
const manualCommand = require('../manual/manualCommand');

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const normalizedText = userText.toLowerCase();

  const state = getState(userId) || {};
  const mode = state.mode || 'ai';

  /** ---------------------------
   *  SWITCH MODE (พิมพ์คำสั่ง)
   *  ---------------------------
   */
  if (['ai', 'ถาม ai'].includes(normalizedText)) {
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, {
      type: 'text',
      text: 'เรียบร้อยครับ ตอนนี้กลับมาอยู่ในโหมด AI แล้ว มีเรื่องไหนให้ผมช่วยต่อได้เลยครับ 😊',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (['เจ้าหน้าที่', 'ติดต่อเจ้าหน้าที่', 'human'].includes(normalizedText)) {
    setState(userId, {
      mode: 'human',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, {
      type: 'text',
      text: 'ผมกำลังโอนให้เจ้าหน้าที่ช่วยดูแลคุณต่อนะครับ กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลย',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /** ---------------------------
   *  HUMAN MODE → บอทเงียบ
   *  ---------------------------
   */
  if (mode === 'human') {
    return;
  }

  /** ---------------------------
   *  AI MODE
   *  ---------------------------
   */

  const hits = await retrieve(userText);

  /**
   * ✅ CASE 1 — มีข้อมูลใน RAG
   * ตอบ + แนบคู่มือจริง
   */
  if (hits && hits.length > 0) {
    const { answer } = await askAI(userText, hits);

    // reset counter เมื่อเจอคำตอบ
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, [
      {
        type: 'text',
        text:
          `เดี๋ยวผมสรุปให้แบบเข้าใจง่ายนะครับ\n\n${answer}\n\n` +
          `📘 หากต้องการอ่านรายละเอียดแบบเต็ม สามารถดูจากคู่มือจริงได้ที่เมนูด้านล่างครับ`,
        quickReply: getQuickReplyByMode('ai')
      },
      // ✅ แนบเมนูคู่มือจริงของคุณ
      manualCommand
    ]);
  }

  /**
   * 🟡 CASE 2 — ไม่พบข้อมูล (ครั้งแรก)
   * ตอบเลี่ยงแบบมนุษย์
   */
  const lastQ = state.lastUnansweredQuestion;
  const count = state.unansweredCount || 0;

  if (!lastQ || lastQ !== normalizedText) {
    setState(userId, {
      mode: 'ai',
      lastUnansweredQuestion: normalizedText,
      unansweredCount: 1
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'คำถามนี้เป็นข้อมูลเฉพาะพอสมควรครับ ตอนนี้ผมยังไม่เจอข้อมูลตรงนี้ในระบบ\n\n' +
        'ถ้าสะดวก รบกวนช่วยอธิบายรายละเอียดเพิ่มเติมอีกนิดได้ไหมครับ ' +
        'หรือหากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ ผมสามารถประสานให้ได้ครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /**
   * 🔴 CASE 3 — ถามซ้ำเรื่องเดิม แล้วยังไม่มีข้อมูล
   * ส่งต่อเจ้าหน้าที่
   */
  if (count >= 1) {
    setState(userId, {
      mode: 'human',
      lastUnansweredQuestion: null,
      unansweredCount: 0
    });

    return reply(replyToken, {
      type: 'text',
      text:
        'ผมลองตรวจสอบข้อมูลเพิ่มเติมให้แล้วครับ แต่เรื่องนี้ต้องให้เจ้าหน้าที่ผู้ดูแลระบบช่วยดูรายละเอียดโดยตรง\n\n' +
        'เดี๋ยวผมประสานให้เจ้าหน้าที่ช่วยรับเรื่องต่อให้นะครับ',
      quickReply: getQuickReplyByMode('human')
    });
  }
}

module.exports = { handleTextMessage };
