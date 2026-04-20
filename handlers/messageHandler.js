// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');

// ✅ คู่มือคำสั่ง (มี keywords)
const manualCommand = require('../manual/manualCommand');

/**
 * fallback category กรณี retrieve ไม่เจอ
 * (ไม่ใช่ intent system แค่ keyword mapping ตรง ๆ)
 */
function detectRagCategoryFallback(text = '') {
  if (/ลงทะเบียน|สมัคร|register/.test(text)) return 'DPIS6-Registration';
  return null;
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();
  const state = getState(userId) || {};

  /* =================================================
   * 1) สลับโหมดด้วยการพิมพ์
   * ================================================= */
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'เรียบร้อยครับ กลับมาอยู่ในโหมด AI แล้ว สามารถถามต่อได้เลยครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (['เจ้าหน้าที่', 'ติดต่อเจ้าหน้าที่', 'human'].includes(lowerText)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, {
      type: 'text',
      text: 'ผมโอนให้เจ้าหน้าที่ช่วยดูแลต่อแล้วครับ กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลย',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* =================================================
   * 2) Human mode = บอทเงียบ
   * ================================================= */
  if (state.mode === 'human') {
    return;
  }

  /* =================================================
   * 3) AI MODE
   * ================================================= */
  const hits = await retrieve(userText);

  // ✅ fallback category จาก keyword กรณี retrieve strict
  const fallbackCategory = detectRagCategoryFallback(lowerText);

  // ✅ ถือว่ามีข้อมูล ถ้า:
  // - retrieve เจอ
  // - หรือ keyword ตรงหมวดที่รู้แน่ (เช่น ลงทะเบียน)
  if (hits.length > 0 || fallbackCategory) {
    const effectiveHits =
      hits.length > 0
        ? hits
        : [
            {
              category: fallbackCategory,
              content: 'ขั้นตอนการลงทะเบียนเข้าใช้งานระบบ DPIS6'
            }
          ];

    const { answer } = await askAI(userText, effectiveHits);

    const messages = [];

    // ✅ ส่วนที่ 1: AI ตอบจาก RAG
    messages.push({
      type: 'text',
      text:
        `เดี๋ยวผมสรุปขั้นตอนการใช้งานให้แบบเข้าใจง่ายนะครับ\n\n${answer}`,
      quickReply: getQuickReplyByMode('ai')
    });

    // ✅ ส่วนที่ 2: แนบคู่มือที่ keyword ตรง
    const relatedManuals = manualCommand.items.filter(item =>
      item.keywords &&
      item.keywords.some(k => lowerText.includes(k))
    );

    if (relatedManuals.length > 0) {
      let manualText =
        '📘 ดูรายละเอียดเพิ่มเติม สามารถเปิดคู่มือได้จากลิงก์ด้านล่างครับ\n\n';

      relatedManuals.forEach(item => {
        manualText += `🔗 ${item.label}\n${item.url}\n\n`;
      });

      messages.push({
        type: 'text',
        text: manualText.trim()
      });
    }

    return reply(replyToken, messages);
  }

  /* =================================================
   * 4) fallback สุดท้ายจริง ๆ
   * ================================================= */
  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ตอนนี้ยังไม่มีข้อมูลในหัวข้อนี้ในระบบ ' +
      'หากต้องการให้เจ้าหน้าที่ช่วยตรวจสอบ สามารถพิมพ์ “ติดต่อเจ้าหน้าที่” ได้เลยครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
