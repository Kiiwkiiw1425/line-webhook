// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');
const manuals = require('../manual');
const usageGeneralManual = require('../manual/manualUsageGeneral');

const INACTIVE_LIMIT_MS = 30 * 60 * 1000;

// ===== keyword groups =====
const GREETING_WORDS = ['สวัสดี', 'hello', 'hi'];
const THANK_WORDS = ['ขอบคุณ', 'ขอบคุณครับ', 'thanks', 'ok', 'โอเค', 'เข้าใจแล้ว'];

const HUMAN_KEYWORDS = [
  'เจ้าหน้าที่',
  'ติดต่อเจ้าหน้าที่',
  'ขอคุยกับคน',
  'คุยกับคน',
  'สอบถามเจ้าหน้าที่',
  'ขอเจ้าหน้าที่',
  'human'
];

function containsAny(text, list) {
  return list.some(k => text.includes(k));
}

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();
  const state = getState(userId) || {};

  /* =================================================
   * 0) คำทัก / คำขอบคุณ (social signal)
   * ================================================= */
  if (containsAny(lowerText, GREETING_WORDS)) {
    return reply(replyToken, {
      type: 'text',
      text: 'สวัสดีครับ 😊 ผมสามารถช่วยตอบคำถามหรือแนะนำการใช้งานระบบให้ได้นะครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (containsAny(lowerText, THANK_WORDS) && state.mode !== 'human') {
    return reply(replyToken, {
      type: 'text',
      text: 'ยินดีมากครับ 😊 หากมีคำถามเพิ่มเติมสามารถพิมพ์มาได้ทุกเมื่อเลยนะครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* =================================================
   * 1) ผู้ใช้พิมพ์เพื่อ “ติดต่อเจ้าหน้าที่”
   * ================================================= */
  if (containsAny(lowerText, HUMAN_KEYWORDS)) {
    setState(userId, { mode: 'human', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'ได้เลยครับ ผมจะประสานงานให้เจ้าหน้าที่ช่วยดูแลนะครับ กรุณาพิมพ์รายละเอียดเพิ่มเติมได้เลยครับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  /* =================================================
   * 2) คำสั่งกลับ AI
   * ================================================= */
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'กลับเข้าสู่โหมด AI แล้วครับ 🙂 สามารถพิมพ์คำถามได้เลยครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* =================================================
   * 3) HUMAN MODE = bot เงียบ (ยกเว้น inactivity)
   * ================================================= */
  if (state.mode === 'human') {
    const now = Date.now();
    const inactiveMs = now - (state.lastActivity || now);

    if (inactiveMs >= INACTIVE_LIMIT_MS && !state.promptedAfterInactive) {
      setState(userId, { promptedAfterInactive: true, lastActivity: now });

      return reply(replyToken, {
        type: 'text',
        text: 'ขออนุญาตสอบถามนะครับ ตอนนี้ยังต้องการพูดคุยต่อหรือไม่ครับ 🙂',
        quickReply: {
          items: [
            { type: 'action', action: { type: 'postback', label: 'คุยต่อ', data: 'conv=continue' }},
            { type: 'action', action: { type: 'postback', label: '🤖 ถามตอบด้วย AI', data: 'mode=ai' }}
          ]
        }
      });
    }

    return; // ✅ human mode = เงียบ
  }

  /* =================================================
   * 4) AI MODE (default)
   * ================================================= */
  setState(userId, { mode: 'ai', lastActivity: Date.now() });

  const hits = await retrieve(userText);
  const { answer } = await askAI(userText, hits);

  const messages = [];

  // ✅ AI answer (ต้องมีเสมอ)
  messages.push({
    type: 'text',
    text: answer,
    quickReply: getQuickReplyByMode('ai')
  });

  /* =================================================
   * 5) แนบคู่มือ (ถ้าเดาได้ว่าเกี่ยวกับหมวดใด)
   * ================================================= */
  let manualSection;

  // ตัวอย่าง mapping พื้นฐาน (คุณขยายต่อได้)
  if (/ลงทะเบียน|บรรจุ|แต่งตั้ง|รับโอน/.test(lowerText)) {
    manualSection = manuals.command;
  }

  if (manualSection && manualSection.items?.length) {
    let manualText = `📘 ${manualSection.title}\n`;

    manualSection.items.forEach(item => {
      manualText += `\n🔗 ${item.label}\n${item.url}\n`;
    });

    messages.push({
      type: 'text',
      text: manualText
    });
  }

  /* =================================================
   * 6) Safety net (กัน messages ว่าง)
   * ================================================= */
  if (messages.length === 0) {
    messages.push({
      type: 'text',
      text: 'ขออภัยครับ ระบบกำลังประมวลผล กรุณาลองใหม่อีกครั้ง'
    });
  }

  return reply(replyToken, messages);
}

module.exports = { handleTextMessage };
