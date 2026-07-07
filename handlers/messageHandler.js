// handlers/messageHandler.js

const { reply } = require('../services/lineClient');
const { getState, setState, shouldNotify } = require('../services/stateStore');
const { retrieve } = require('../services/ragStore');
const { askAI } = require('../services/aiService.gemini');
const { notifyAgent } = require('../services/notifyAgent');
const { getQuickReplyByMode } = require('../quickreply/presets');

/* =================================================
 * Utils
 * ================================================= */

const ACK_WORDS = [
  'ครับ',
  'ค่ะ',
  'โอเค',
  'ok',
  'เข้าใจแล้ว',
  'ได้ครับ',
  'ขอบคุณ',
  'ขอบคุณครับ',
  'thanks'
];

function isAckOnly(text = '') {
  return ACK_WORDS.includes(text.trim().toLowerCase());
}

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
  const userId =
    event.source.userId ||
    event.source.groupId ||
    event.source.roomId;

  const userText = (event.message.text || '').trim();
  const lowerText = userText.toLowerCase();

  const state = getState(userId) || {};

  // ==========================
  // Manual Switch Command
  // ==========================

  if (
    lowerText === '#admin' ||
    lowerText === 'เจ้าหน้าที่' ||
    lowerText === 'ติดต่อเจ้าหน้าที่' ||
    lowerText === 'คุยกับเจ้าหน้าที่'
  ) {

    setState(userId, {
      mode: 'human'
    });

    if (shouldNotify(state)) {
      await notifyAgent(event, {
        lastUserText: userText
      });

      setState(userId, {
        notifiedAt: Date.now()
      });
    }

    return reply(replyToken, {
      type: 'text',
      text:
        '✅ เชื่อมต่อเจ้าหน้าที่เรียบร้อยแล้ว\n\n' +
        'ระหว่างนี้ระบบจะหยุดตอบอัตโนมัติ กรุณารอเจ้าหน้าที่ตอบกลับ',
      quickReply: getQuickReplyByMode('human')
    });
  }

  if (lowerText === '#bot') {

    setState(userId, {
      mode: 'ai'
    });

    return reply(replyToken, {
      type: 'text',
      text:
        '✅ กลับเข้าสู่โหมด AI แล้วครับ\n\n' +
        'สามารถพิมพ์คำถามได้ทันที',
      quickReply: getQuickReplyByMode('ai')
    });
  }

  // ==========================
  // ACK ONLY
  // ==========================

  if (isAckOnly(lowerText)) {
    return;
  }

  // ==========================
  // HUMAN MODE
  // ==========================

  if (state.mode === 'human') {
    return;
  }

  // ==========================
  // RAG SEARCH
  // ==========================

  const hits = await retrieve(userText, state);

  if (hits.length > 0) {

    setState(userId, {
      mode: 'ai',
      lastTopic: hits[0].category
    });

    let finalAnswer;

    try {

      const result = await askAI(
        userText,
        [],
        hits
      );

      if (
        result.failed ||
        !result.answer
      ) {

        finalAnswer =
          'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้\n\n' +
          summarizeFromRag(hits);

      } else {

        finalAnswer = result.answer;
      }

    } catch (err) {

      console.warn(
        '[Gemini Error]',
        err.message
      );

      finalAnswer =
        'จากคู่มือของระบบ พบข้อมูลที่เกี่ยวข้องดังนี้\n\n' +
        summarizeFromRag(hits);
    }

    return reply(replyToken, {
      type: 'text',
      text: finalAnswer,
      quickReply: getQuickReplyByMode('ai')
    });
  }

  // ==========================
  // NOT FOUND
  // AUTO SWITCH TO HUMAN
  // ==========================

  setState(userId, {
    mode: 'human'
  });

  if (shouldNotify(state)) {

    await notifyAgent(event, {
      lastUserText: userText
    });

    setState(userId, {
      notifiedAt: Date.now()
    });
  }

  return reply(replyToken, {
    type: 'text',
    text:
      'ขออภัยครับ ไม่พบข้อมูลในคู่มือระบบ\n\n' +
      'ระบบได้ส่งเรื่องต่อให้เจ้าหน้าที่แล้ว กรุณารอสักครู่',
    quickReply: getQuickReplyByMode('human')
  });
}

module.exports = {
  handleTextMessage
};
