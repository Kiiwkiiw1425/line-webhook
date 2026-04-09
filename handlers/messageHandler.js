// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { getQuickReplyByMode } = require('../quickreply/presets');
const manualCommand = require('../manual/manualCommand');

const INACTIVE_LIMIT_MS = 30 * 60 * 1000;

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const text = (event.message.text || '').trim().toLowerCase();

  let state = getState(userId) || {};

  // ---------- SWITCH MODE ----------
  if (['ai', 'ถาม ai'].includes(text)) {
    setState(userId, { mode: 'ai' });
    return reply(replyToken, {
      type: 'text',
      text: 'เข้าสู่โหมด AI ครับ',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  if (['human', 'ติดต่อเจ้าหน้าที่'].includes(text)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, {
      type: 'text',
      text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  // ---------- HUMAN MODE ----------
  if (state.mode === 'human') {
    const now = Date.now();
    const inactiveMs = now - (state.lastActivity || now);

    if (inactiveMs >= INACTIVE_LIMIT_MS && !state.promptedAfterInactive) {
      setState(userId, { promptedAfterInactive: true });

      return reply(replyToken, {
        type: 'text',
        text: 'ยังต้องการคุยต่อหรือไม่ครับ?',
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
                label: 'กลับไป AI',
                data: 'mode=ai'
              }
            }
          ]
        }
      });
    }

    return; // Human mode → เงียบ
  }

  // ---------- AI MODE ----------
  setState(userId, { mode: 'ai', lastActivity: Date.now() });

  const hits = await retrieve(text);

  if (hits.length > 0) {
    const { answer } = await askAI(text, hits);

    return reply(replyToken, [
      {
        type: 'text',
        text: answer,
        quickReply: getQuickReplyByMode('ai')
      },
      // แนบเมนูคู่มือของคุณ
      manualCommand
    ]);
  }

  // ไม่มีข้อมูลใน RAG
  return reply(replyToken, {
    type: 'text',
    text: 'ไม่พบข้อมูลในคู่มือสำหรับคำถามนี้ครับ',
    quickReply: getQuickReplyByMode('ai')
  });
}

module.exports = { handleTextMessage };
