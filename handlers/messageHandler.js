// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');

// ✅ Quick Reply ตามโหมด
const { getQuickReplyByMode } = require('../quickreply/presets');

// ✅ เมนูคู่มือจริง (SharePoint / PDF)
const manualCommand = require('../manual/manualCommand');

const INACTIVE_LIMIT_MS = 30 * 60 * 1000; // 30 นาที

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId) || {};

  /* =================================================
   * ✅ 1) คำสั่งสลับโหมด — ต้อง reply ทันที
   * ================================================= */

  // 👉 เข้าสู่โหมดเจ้าหน้าที่ (ต้องพูด 1 ครั้ง)
  if (['เจ้าหน้าที่', 'human', 'ติดต่อเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียดเพิ่มเติม',
      quickReply: getQuickReplyByMode('human')
    });
  }

  // 👉 กลับไปโหมด AI
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'เข้าสู่โหมด AI แล้วครับ สามารถพิมพ์คำถามได้เลย',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  /* =================================================
   * ✅ 2) HUMAN MODE = บอทเงียบ
   * ================================================= */
  if (state.mode === 'human') {
    const now = Date.now();
    const inactiveMs = now - (state.lastActivity || now);

    // inactivity 30 นาที → ถามครั้งเดียว
    if (inactiveMs >= INACTIVE_LIMIT_MS && !state.promptedAfterInactive) {
      setState(userId, {
        promptedAfterInactive: true,
        lastActivity: now
      });

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
                label: '🤖 ถามตอบด้วย AI',
                data: 'mode=ai'
              }
            }
          ]
        }
      });
    }

    // ✅ กรณีปกติ human mode = เงียบ
    return;
  }

  /* =================================================
   * ✅ 3) AI MODE (default)
   * ================================================= */
  setState(userId, { mode: 'ai', lastActivity: Date.now() });

  const hits = await retrieve(userText);

  // ✅ RAG เจอข้อมูล → AI สรุป + แนบคู่มือ
  if (hits && hits.length > 0) {
    const { answer } = await askAI(userText, hits);

    return reply(replyToken, [
      {
        type: 'text',
