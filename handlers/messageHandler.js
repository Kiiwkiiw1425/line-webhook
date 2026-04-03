// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState } = require('../services/stateStore');
const { askAI } = require('../services/aiService.gemini');
const { retrieve } = require('../services/ragStore');
const { withModeSwitch } = require('../quickreply/presets'); // ✅ เพิ่ม

const INACTIVE_LIMIT_MS = 30 * 60 * 1000;

async function handleTextMessage(event) {
  const replyToken = event.replyToken;
  const userId = event.source.userId;
  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  let state = getState(userId) || {};

  // =====================
  // ✅ พิมพ์สลับโหมด (เผื่อ Desktop)
  // =====================
  if (['ai', 'ถาม ai', 'โหมด ai'].includes(lowerText)) {
    setState(userId, { mode: 'ai' });
    return reply(
      replyToken,
      withModeSwitch('เข้าสู่โหมด AI แล้วครับ')
    );
  }

  if (['เจ้าหน้าที่', 'human', 'ติดต่อเจ้าหน้าที่'].includes(lowerText)) {
    setState(userId, { mode: 'human' });
    return reply(replyToken, {
      type: 'text',
      text: 'เจ้าหน้าที่กำลังดูแลคุณอยู่ครับ กรุณาพิมพ์รายละเอียด'
    });
  }

  // =====================
  // ✅ HUMAN MODE (บอทเงียบ)
  // =====================
  if (state.mode === 'human') {
    const now = Date.now();
    const lastActivity = state.lastActivity || now;
    const inactiveMs = now - lastActivity;

    // ยังไม่เกิน 30 นาที → เงียบ
    if (inactiveMs < INACTIVE_LIMIT_MS) {
      return;
    }

    // เกิน 30 นาที → ถามครั้งเดียว
    if (!state.promptedAfterInactive) {
      setState(userId, { promptedAfterInactive: true });
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
                label: 'จบการสนทนา',
                data: 'conv=end'
              }
            }
          ]
        }
      });
    }

    return;
  }

  // =====================
  // ✅ AI MODE (default)
  // =====================
  if (!state.mode) {
    setState(userId, { mode: 'ai' });
  }

  const hits = await retrieve(userText);

  // ✅ มีข้อมูลใน RAG → ตอบเลย
  if (hits.length > 0) {
    const { answer } = await askAI(userText, hits);
    return reply(
      replyToken,
      withModeSwitch(answer)
    );
  }

  // ❌ ไม่มีข้อมูลจริง ๆ
  return reply(
    replyToken,
    withModeSwitch(
      'ไม่พบข้อมูลในคู่มือ หากต้องการสอบถามเพิ่มเติม กรุณาระบุรายละเอียดเพิ่ม หรือเลือกโหมดด้านล่าง'
    )
  );
}

module.exports = { handleTextMessage };
