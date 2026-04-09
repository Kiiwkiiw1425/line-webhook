// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');
const manualCommand = require('../manual/manualCommand');

const INACTIVE_LIMIT_MS = 30 * 60 * 1000; // 30 นาที

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId) || {};

  // =========================
  // 1) สลับโหมดเป็น Human (ต้องตอบทันที 1 ครั้ง)
  // =========================
  if (['เจ้าหน้าที่', 'human', 'ติดต่อเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียดเพิ่มเติม',
      quickReply: getQuickReplyByMode('human')
    });
  }

  // =========================
  // 2) สลับกลับเป็น AI
  // =========================
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai', lastActivity: Date.now() });

    return reply(replyToken, {
      type: 'text',
      text: 'เข้าสู่โหมด AI แล้วครับ สามารถพิมพ์คำถามได้เลย',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  // =========================
  // 3) Human mode = บอทเงียบ
  // =========================
  if (state.mode === 'human') {
    const now = Date.now();
    const last = state.lastActivity || now;
    const inactiveMs = now - last;

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

    return;
  }

  // =========================
  // 4) AI mode (default)
  // =========================
  setState(userId, { mode: 'ai', lastActivity: Date.now() });

  const hits = await retrieve(userText);

  if (hits && hits.length > 0) {
    const { answer } = await askAI(userText, hits);

    return reply(replyToken, [
      {
        type: 'text',
        text: answer,
        quickReply: getQuickReplyByMode('ai')
      },
      manualCommand
    ]);
  }

  // =========================
  // 5) ไม่พบข้อมูล → ตอบเลี่ยง
  // =========================
  return reply(replyToken, {
    type: 'text',
    text:
      'ขณะนี้ยังไม่พบข้อมูลที่ตรงกับคำถามนี้ หากต้องการข้อมูลเพิ่มเติมสามารถติดต่อเจ้าหน้าที่ได้ครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
