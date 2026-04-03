// handlers/messageHandler.js
const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { withModeSwitch } = require('../quickreply/presets');
const { readMoreQuickReply } = require('../quickreply/readMore');

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const text = (event.message.text || '').trim();

  const state = getState(userId) || {};

  // ✅ ถ้าอยู่ human → เงียบ
  if (state.mode === 'human') return;

  setState(userId, { mode: 'ai' });

  const hits = await retrieve(text);

  if (hits.length > 0) {
    const { answer } = await askAI(text, hits);

    return reply(replyToken, {
      type: 'text',
      text: answer,
      ...withModeSwitch(''),
      ...readMoreQuickReply('DPIS6-Registration')
    });
  }

  return reply(replyToken, withModeSwitch('ไม่พบข้อมูลที่เกี่ยวข้อง'));
}

module.exports = { handleTextMessage };
